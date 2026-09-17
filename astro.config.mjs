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
    // options live in ec.config.mjs so the <Code> component can load them too
    expressiveCode(),
    mdx(),
    pagefind(),
  ],
});
