import { defineConfig } from "vitepress";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Caby",
  description: "Caby — A self-hosted file management app",
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    plugins: [groupIconVitePlugin()],
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Documentation", link: "/docs" },
    ],

    sidebar: {
      "/docs/": [
        { text: "Overview", link: "/docs/overview" },
        { text: "What is Caby?", link: "/docs/what-is-caby" },
        {
          text: "Installation",
          items: [
            { text: "Docker", link: "/docs/installation/docker" },
            { text: "Kubernetes", link: "/docs/installation/kubernetes" },
          ],
        },
        {
          text: "Configuration",
          items: [
            { text: "Main Config", link: "/docs/configuration/main-config" },
          ],
        },
      ],
      "/": [
        {
          text: "TODO: Remove",
          items: [
            { text: "Markdown Examples", link: "/markdown-examples" },
            { text: "Runtime API Examples", link: "/api-examples" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/caby-io" }],
  },
});
