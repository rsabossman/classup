// Runs only for the homepage ("/", see run_worker_first in wrangler.jsonc); every other path is served
// straight from static assets. It reads the visitor's country from Cloudflare and fills in their region,
// so the search box shows the right fees and the advisor widget the right phone and hours, with no
// redirect and no extra request. Crawlers get the same page, only the region label differs.
import { regionForCountry, regionLabels, regionNames } from '../src/data/geo';

interface Env { ASSETS: { fetch: (r: Request | URL | string) => Promise<Response> } }

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const res = await env.ASSETS.fetch(req);
    const url = new URL(req.url);
    if (url.pathname !== '/' || req.method !== 'GET' || !res.ok || !(res.headers.get('content-type') || '').includes('text/html')) return res;
    const region = regionForCountry((req as any).cf?.country);
    if (!region) return res;

    let cfg: Record<string, unknown> | null = null;
    if (region !== 'in') { // the static page already carries the India settings
      try { cfg = ((await (await env.ASSETS.fetch(new URL('/region-cfg.json', url))).json()) as any)[region] ?? null; } catch {}
    }
    const out = new HTMLRewriter()
      .on('[data-search]', { element(e) { e.setAttribute('data-region', region); } })
      .on('[data-geo-name]', { element(e) { e.setInnerContent(regionNames[region]); } })
      .on('[data-geo-label]', { element(e) { e.setInnerContent(regionLabels[region]); } })
      .on('.region-switch a', { element(e) { if ((e.getAttribute('href') || '') === `/${region}/`) e.setAttribute('aria-current', 'true'); else e.removeAttribute('aria-current'); } })
      .on('#cu-widget-cfg', { element(e) { if (cfg) e.setInnerContent(JSON.stringify(cfg).replace(/</g, '\\u003c'), { html: true }); } })
      .transform(res);
    const h = new Headers(out.headers);
    h.set('cache-control', 'private, no-cache'); // the page now differs by country
    h.append('vary', 'cf-ipcountry');
    return new Response(out.body, { status: out.status, headers: h });
  },
};
