import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL is set at deploy time (custom domain later). BASE_PATH is only for GitHub Pages previews.
export default defineConfig({
  site: process.env.SITE_URL || 'https://rsabossman.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
