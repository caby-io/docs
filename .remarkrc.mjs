import remarkDefinitionList from "remark-definition-list";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkPresetLintConsistent from "remark-preset-lint-consistent";
import remarkPresetLintRecommended from "remark-preset-lint-recommended";

// remark-stringify writes text nodes verbatim, so this collapses each paragraph to one line.
// keep the plugins above in sync with astro.config.mjs — unparsed syntax lands here as text
function collapseTextNewlines(node) {
  if (node.type === "text" && typeof node.value === "string") {
    node.value = node.value.replace(/[ \t]*\n[ \t]*/g, " ");
  }
  if (Array.isArray(node.children)) {
    node.children.forEach(collapseTextNewlines);
  }
}

function remarkCollapseParagraphs() {
  return (tree) => {
    collapseTextNewlines(tree);
  };
}

export default {
  plugins: [
    remarkFrontmatter,
    remarkMdx,
    remarkGfm,
    // keeps `term` / `:   definition` structured; unparsed, collapsing below eats it
    remarkDefinitionList,
    remarkPresetLintRecommended,
    remarkPresetLintConsistent,
    remarkCollapseParagraphs,
  ],
  // every list here uses `-`; remark-stringify defaults to `*` and would rewrite them all
  settings: {
    bullet: "-",
  },
};
