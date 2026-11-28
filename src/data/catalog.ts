import raw from './catalog.json';

export interface University {
  id: string; name: string; short: string; city: string; est: number;
  approvals: string[]; exams: string; source: string; fee_note?: string; intakes?: string;
  scholarships?: Record<string, number>; other_fees?: string;
}
export type FeeRegion = 'in' | 'saarc' | 'nri' | 'me' | 'sea' | 'africa' | 'intl';
export interface Program {
  id: string; university: string; degree: string; name: string; level: string;
  duration_years: number | null; credits: number | null; fee_inr: number | null;
  specializations: string[]; eligibility_india: string; eligibility_foreign: string;
  source_url: string | null; category: string;
  fee_per_year_inr?: number | null; fee_source?: string | null;
  /** Total program fee by fee region (full-payment plan). nri = Indian nationals living abroad. */
  fees?: Partial<Record<FeeRegion, { amount: number; currency: 'INR' | 'USD'; per_year?: number }>> | null;
  /** Legacy per-semester fields, no longer used. */
  tuition_per_term?: unknown; terms?: number | null;
}

export const universities: Record<string, University> = Object.fromEntries(
  Object.entries(raw.universities).map(([id, u]) => [id, { id, ...(u as any) }])
);
export const programs: Program[] = raw.programs as Program[];
export const updated = raw.updated;

export const uni = (p: Program) => universities[p.university];
export const title = (p: Program) => `${p.name.replace(/^Online /, 'Online ')} – ${uni(p).name}`;
export const inr = (n: number) => '₹' + n.toLocaleString('en-IN');
export const usd = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
const money = (f: { amount: number; currency: string }) => (f.currency === 'INR' ? inr(f.amount) : usd(f.amount));

/** Fee to show for a region: `short` for cards, `long` for the program page. Null = ask an advisor.
 *  All amounts are the university's full-payment total for the whole program. */
export function feeFor(p: Program, region: string): { short: string; long: string } | null {
  const f = p.fees?.[region as FeeRegion];
  if (!f) return null;
  const total = money(f);
  if (region === 'in') return { short: `${total} total`, long: `${total} total for the full program${f.per_year ? ` (or ${inr(f.per_year)} per year)` : ''}, for students in India.` };
  const who = region === 'saarc' ? 'students from SAARC countries' : region === 'intl' ? 'international students' : `students in ${({ me: 'the Gulf and West Asia', sea: 'South East Asia', africa: 'Africa' } as Record<string, string>)[region] || 'your region'}`;
  const nri = p.fees?.nri;
  const nriNote = nri && region !== 'saarc' ? ` Indian nationals living abroad pay ${money(nri)} in total.` : '';
  return { short: `${total} total`, long: `${total} total for the full program, for ${who}.${nriNote}` };
}

export const degreeOrder = ['MBA', 'MCA', 'MCom', 'MA', 'BBA', 'BCA', 'BCom', 'BA', 'PGD', 'DCA', 'Diploma'];
export const degrees = degreeOrder.filter((d) => programs.some((p) => p.degree === d));
export const byDegree = (d: string) => programs.filter((p) => p.degree === d);

export const degreeInfo: Record<string, { full: string; blurb: string }> = {
  MBA: { full: 'Master of Business Administration', blurb: 'A two-year master’s for graduates in any stream. It is the most popular online degree for working professionals who want to move into management.' },
  MCA: { full: 'Master of Computer Applications', blurb: 'A two-year master’s in software, data and cloud, for graduates with a computing or mathematics background.' },
  MCom: { full: 'Master of Commerce', blurb: 'A two-year master’s in accounting, finance and taxation, for commerce graduates.' },
  MA: { full: 'Master of Arts', blurb: 'A two-year master’s in the humanities and social sciences, useful for teaching, civil-service and public-sector careers.' },
  BBA: { full: 'Bachelor of Business Administration', blurb: 'A three-year undergraduate degree in business and management, open to 10+2 students from any stream.' },
  BCA: { full: 'Bachelor of Computer Applications', blurb: 'A three-year undergraduate degree in programming, databases and IT, open after 10+2.' },
  BCom: { full: 'Bachelor of Commerce', blurb: 'A three-year undergraduate degree in accounting, finance and business law.' },
  BA: { full: 'Bachelor of Arts', blurb: 'A three-year undergraduate degree with flexible subject choices in languages and social sciences.' },
  PGD: { full: 'Postgraduate Diploma', blurb: 'A short postgraduate credential in a focused area such as analytics or finance.' },
  DCA: { full: 'Diploma in Computer Applications', blurb: 'A one-year diploma in computer fundamentals and office applications.' },
  Diploma: { full: 'Diploma / Certificate', blurb: 'Six-month certificates and one-year diplomas in job-ready skills.' },
};
