// Captures UTM/referrer once per visit so every lead carries its source.
const KEY = 'cu_src';
function src() {
  try {
    const saved = sessionStorage.getItem(KEY);
    if (saved) return JSON.parse(saved);
    const q = new URLSearchParams(location.search);
    const s: Record<string, string> = { landing: location.pathname, referrer: document.referrer };
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach((k) => { const v = q.get(k); if (v) s[k] = v; });
    sessionStorage.setItem(KEY, JSON.stringify(s));
    return s;
  } catch { return {}; }
}
const source = src();

document.querySelectorAll<HTMLButtonElement>('[data-open]').forEach((b) =>
  b.addEventListener('click', () => (document.getElementById(b.dataset.open!) as HTMLDialogElement)?.showModal())
);
document.querySelectorAll<HTMLButtonElement>('[data-open-chat]').forEach((b) =>
  b.addEventListener('click', () => {
    // Step 3 replaces this with the AI chat widget; until then, fall back to the call-back form.
    const w = (window as any).cuChat;
    if (w?.open) w.open(); else (document.getElementById('callme') as HTMLDialogElement)?.showModal();
  })
);

document.querySelectorAll<HTMLFormElement>('form[data-lead]').forEach((f) =>
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = f.querySelector<HTMLElement>('[data-status]')!;
    const data = Object.fromEntries(new FormData(f).entries());
    const payload = { ...data, region: f.dataset.region, intent: f.dataset.intent, page: location.pathname, ...source, ts: new Date().toISOString() };
    const btn = f.querySelector('button[type=submit]') as HTMLButtonElement;
    btn.disabled = true;
    try {
      if (f.dataset.endpoint) {
        const r = await fetch(f.dataset.endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
        if (!r.ok) throw new Error(String(r.status));
      }
      status.textContent = f.dataset.intent === 'callback' ? 'Thanks! An advisor will call you shortly.' : 'Thanks! An advisor will reach out on WhatsApp or by phone shortly.';
      f.reset();
      (window as any).dataLayer?.push({ event: 'lead', intent: f.dataset.intent, region: f.dataset.region });
    } catch {
      status.textContent = 'Something went wrong. Please try WhatsApp instead.';
    } finally { status.hidden = false; btn.disabled = false; }
  })
);
