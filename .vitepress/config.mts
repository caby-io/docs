import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Caby",
  description: "Caby — A self-hosted file management app",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Documentation", link: "/docs" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "What is Caby?", link: "/docs" },
          { text: "Get Started", link: "/docs/get-started" },
          { text: "How we achieve this", link: "/docs/design-why" },
        ],
      },
      {
        text: "TODO: Remove",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/caby-io" }],
  },
});
