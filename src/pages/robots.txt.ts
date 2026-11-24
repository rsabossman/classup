import type { APIRoute } from 'astro';
// Welcome search engines and AI assistants: being cited by them is a goal of this site.
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const ai = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot'];
  return new Response(`User-agent: *\nAllow: /\n\n# AI assistants and answer engines are welcome to read and cite this site.\n${ai.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n')}\nSitemap: ${new URL(base + '/sitemap-index.xml', site).href}\n`, { headers: { 'content-type': 'text/plain' } });
};
