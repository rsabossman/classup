// Country (ISO 3166-1 alpha-2, as Cloudflare reports it in request.cf.country) or browser time zone to site region.
// Shared by the Worker (worker/index.ts) and the homepage. Plain data, no imports, so the Worker can bundle it.
export type GeoRegion = 'in' | 'saarc' | 'me' | 'sea' | 'africa' | 'intl';

const SAARC = 'NP BD LK BT MV AF PK'.split(' ');
const SEA = 'SG MY TH ID PH VN MM KH LA BN TL'.split(' ');
const ME = 'AE SA QA KW OM BH IQ JO LB IR YE SY PS IL EG'.split(' ');
const AFRICA = ('DZ AO BJ BW BF BI CM CV CF TD KM CG CD CI DJ GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW '
  + 'ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW EH RE YT SH').split(' ');

export function regionForCountry(cc: string | undefined | null): GeoRegion | null {
  const c = (cc || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(c) || c === 'XX' || c === 'T1') return null; // unknown or Tor: let the browser guess
  if (c === 'IN') return 'in';
  if (SAARC.includes(c)) return 'saarc';
  if (SEA.includes(c)) return 'sea';
  if (ME.includes(c)) return 'me';
  if (AFRICA.includes(c)) return 'africa';
  return 'intl';
}

/** Fallback when the country isn't known (local runs, previews without a country): guess from the time zone. */
export function regionForTz(tz: string): GeoRegion {
  if (tz === 'Asia/Calcutta' || tz === 'Asia/Kolkata') return 'in';
  if (/^(Asia\/(Kathmandu|Katmandu|Dhaka|Dacca|Colombo|Thimphu|Thimbu|Kabul|Karachi)|Indian\/Maldives)$/.test(tz)) return 'saarc';
  if (/^Asia\/(Singapore|Kuala_Lumpur|Kuching|Bangkok|Jakarta|Makassar|Jayapura|Pontianak|Manila|Ho_Chi_Minh|Saigon|Yangon|Rangoon|Phnom_Penh|Vientiane|Brunei|Dili)$/.test(tz)) return 'sea';
  if (/^Asia\/(Dubai|Riyadh|Qatar|Kuwait|Bahrain|Muscat|Baghdad|Amman|Beirut|Tehran)/.test(tz)) return 'me';
  if (tz.startsWith('Africa/')) return 'africa';
  return 'intl';
}

export const regionLabels: Record<GeoRegion, string> = { in: 'India', saarc: 'South Asia (SAARC)', me: 'Gulf & Middle East', sea: 'South East Asia', africa: 'Africa', intl: 'Rest of the world' };
export const regionNames: Record<GeoRegion, string> = { in: 'India', saarc: 'SAARC', me: 'Middle East', sea: 'SE Asia', africa: 'Africa', intl: 'International' };
