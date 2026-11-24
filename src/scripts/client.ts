// Where the visitor came from (UTMs, ad click IDs, referrer, landing page), written by the inline
// first-touch script in Attribution.astro. Read at submit time so it is always current.
const src = () => { try { return JSON.parse(sessionStorage.getItem('cu_src') || '{}'); } catch { return {}; } };

document.querySelectorAll<HTMLFormElement>('form[data-lead]').forEach((f) =>
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = f.querySelector<HTMLElement>('[data-status]')!;
    const data = Object.fromEntries(new FormData(f).entries());
    const lead_id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const payload = { ...data, lead_id, region: f.dataset.region, intent: f.dataset.intent, page: location.pathname, ...src(), ts: new Date().toISOString() };
    const btn = f.querySelector('button[type=submit]') as HTMLButtonElement;
    btn.disabled = true;
    try {
      if (f.dataset.endpoint) {
        const r = await fetch(f.dataset.endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
        if (!r.ok) throw new Error(String(r.status));
      }
      status.textContent = f.dataset.intent === 'callback' ? 'Thanks! An advisor will call you shortly.' : 'Thanks! An advisor will call you shortly.';
      f.reset();
      const ev = { event: 'lead', intent: f.dataset.intent, region: f.dataset.region, program: data.program || '', lead_id };
      ((window as any).dataLayer ||= []).push(ev);
      dispatchEvent(new CustomEvent('cu:lead', { detail: ev }));
    } catch {
      status.textContent = 'Something went wrong. Please try again, or use the chat button.';
    } finally { status.hidden = false; btn.disabled = false; }
  })
);

// The contact widget is fetched only after the page has fully loaded and the browser is idle,
// so it never competes with the page itself for bandwidth or main-thread time.
const loadWidget = () => import('./widget');
const idle = (cb: () => void) => ('requestIdleCallback' in window ? (window as any).requestIdleCallback(cb, { timeout: 2000 }) : setTimeout(cb, 200));
if (document.readyState === 'complete') idle(loadWidget);
else addEventListener('load', () => idle(loadWidget), { once: true });
