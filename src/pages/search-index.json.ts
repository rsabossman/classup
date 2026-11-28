import type { APIRoute } from 'astro';
import { programs, uni, feeFor, degreeInfo } from '../data/catalog';
import { url } from '../data/site';

// Compact index for the homepage search box. It is fetched only when a visitor focuses the box
// (or the page was opened with ?q=), so it never adds weight to the first page load.
// Fees come from feeFor(), the same function the program pages use, so the search never shows a fee
// the site doesn't already publish. Regions without an approved fee get none here.
const articles = import.meta.glob<{ frontmatter: { title: string; description?: string } }>('./articles/*.md', { eager: true });

export const GET: APIRoute = () => {
  const p = programs.map((x) => {
    const u = uni(x);
    const fees: Record<string, string> = {};
    for (const r of ['in', 'saarc', 'me', 'sea', 'africa', 'intl']) { const f = feeFor(x, r); if (f) fees[r] = f.short; }
    return {
      id: x.id,
      n: x.name,
      d: x.degree,
      l: x.level,
      u: u.id,
      un: u.name,
      y: x.duration_years,
      // Total India fee in rupees, for "under 1 lakh" style budget filters. Null = not published.
      f: x.fee_inr ?? null,
      fs: fees,
      e: x.eligibility_india,
      s: x.specializations.join(', '),
      t: [x.name, x.degree, degreeInfo[x.degree]?.full, x.category, x.specializations.join(' '), u.name, u.short, u.city].join(' ').toLowerCase(),
    };
  });
  const a = Object.entries(articles).map(([file, m]) => ({
    h: url(`/articles/${file.replace(/^\.\/articles\//, '').replace(/\.md$/, '')}/`),
    n: m.frontmatter.title,
    t: `${m.frontmatter.title} ${m.frontmatter.description || ''}`.toLowerCase(),
  }));
  return new Response(JSON.stringify({ p, a }), { headers: { 'content-type': 'application/json' } });
};
