// Pages write %CABY_VERSION%, never a number. The version itself is resolved at
// build time by src/config/caby-version.mjs and handed in as an option.

// any %CABY_*% left over after substitution is a typo — fail the build rather than
// shipping a placeholder. note the api version (/v0) is a separate contract: not a token.
const leftover = /%CABY_[A-Z0-9_]*%/;

// mdast fields that can carry a token: prose, inline code, fences (body + meta string),
// link targets, and MDX component attributes
const fields = ["value", "meta", "url"];

function substitute(node, replace, path) {
  for (const field of fields) {
    if (typeof node[field] !== "string") continue;
    node[field] = replace(node[field]);
    const stray = leftover.exec(node[field]);
    if (stray) {
      throw new Error(
        `unknown version token ${stray[0]} in ${path ?? "content"}`,
      );
    }
  }
  // mdxJsxFlowElement/mdxJsxTextElement keep attributes outside children
  for (const child of [...(node.attributes ?? []), ...(node.children ?? [])]) {
    substitute(child, replace, path);
  }
}

export default function remarkCabyVersions({ version }) {
  if (!version) {
    throw new Error("remarkCabyVersions needs a version");
  }
  const tokens = {
    // caby ships one version across images and the helm chart
    "%CABY_VERSION%": version,
  };
  const pattern = new RegExp(Object.keys(tokens).join("|"), "g");
  const replace = (value) =>
    value.includes("%CABY_")
      ? value.replace(pattern, (token) => tokens[token])
      : value;

  return (tree, file) => {
    substitute(tree, replace, file?.path);
  };
}
