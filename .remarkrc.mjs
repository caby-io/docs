import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkPresetLintConsistent from "remark-preset-lint-consistent";
import remarkPresetLintRecommended from "remark-preset-lint-recommended";

// remark-stringify writes text nodes verbatim, so this collapses each paragraph to one line
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
    remarkPresetLintRecommended,
    remarkPresetLintConsistent,
    remarkCollapseParagraphs,
  ],
  // matches this repo's existing convention (every list already uses `-`);
  // remark-stringify defaults to `*`, which would rewrite every list on format.
  settings: {
    bullet: "-",
  },
};
