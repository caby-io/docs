import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkPresetLintConsistent from "remark-preset-lint-consistent";
import remarkPresetLintRecommended from "remark-preset-lint-recommended";

export default {
  plugins: [
    remarkFrontmatter,
    remarkMdx,
    remarkGfm,
    remarkPresetLintRecommended,
    remarkPresetLintConsistent,
  ],
  // matches this repo's existing convention (every list already uses `-`);
  // remark-stringify defaults to `*`, which would rewrite every list on format.
  settings: {
    bullet: "-",
  },
};
