// @ts-check
import { defineEcConfig } from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginFileIcons } from "@xt0rted/expressive-code-file-icons";

// lives here rather than in astro.config.mjs so the <Code> component can load it:
// it needs a config it can read on its own, not one holding functions and plugins
export default defineEcConfig({
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
      frameBoxShadowCssValue: "none",
    },
  },
});
