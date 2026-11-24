// Central settings. Replace placeholders when the domain, numbers and agent endpoints are ready.
export const site = {
  name: 'ClassUp',
  tagline: 'Compare UGC-entitled online degrees from established Indian universities',
  // Leads go to SalesKarma (the lead desk), keyed by lead_id. k is this site's public key; only this site's origins are allowed.
  // Nothing goes to HubSpot until a lead is marked ready to enroll.
  leadEndpoint: import.meta.env.PUBLIC_LEAD_ENDPOINT || 'https://api.saleskarma.app/v1/lead?k=sk_a5ced9aff85a95d1a2915456',
  // AI chat widget script (ElevenLabs / other) added in step 3.
  // Cloudflare Web Analytics site token for classuponline.com (visitor counts; manual install, not auto-injected). Loaded after page load, see Base.astro.
  cfAnalyticsToken: 'eda6841b4eb347039f99a98fc0bdeece',
  // Ria, the AI advisor behind the widget's chat (SalesKarma; history is stored server side by lead_id). Empty = guided chat only.
  // Advisor replies from the desk arrive live over a WebSocket on the same API.
  chatEndpoint: import.meta.env.PUBLIC_CHAT_ENDPOINT ?? 'https://api.saleskarma.app/v1/chat?k=sk_a5ced9aff85a95d1a2915456',
  // Paid-ad conversion tags. They load only on the /go/ landing pages, after the page has finished loading,
  // and fire on every lead from the page form or the advisor widget. Empty = that tag is not loaded.
  ads: {
    // Google tag from the ClassUp Google Ads setup (site-wide, loaded after the page; it carries AW-18593585584).
    // When set, landing-page conversions are sent through it, and no second Google Ads tag is loaded.
    gtmId: import.meta.env.PUBLIC_GTM_ID ?? 'GTM-TWZWWGCC',
    googleAdsId: import.meta.env.PUBLIC_GADS_ID || 'AW-18593585584', // ClassUp Google Ads account (standalone)
    googleAdsLeadLabel: import.meta.env.PUBLIC_GADS_LEAD_LABEL || 'Wg2fCImqz74dELCzjqJF', // conversion label of the "Lead" action, e.g. AbCdEfGhIj
    metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID || '1662160548619676', // ClassUp pixel (portfolio 1708552709254667, ad account 2647103285716847)
  },
  chatAgentId: import.meta.env.PUBLIC_CHAT_AGENT_ID || '',
};

export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (p: string) => `${base}${p.startsWith('/') ? p : '/' + p}`;
