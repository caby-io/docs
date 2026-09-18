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
- **Never hardcode caby's version in a page.** Write `%CABY_VERSION%` (image tags, the
  helm `--version`, prose); the build substitutes the newest version published to ghcr,
  resolved at deploy time — no version is stored in this repo. `CABY_VERSION=0.2.0 pnpm
  build` pins one. An unrecognised `%CABY_*%` token fails the build. The API version
  (`/v0`) is a separate contract — it is not a token and never gets swept.
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
- Version sync: `src/plugins/remark-caby-versions.mjs` substitutes `%CABY_VERSION%`
  ahead of expressive-code, which is a rehype plugin. The version is the newest tag
  published to ghcr as *all three* artifacts (`caby-service`, `caby-web`,
  `charts/caby`) — a registry read, like renovate's docker datasource, so the docs can
  never advertise a tag nobody can pull. `.github/actions/caby-version` does it for
  `deploy.yml`; `src/config/caby-version.mjs` is the same lookup for local dev (env →
  registry → `node_modules/.cache`). Both are anonymous: no token anywhere.
  `check-caby-version.yml` (6-hourly, or `repository_dispatch` if caby ever sends one)
  compares that against what caby.io serves and calls `deploy.yml` when they differ.
  caby's CI is deliberately untouched. Nothing is committed; each deploy's run log
  records the version it published. Deliberately light for v0.x — the
  committed-version-file + release-PR model is deferred to v1.0+, when changelogs and
  versioned docs arrive.
  Until a release publishes semver *image* tags (only the chart has `0.1.0` today), a
  fresh clone needs `CABY_VERSION=0.1.0 pnpm dev`.
- Logos: `src/assets/caby-logo-{light,dark}.svg`. Favicon + `CNAME` live in `public/`.
