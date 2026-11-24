// Homepage search box. The page ships only this small file; the program index (about 3.5 KB gzipped)
// is fetched the first time the visitor focuses the box, and the matching code after that.
// Results and the short answer come from the catalog in the browser, so they appear as you type.
// "Ask Ria" hands the question to Ria, the AI advisor, in the chat widget.

import { regionForTz } from '../data/geo';

type Engine = typeof import('./search-engine');
type Ix = import('./search-engine').Index;

const box = document.querySelector<HTMLElement>('[data-search]');
if (box) {
  const form = box.querySelector('form')!;
  const input = form.querySelector('input')!;
  const out = box.querySelector<HTMLElement>('[data-results]')!;
  const indexUrl = box.dataset.index!;
  const base = box.dataset.base || '';
  // The homepage serves every region, so guess it from the time zone (as the hero does) to pick fees and links.
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const region = box.dataset.region !== 'auto' ? box.dataset.region || 'in' : tz ? regionForTz(tz) : 'in';
  const dl = () => ((window as any).dataLayer ||= []);
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

  let ready: Promise<[Engine, Ix]> | null = null;
  const load = () => (ready ||= Promise.all([import('./search-engine'), fetch(indexUrl).then((r) => r.json())]));
  input.addEventListener('focus', load, { once: true });
  input.addEventListener('pointerenter', load, { once: true });

  let last = '', tracked = '', timer: any, count = 0;
  const track = (term: string, how: string) => {
    if (term.length < 3 || term === tracked) return;
    tracked = term;
    dl().push({ event: 'search', search_term: term, search_results: count, search_how: how, region });
    try { history.replaceState(null, '', `?q=${encodeURIComponent(term)}`); } catch {}
  };

  async function run(term: string) {
    term = term.trim();
    if (term === last) return;
    last = term;
    if (!term) { out.hidden = true; out.innerHTML = ''; return; }
    const [eng, ix] = await load();
    if (term !== last) return;
    const r = eng.search(ix, term, region);
    count = r.items.length;
    const top = r.items.slice(0, 6);
    const fee = (p: (typeof top)[0]) => p.fs[region] || (region === 'in' ? 'Fee on request' : 'Fee for your country on request');
    const yrs = (y: number | null) => (y ? `${y} year${y > 1 ? 's' : ''}` : '');
    out.innerHTML = `
      <div class="sr-answer" aria-live="polite">
        <p>${esc(eng.answer(r, region))}</p>
        <div class="sr-cta">
          <button type="button" class="btn" data-ask>Ask Ria about this</button>
          <button type="button" class="btn alt" data-call>Get a free call back</button>
        </div>
      </div>
      ${top.length ? `<ul class="sr-list">${top.map((p) => `
        <li><a href="${base}/${region}/programs/${p.id}/" data-pid="${p.id}">
          <b>${esc(p.n)}</b><span class="muted">${esc(p.un)}</span>
          <span class="sr-meta">${[yrs(p.y), fee(p)].filter(Boolean).map(esc).join(' · ')}</span>
          <span class="sr-elig small muted">Eligibility: ${esc(p.e)}</span>
        </a></li>`).join('')}</ul>` : ''}
      <p class="small sr-more">${r.items.length > top.length ? `<a href="${base}/${region}/${r.q.degrees.length === 1 ? `online-${r.q.degrees[0].toLowerCase()}` : 'programs'}/">See all ${r.items.length} matches</a> · ` : ''}${r.guide ? `Guide: <a href="${r.guide.h}">${esc(r.guide.n)}</a>` : ''}</p>`;
    out.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(() => track(term, 'typed'), 1500);
  }

  let deb: any;
  input.addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(() => run(input.value), 90); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await run(input.value);
    clearTimeout(timer);
    track(input.value.trim(), 'enter');
    if (!out.hidden && out.getBoundingClientRect().top > innerHeight - 120) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  box.querySelectorAll<HTMLButtonElement>('[data-try]').forEach((b) => b.addEventListener('click', () => {
    input.value = b.textContent || '';
    run(input.value).then(() => track(input.value, 'suggestion'));
  }));

  const openWidget = async (view: string, opts?: object) => {
    await import('./widget');
    (window as any).cuWidget?.open(view, opts);
  };
  out.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const term = input.value.trim();
    if (t.closest('[data-ask]')) {
      track(term, 'ask');
      dl().push({ event: 'search_ask_ria', search_term: term, region });
      openWidget('chat', { question: term });
    } else if (t.closest('[data-call]')) {
      dl().push({ event: 'search_callback', search_term: term, region });
      openWidget('callback');
    } else {
      const a = t.closest<HTMLAnchorElement>('a[data-pid]');
      if (a) { track(term, 'click'); dl().push({ event: 'search_select', search_term: term, program: a.dataset.pid, region }); }
    }
  });

  // Shared or bookmarked searches (and the WebSite SearchAction): /?q=online+mba
  const q0 = new URLSearchParams(location.search).get('q');
  if (q0) { input.value = q0; tracked = q0.trim(); run(q0); }
}
