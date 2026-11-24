import type { APIRoute } from 'astro';
import { regionList } from '../data/regions';
import { site } from '../data/site';

// Contact-widget settings per region. The Worker swaps these into the homepage for visitors outside India,
// so the widget shows their region's phone number and hours. Same shape as #cu-widget-cfg in Base.astro.
export const GET: APIRoute = () =>
  new Response(JSON.stringify(Object.fromEntries(regionList.map((r) => [r.id, { region: r.id, whatsapp: r.whatsapp, phone: r.phone, hours: r.hours, endpoint: site.leadEndpoint, chat: site.chatEndpoint }]))), { headers: { 'content-type': 'application/json' } });
