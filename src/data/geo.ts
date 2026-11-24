// Country (ISO 3166-1 alpha-2, as Cloudflare reports it in request.cf.country) to site region.
// Shared by the Worker (worker/index.ts) and the homepage. Plain data, no imports, so the Worker can bundle it.
export type GeoRegion = 'in' | 'me' | 'africa' | 'intl';

const ME = 'AE SA QA KW OM BH IQ JO LB IR YE SY PS IL EG'.split(' ');
const AFRICA = ('DZ AO BJ BW BF BI CM CV CF TD KM CG CD CI DJ GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW '
  + 'ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW EH RE YT SH').split(' ');

export function regionForCountry(cc: string | undefined | null): GeoRegion | null {
  const c = (cc || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(c) || c === 'XX' || c === 'T1') return null; // unknown or Tor: let the browser guess
  if (c === 'IN') return 'in';
  if (ME.includes(c)) return 'me';
  if (AFRICA.includes(c)) return 'africa';
  return 'intl';
}

export const regionLabels: Record<GeoRegion, string> = { in: 'India', me: 'Gulf & Middle East', africa: 'Africa', intl: 'Rest of the world' };
export const regionNames: Record<GeoRegion, string> = { in: 'India', me: 'Middle East', africa: 'Africa', intl: 'International' };
