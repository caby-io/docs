# Caby Docs

Documentation site for Caby, built with **Astro + Starlight** (pnpm, Node 22). Deploys to GitHub Pages at `caby.io`.

## Commands

- `pnpm dev` — local dev server (with file-watch polling for WSL2)
- `pnpm build` — production build to `dist/`
- `pnpm preview` — serve the built site

## Conventions

- **All docs pages are `.mdx`** (not `.md`), even prose-only pages. This keeps the
  extension uniform and lets any page drop in a component (`<Steps>`, `<Card>`,
  `<Badge>`, etc.) without a rename. Asides (`:::note`/`:::caution`/…) work the same
  in MDX. Watch for MDX's parsing of literal `{` and `<` in prose.
- Pages live in `src/content/docs/`; the URL is the path minus the extension
  (e.g. `installation/docker.mdx` → `/installation/docker`).
- Navigation (sidebar), redirects, and site config are in `astro.config.mjs`.
- Site-wide style overrides go in `src/styles/` (registered via Starlight `customCss`);
  per-page CSS can be injected via the page's frontmatter `head`.

## Notable pieces

- `src/components/DeployCard.astro` — Starlight-style card with a custom brand icon,
  accent-colored gradient glow, and Astro-docs-style link lists.
- `src/components/brand-icons.ts` — single-path brand logos (Simple Icons) passed to
  `<DeployCard iconPath={…} />` so the long path strings stay out of content files.
- `src/styles/hero.css` — hero/landing tweaks, scoped via the `[data-has-hero]` /
  `[data-has-sidebar]` html attributes (splash home vs. doc-with-hero pages).
- Logos: `src/assets/caby-logo-{light,dark}.svg`. Favicon + `CNAME` live in `public/`.
