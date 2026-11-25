// The Meta pixel's own browser cookies (_fbp, and _fbc after an ad click). Sent with each lead so SalesKarma
// can pass them on with its server-side conversion events, which lets Meta match those events to the ad.
export const metaCookies = (): { fbp?: string; fbc?: string } => {
  const get = (k: string) => document.cookie.split('; ').find((c) => c.startsWith(k + '='))?.slice(k.length + 1);
  const fbp = get('_fbp'), fbc = get('_fbc');
  return { ...(fbp ? { fbp } : {}), ...(fbc ? { fbc } : {}) };
};
