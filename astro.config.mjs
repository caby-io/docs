// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import remarkDefinitionList, {
  defListHastHandlers,
} from "remark-definition-list";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginFileIcons } from "@xt0rted/expressive-code-file-icons";

// build the pagefind static search index from the output HTML after each build
function pagefind() {
  return {
    name: "caby-pagefind",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const site = fileURLToPath(dir);
        const pf = await import("pagefind");
        const { index } = await pf.createIndex();
        await index.addDirectory({ path: site });
        await index.writeFiles({ outputPath: `${site}pagefind` });
        await pf.close();
        logger.info("pagefind index built");
      },
    },
  };
}

export default defineConfig({
  site: "https://caby.io",
  markdown: {
    processor: unified({
      remarkPlugins: [remarkDefinitionList],
      remarkRehype: { handlers: { ...defListHastHandlers } },
    }),
  },
  vite: {
    // WSL2's inotify drops file-change events; polling keeps the dev watcher reliable.
    server: { watch: { usePolling: true } },
    // lightningcss (not esbuild) so backdrop-filter gets autoprefixed for Safari, not stripped
    build: {
      cssMinify: "lightningcss",
      cssTarget: ["chrome111", "firefox113", "safari16"],
    },
  },
  // old VitePress /docs/* inbound links
  redirects: {
    "/docs": "/getting-started",
    "/docs/overview": "/getting-started",
    "/overview": "/getting-started",
    "/docs/what-is-caby": "/what-is-caby",
    "/docs/installation/docker": "/installation/docker",
    "/docs/installation/kubernetes": "/installation/kubernetes",
    "/docs/configuration/main-config": "/configuration/main-config",
    // helm.mdx merged into kubernetes.mdx (#helm / #kubectl sections)
    "/installation/helm": "/installation/kubernetes",
  },
  integrations: [
    icon(),
    // expressiveCode must precede mdx so it processes ``` fences first
    expressiveCode({
      themes: ["github-light", "github-dark"],
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      plugins: [pluginLineNumbers(), pluginFileIcons()],
      defaultProps: { showLineNumbers: false },
      useThemedScrollbars: false,
      // glass frame (matches the nav pill); blur is added in base.css
      styleOverrides: {
        borderColor: "var(--code-border)",
        borderRadius: "var(--code-radius)",
        borderWidth: "1px",
        codeBackground: "var(--code-bg)",
        codeFontFamily: "var(--sl-font-mono)",
        frames: {
          editorActiveTabIndicatorHeight: "1px",
          editorBackground: "var(--code-bg)",
          terminalBackground: "var(--code-bg)",
          // filename tab shares the darker header bg so the whole figcaption reads as one strip
          editorActiveTabBackground: "var(--code-header-bg)",
          editorTabBarBackground: "var(--code-header-bg)",
          terminalTitlebarBackground: "var(--code-header-bg)",
          editorTabBarBorderBottomColor: "var(--code-border)",
          terminalTitlebarBorderBottomColor: "var(--code-border)",
          editorActiveTabIndicatorTopColor: "transparent",
          editorActiveTabIndicatorBottomColor: "var(--sl-color-accent)",
          frameBoxShadowCssValue: "var(--box-shadow-0)",
        },
      },
    }),
    mdx(),
    pagefind(),
  ],
});
