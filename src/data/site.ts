// Central settings. Replace placeholders when the domain, numbers and agent endpoints are ready.
export const site = {
  name: 'ClassUp',
  tagline: 'Compare UGC-entitled online degrees from established Indian universities',
  // Leads go to an n8n webhook that stores them (status "held") in the n8n data table classup_leads, keyed by lead_id.
  // It does not touch HubSpot while the distribution hold is in place.
  leadEndpoint: import.meta.env.PUBLIC_LEAD_ENDPOINT || 'https://university18.app.n8n.cloud/webhook/classup-lead',
  // AI chat widget script (ElevenLabs / other) added in step 3.
  // Cloudflare Web Analytics site token for classuponline.com (visitor counts; manual install, not auto-injected). Loaded after page load, see Base.astro.
  cfAnalyticsToken: 'eda6841b4eb347039f99a98fc0bdeece',
  // Paid-ad conversion tags. They load only on the /go/ landing pages, after the page has finished loading,
  // and fire on every lead from the page form or the advisor widget. Empty = that tag is not loaded.
  ads: {
    googleAdsId: import.meta.env.PUBLIC_GADS_ID || '', // e.g. AW-123456789
    googleAdsLeadLabel: import.meta.env.PUBLIC_GADS_LEAD_LABEL || '', // conversion label of the "Lead" action, e.g. AbCdEfGhIj
    metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID || '', // e.g. 1234567890123456
  },
  chatAgentId: import.meta.env.PUBLIC_CHAT_AGENT_ID || '',
};

export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (p: string) => `${base}${p.startsWith('/') ? p : '/' + p}`;
