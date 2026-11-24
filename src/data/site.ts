// Central settings. Replace placeholders when the domain, numbers and agent endpoints are ready.
export const site = {
  name: 'ClassUp',
  tagline: 'Compare UGC-entitled online degrees from established Indian universities',
  // Lead endpoint: an n8n webhook that writes to HubSpot (step 2). Empty = form shows a thank-you but stores nothing.
  leadEndpoint: import.meta.env.PUBLIC_LEAD_ENDPOINT || '',
  // AI chat widget script (ElevenLabs / other) added in step 3.
  // Cloudflare Web Analytics token (visitor counts). Loaded after page load, see Base.astro.
  cfAnalyticsToken: '3133c074b9d643eda740d9bf6de0469f',
  chatAgentId: import.meta.env.PUBLIC_CHAT_AGENT_ID || '',
};

export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (p: string) => `${base}${p.startsWith('/') ? p : '/' + p}`;
