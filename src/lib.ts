export const faqLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
export const crumbLd = (items: [string, string][]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});

/** First title candidate that fits in a search result (about 65 characters), else the shortest. */
// Bing flags titles over ~60 characters and Google cuts them around there, so every page title is kept to 60.
export const TITLE_MAX = 60;
// Shortening steps, applied one at a time until the title fits. Earlier steps lose the least meaning.
const SHORTEN: [RegExp, string][] = [
  [/ \| ClassUp$/, ''],
  [/\(South East Asia\)/, '(SE Asia)'],
  [/\(International\)/, '(Intl)'],
  [/^Online Diploma \/ Certificate in /, 'Diploma in '],
  [/^Online PG Diploma in /, 'PG Diploma in '],
  [/^Online /, ''],
  [/ \/ /g, '/'],
  [/ and /g, ' & '],
  [/Artificial Intelligence/g, 'AI'],
  [/Machine Learning/g, 'ML'],
  [/ Management\b/g, ' Mgmt'],
];
/** Shorten a title to TITLE_MAX characters: drop the brand suffix, abbreviate, then cut at a word boundary. */
export function shortTitle(t: string, max = TITLE_MAX): string {
  for (const [re, to] of SHORTEN) { if (t.length <= max) return t; t = t.replace(re, to); }
  if (t.length <= max) return t;
  // Keep a trailing "(Region)" tag when cutting, so regional copies stay distinct.
  const tag = t.match(/ \([^()]{1,12}\)$/)?.[0] ?? '';
  const room = max - tag.length;
  const head = t.slice(0, t.length - tag.length);
  const cut = head.slice(0, room + 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:&/–-]+$/, '').replace(/\s+(in|of|or|and|for|the|a|an|to|with)$/i, '') + tag;
}
/** The first candidate that fits in TITLE_MAX, else the shortest one shortened to fit. */
export function fitTitle(...candidates: string[]): string {
  return candidates.find((t) => t.length <= TITLE_MAX) ?? shortTitle(candidates.reduce((a, b) => (b.length < a.length ? b : a)));
}

/** Meta description clipped at a word boundary so search results don't cut it mid-word. */
export function clipDesc(s: string, max = 158): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:–-]+$/, '') + '…';
}
