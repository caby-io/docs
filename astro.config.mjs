// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://caby.io',
  // WSL2's inotify drops file-change events, so Astro's watcher (HMR *and* the
  // auto-restart on astro.config.* edits) can silently miss changes. Polling
  // makes the dev server reliably pick them up. Dev-only; ignored by builds.
  vite: {
    server: {
      watch: { usePolling: true },
    },
  },
  // Preserve inbound links from the old VitePress /docs/* URLs.
  redirects: {
    '/docs': '/getting-started',
    '/docs/overview': '/getting-started',
    '/overview': '/getting-started',
    '/docs/what-is-caby': '/what-is-caby',
    '/docs/installation/docker': '/installation/docker',
    '/docs/installation/kubernetes': '/installation/kubernetes',
    '/docs/configuration/main-config': '/configuration/main-config',
  },
  integrations: [
    starlight({
      title: 'Caby',
      description: 'Caby — A self-hosted file management app',
      customCss: ['./src/styles/hero.css'],
      logo: {
        light: './src/assets/caby-logo-light.svg',
        dark: './src/assets/caby-logo-dark.svg',
        replacesTitle: true, // mirrors VitePress siteTitle: false
      },
      favicon: '/favicon.svg',
      head: [
        {
          tag: 'link',
          attrs: { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/caby-io/caby' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/Z2JkSs2Hzy' },
      ],
      sidebar: [
        {
          label: 'Welcome',
          items: [
            { label: 'Getting Started', link: '/getting-started' },
            { label: 'What is Caby?', link: '/what-is-caby' },
          ],
        },
        {
          label: 'Installation',
          items: [
            { label: 'Docker', link: '/installation/docker' },
            { label: 'Kubernetes', link: '/installation/kubernetes' },
            { label: 'Helm', link: '/installation/helm' },
          ],
        },
        {
          label: 'Configuration',
          items: [{ label: 'Main Config', link: '/configuration/main-config' }],
        },
      ],
    }),
  ],
});
