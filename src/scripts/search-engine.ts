// Reads a plain-English question ("online MBA under 1 lakh", "MCA without maths", "BCA after 12th")
// and turns it into filters over the program index. No network and no AI: it runs instantly in the
// browser, and every fact it shows comes from the catalog. Open questions go to Ria (see search.ts).

export type P = { id: string; n: string; d: string; l: string; u: string; un: string; y: number | null; f: number | null; fs: Record<string, string>; e: string; s: string; t: string };
export type A = { h: string; n: string; t: string };
export type Index = { p: P[]; a: A[] };

export type Query = {
  degrees: string[]; level: '' | 'UG' | 'PG'; max: number | null; cheap: boolean; noMaths: boolean;
  unis: string[]; maxYears: number | null; words: string[];
};
export type Result = { q: Query; items: P[]; priced: number; unpriced: number; wordsMatched: boolean; guide: A | null };

const DEGREES: [string, RegExp][] = [
  ['PGD', /\bpgd\b|\bpg ?diplomas?\b|post ?graduate diplomas?|\bpgdm\b/],
  ['DCA', /\bdca\b|diplomas? in computer/],
  ['MBA', /\bmbas?\b|masters? (?:of |in )?business/],
  ['MCA', /\bmcas?\b|masters? (?:of |in )?computer/],
  ['MCom', /\bmcom\b|masters? (?:of |in )?commerce/],
  ['MA', /\bma\b|masters? (?:of |in )?arts/],
  ['BBA', /\bbbas?\b|bachelors? (?:of |in )?business/],
  ['BCA', /\bbcas?\b|bachelors? (?:of |in )?computer/],
  ['BCom', /\bbcom\b|bachelors? (?:of |in )?commerce/],
  ['BA', /\bba\b|bachelors? (?:of |in )?arts/],
  ['Diploma', /\bdiplomas?\b|\bcertificates?\b|\bcertifications?\b|short courses?/],
];
const UNIS: [string, RegExp][] = [
  ['uom', /\bmysore\b|\bmysuru\b|\buom\b/],
  ['vtu', /\bvtu\b|visvesvaraya/],
  ['gndu', /\bgndu\b|guru nanak|amritsar/],
  ['adbu', /don ?bosco|\badbu\b|\bdbu\b|assam/],
];
const PG = /\b(?:masters?|post ?grad\w*|pg)\b/;
const UG = /\b(?:bachelors?|under ?grad\w*|ug)\b/;
// "after BA" or "after 12th" describe the student, not the degree they want, so they are read first.
const AFTER_PG = /after (?:my |a |the )?(?:graduation|bachelors?|degree|ba|bsc|b ?sc|bcom|btech|b ?tech|be|bca|bba)\b|for graduates/;
const AFTER_UG = /after (?:the |my )?(?:12th|12|10 ?\+ ?2|class 12|school|plus two|\+2|puc)\b/;
const NO_MATHS = /(?:without|no|non|not good (?:at|in)|weak (?:at|in)|didn'?t (?:study|have|take)|did not (?:study|have|take)|don'?t have|never studied)\s*(?:any\s+)?(?:maths?|mathematics)\b|non[- ]?maths?\b|from (?:commerce|arts) background|(?:commerce|arts) (?:background|student|graduate)/;
const CHEAP = /\b(?:cheap(?:est)?|affordable|low(?:est)? (?:fees?|cost)|budget|economical|inexpensive|least expensive)\b/;
const BUDGET = /(?:under|below|less than|within|upto|up to|max(?:imum)?|not more than|<|budget (?:of|is)?|around|about)\s*(?:rs\.?|inr|₹)?\s*([\d][\d,]*(?:\.\d+)?)\s*(lakhs?|lacs?|lac|l|k|thousand)?\b/;
const AMOUNT = /(?:rs\.?|inr|₹)\s*([\d][\d,]*(?:\.\d+)?)\s*(lakhs?|lacs?|l|k|thousand)?\b|\b([\d]+(?:\.\d+)?)\s*(lakhs?|lacs?|lac|k)\b/;
const YEARS = /(\d+(?:\.\d+)?)\s*(?:-\s*)?(?:years?|yrs?)\b|\b(one|two|three) years?\b|\b(\d+|six) months?\b|\bshort(?:est)?\b|\bquick(?:est)?\b|\bfast(?:est)?\b/;

const STOP = new Set(('a an the i im i\'m me my we you your for of in on at to and or with without from by is are am be do does can could should would which what who where how best top good great online distance degree degrees program programs programme programmes course courses '
  + 'study studying want wants need looking look find show get give tell about any some options option fee fees cost price rs inr india indian university universities college colleges uni '
  + 'that this those these it its also please there available eligible eligibility admission admissions apply 2026 2027 year years month months than less more under below within upto up').split(/\s+/));

// Short or spoken forms people type, mapped to words that appear in program names.
const SYN: Record<string, string> = {
  hr: 'human resource', hrm: 'human resource', ai: 'artificial intelligence|\\bai\\b', ml: 'machine learning', ds: 'data science',
  it: '\\bit\\b', iot: 'internet of things', analytics: 'analytic', analyst: 'analytic', data: 'data', marketing: 'marketing',
  finance: 'financ', financial: 'financ', banking: 'financ|banking', accounts: 'commerce|financ', accounting: 'commerce|financ',
  cyber: 'cyber', security: 'security', cloud: 'cloud', coding: 'computer', programming: 'computer', software: 'software|computer',
  healthcare: 'hospital', hospital: 'hospital', health: 'hospital', logistics: 'supply chain', supply: 'supply chain', operations: 'operation',
  startup: 'start-up|entrepreneur', entrepreneurship: 'entrepreneur', business: 'business|management', management: 'management',
  leadership: 'leadership', strategy: 'strateg', testing: 'testing', investment: 'investment', fashion: 'fashion', apparel: 'apparel',
  radio: 'radio', english: 'english', punjabi: 'punjabi', economics: 'economic', history: 'history', politics: 'political', sociology: 'sociolog',
  administration: 'administration', public: 'public', digital: 'digital', it_: 'information technology',
};

const num = (s: string) => Number(s.replace(/,/g, ''));
function money(v: string, unit = ''): number {
  const n = num(v); const u = unit.toLowerCase();
  if (/^l/.test(u)) return n * 100000;
  if (u === 'k' || u === 'thousand') return n * 1000;
  return n < 100 ? n * 100000 : n; // "under 1.5" means 1.5 lakh; "under 80000" means rupees
}

export function parse(raw: string): Query {
  let s = ' ' + raw.toLowerCase().replace(/[’']/g, "'").replace(/\b([bm])\.\s?(com|a|b\.?a|c\.?a)\b\.?/g, (_, a, b) => a + b.replace(/\./g, '')).replace(/\bm\.?b\.?a\b/g, 'mba').replace(/\bb\.?c\.?a\b/g, 'bca').replace(/\bm\.?c\.?a\b/g, 'mca').replace(/\bb\.?b\.?a\b/g, 'bba') + ' ';
  const eat = (re: RegExp) => { const m = s.match(re); if (m) s = s.replace(re, ' '); return m; };
  const q: Query = { degrees: [], level: '', max: null, cheap: false, noMaths: false, unis: [], maxYears: null, words: [] };
  if (eat(NO_MATHS)) q.noMaths = true;
  const afterPG = !!eat(AFTER_PG), afterUG = !!eat(AFTER_UG);
  for (const [d, re] of DEGREES) { const g = new RegExp(re.source, 'g'); if (g.test(s)) { q.degrees.push(d); s = s.replace(g, ' '); } }
  if (q.degrees.includes('PGD') || q.degrees.includes('DCA')) q.degrees = q.degrees.filter((d) => d !== 'Diploma');
  for (const [u, re] of UNIS) if (eat(re)) q.unis.push(u);
  let m = eat(BUDGET);
  if (m) q.max = money(m[1], m[2]);
  else if ((m = eat(AMOUNT))) q.max = money(m[1] || m[3], m[2] || m[4]);
  if (eat(CHEAP)) q.cheap = true;
  if ((m = eat(YEARS))) {
    const w: Record<string, number> = { one: 1, two: 2, three: 3, six: 6 };
    if (m[1]) q.maxYears = num(m[1]);
    else if (m[2]) q.maxYears = w[m[2]];
    else if (m[3]) q.maxYears = (w[m[3]] ?? num(m[3])) / 12;
    else q.maxYears = 1;
  }
  const pg = !!eat(PG), ug = !!eat(UG);
  if (!q.degrees.length) q.level = afterPG || pg ? 'PG' : afterUG || ug ? 'UG' : '';
  q.words = s.split(/[^a-z0-9+#&-]+/).filter((w) => w.length > 1 && !STOP.has(w) && !/^\d+$/.test(w));
  return q;
}

const wordRe = (w: string) => new RegExp(SYN[w] ?? w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/s$/, ''));
const needsMaths = (p: P) => /math/i.test(p.e);

export function search(ix: Index, raw: string, region = 'in'): Result {
  const q = parse(raw);
  const useFees = region === 'in';
  let items = ix.p.filter((p) =>
    (!q.degrees.length || q.degrees.includes(p.d)) &&
    (!q.level || (q.level === 'PG' ? p.l === 'PG' || p.l === 'PG Diploma' : p.l === 'UG')) &&
    (!q.unis.length || q.unis.includes(p.u)) &&
    (!q.noMaths || !needsMaths(p)) &&
    (q.maxYears == null || (p.y != null && p.y <= q.maxYears + 0.01) || (p.y == null && p.l === 'Diploma' && q.maxYears >= 0.5)));

  // Free words ("HR", "data science", "marketing") rank programs; if none of them match anything, they are ignored.
  const res = q.words.map(wordRe);
  const score = (p: P) => res.reduce((n, re) => n + (re.test(p.n.toLowerCase()) ? 3 : re.test(p.s.toLowerCase()) ? 2 : re.test(p.t) ? 1 : 0), 0);
  const scored = items.map((p) => ({ p, sc: score(p) }));
  const wordsMatched = res.length > 0 && scored.some((x) => x.sc > 0);
  const top = Math.max(0, ...scored.map((x) => x.sc));
  const filtered = !!(q.degrees.length || q.level || q.unis.length || q.noMaths || q.maxYears != null || q.max != null || q.cheap);
  // Keep the programs that match most of the words ("digital marketing" keeps marketing programs, not every BCom).
  let list = wordsMatched ? scored.filter((x) => x.sc >= Math.ceil(top / 2)) : res.length && !filtered ? [] : scored;

  let priced = 0, unpriced = 0;
  if (q.max != null && useFees) {
    list = list.filter((x) => x.p.f == null || x.p.f <= q.max!);
    priced = list.filter((x) => x.p.f != null).length;
    unpriced = list.length - priced;
  }
  const fee = (p: P) => (useFees && p.f != null ? p.f : Infinity);
  list.sort((a, b) => b.sc - a.sc || (q.cheap || q.max != null ? fee(a.p) - fee(b.p) : 0) || (fee(a.p) === Infinity ? 1 : 0) - (fee(b.p) === Infinity ? 1 : 0));

  const all = raw.toLowerCase();
  const guide = ix.a.map((a) => ({ a, n: a.t.split(/\W+/).filter((w) => w.length > 2 && !STOP.has(w) && all.includes(w)).length + (q.noMaths && /math/.test(a.t) ? 3 : 0) + (q.degrees.some((d) => new RegExp(`\\b${d.toLowerCase()}\\b`).test(a.n.toLowerCase())) ? 1 : 0) }))
    .filter((x) => x.n >= 2).sort((x, y) => y.n - x.n)[0]?.a ?? null;
  return { q, items: list.map((x) => x.p), priced, unpriced, wordsMatched, guide };
}

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');
const lakh = (n: number) => (n >= 100000 ? `₹${+(n / 100000).toFixed(2)} lakh` : inr(n));
const one = (what: string) => what.replace(/s(?= and|$)/g, '');
const plural: Record<string, string> = { MBA: 'MBAs', MCA: 'MCAs', BBA: 'BBAs', BCA: 'BCAs', BCom: 'BCom programs', MCom: 'MCom programs', MA: 'MA programs', BA: 'BA programs', PGD: 'PG diplomas', DCA: 'computer diplomas', Diploma: 'diplomas and certificates' };

/** One or two plain sentences that answer the question from the results. */
export function answer(r: Result, region = 'in'): string {
  const { q, items } = r;
  const what = q.degrees.length ? q.degrees.map((d) => plural[d] || d).join(' and ') : q.level === 'PG' ? 'postgraduate programs' : q.level === 'UG' ? 'undergraduate programs' : 'programs';
  if (!items.length) return `We couldn’t find online ${what} that match all of that. Try fewer words, or ask Ria and she’ll check with the universities for you.`;
  const parts: string[] = [];
  const n = items.length;
  if (q.max != null && region === 'in') {
    parts.push(r.priced
      ? `${r.priced} online ${r.priced === 1 ? one(what) : what} ${r.priced === 1 ? 'fits' : 'fit'} a budget of ${lakh(q.max)}, based on published fees.`
      : `None of the published fees for online ${what} are under ${lakh(q.max)}.`);
    if (r.unpriced) parts.push(`${r.unpriced} more ${r.unpriced === 1 ? 'has' : 'have'} fees we can share on request.`);
  } else {
    parts.push(`${n} online ${n === 1 ? one(what) : what} ${n === 1 ? 'matches' : 'match'}${q.noMaths ? ' without maths as an entry requirement' : ''}.`);
  }
  if (region === 'in') {
    const cheapest = items.filter((p) => p.f != null).sort((a, b) => a.f! - b.f!)[0];
    if (cheapest && (q.cheap || q.max != null || q.degrees.length)) parts.push(`The lowest published fee is ${inr(cheapest.f!)} in total for the ${cheapest.n} at ${cheapest.un}.`);
  } else if (q.max != null || q.cheap) parts.push('Fees outside India depend on your country, so ask Ria for the fee that applies to you.');
  if (q.noMaths && q.max != null) parts.push('None of these ask for maths.');
  if (q.noMaths) parts.push('Rules can change each intake, so confirm eligibility with an advisor before you apply.');
  if (r.q.words.length && !r.wordsMatched) parts.push(`We don’t list a specialisation matching “${r.q.words.join(' ')}”, so these are the closest programs.`);
  return parts.join(' ');
}
