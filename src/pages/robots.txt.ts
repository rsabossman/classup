import type { APIRoute } from 'astro';
// Welcome search engines and AI assistants: being cited by them is a goal of this site.
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(base + '/sitemap-index.xml', site).href}\n`, { headers: { 'content-type': 'text/plain' } });
};
