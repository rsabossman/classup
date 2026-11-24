import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Articles carry a real date (front matter `updated`, else `date`), so their sitemap entries get an accurate lastmod.
const articleDates = Object.fromEntries(
  readdirSync('src/pages/articles').filter((f) => f.endsWith('.md')).map((f) => {
    const fm = readFileSync(`src/pages/articles/${f}`, 'utf8').split('---')[1] || '';
    const d = (fm.match(/^updated:\s*(\S+)/m) || fm.match(/^date:\s*(\S+)/m) || [])[1];
    return [`/articles/${f.replace(/\.md$/, '')}/`, d];
  }).filter(([, d]) => d),
);

// SITE_URL is set at deploy time (custom domain later). BASE_PATH is only for GitHub Pages previews.
export default defineConfig({
  site: process.env.SITE_URL || 'https://rsabossman.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  // The site CSS is ~2 KB, so inline it: no render-blocking stylesheet request on first paint.
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap({
    serialize(item) {
      const d = articleDates[new URL(item.url).pathname];
      return d ? { ...item, lastmod: new Date(d).toISOString() } : item;
    },
  })],
});
