export const faqLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
export const crumbLd = (items: [string, string][]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});

/** First title candidate that fits in a search result (about 65 characters), else the shortest. */
export function fitTitle(...candidates: string[]): string {
  return candidates.find((t) => t.length <= 65) ?? candidates.reduce((a, b) => (b.length < a.length ? b : a));
}

/** Meta description clipped at a word boundary so search results don't cut it mid-word. */
export function clipDesc(s: string, max = 158): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:–-]+$/, '') + '…';
}
