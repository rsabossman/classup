// One contact widget: chat, WhatsApp, call back, call now and "leave your details".
// It is loaded after the page has finished loading (see client.ts), renders in a shadow root,
// and carries its own styles inline, so it never slows down or restyles the page.

type Cfg = { region: string; whatsapp: string; phone: string; hours: string; endpoint: string };
const cfg: Cfg = JSON.parse(document.getElementById('cu-widget-cfg')?.textContent || '{}');

const css = `
:host{all:initial;font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1d2230}
*{box-sizing:border-box}
.fab{position:fixed;right:16px;bottom:16px;z-index:2147483000;height:56px;padding:0 20px 0 16px;border:0;border-radius:28px;background:#0f5c4d;color:#fff;display:flex;align-items:center;gap:8px;font:600 15px system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.22)}
.fab svg{width:24px;height:24px;fill:currentColor}
@media(max-width:600px){.fab{width:56px;padding:0;justify-content:center}.fab span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}}
.panel{position:fixed;right:16px;bottom:84px;z-index:2147483001;width:min(370px,calc(100vw - 32px));max-height:min(600px,calc(100vh - 110px));background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.25);display:flex;flex-direction:column;overflow:hidden}
.panel[hidden]{display:none}
.hd{background:#0f5c4d;color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px}
.hd b{font-size:16px;display:block}.hd small{opacity:.85}
.hd button{margin-left:auto;background:none;border:0;color:#fff;font-size:22px;cursor:pointer;line-height:1}
.hd .back{margin:0 4px 0 0;font-size:20px}
.bd{padding:14px 16px;overflow:auto;flex:1}
.opt{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:#f6f5f1;border:1px solid #e6e3dc;border-radius:12px;padding:11px 12px;margin:0 0 8px;cursor:pointer;font:inherit;color:inherit;text-decoration:none}
.opt:hover{border-color:#0f5c4d}
.opt i{font-style:normal;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;flex:none}
.opt span b{display:block;font-size:15px}.opt span small{color:#5b6275}
form{display:grid;gap:8px}
input,select,textarea{width:100%;padding:10px;border:1px solid #d9d6cf;border-radius:8px;font:inherit;background:#fff;color:inherit}
label.c{font-size:12px;color:#5b6275;display:flex;gap:6px;align-items:flex-start}
label.c input{width:auto;margin-top:2px}
.btn{background:#0f5c4d;color:#fff;border:0;border-radius:10px;padding:11px;font:600 15px system-ui,sans-serif;cursor:pointer}
.btn:disabled{opacity:.6}
.note{font-size:13px;color:#5b6275;margin:0 0 10px}
.ok{background:#e8f3ef;color:#0f5c4d;border-radius:10px;padding:12px;font-weight:600}
.msgs{display:flex;flex-direction:column;gap:8px}
.m{max-width:85%;padding:9px 12px;border-radius:14px;white-space:pre-wrap}
.m.bot{background:#f1efe9;align-self:flex-start;border-bottom-left-radius:4px}
.m.me{background:#0f5c4d;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:1px solid #0f5c4d;color:#0f5c4d;background:#fff;border-radius:99px;padding:5px 11px;cursor:pointer;font:inherit;font-size:14px}
.ft{border-top:1px solid #eee;padding:8px;display:flex;gap:6px}
.ft input{flex:1}
.ft button{width:auto;padding:0 14px}
`;

const icon = {
  chat: '<svg viewBox="0 0 24 24"><path d="M4 4h16v12H7l-3 3z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>',
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const source = () => { try { return JSON.parse(sessionStorage.getItem('cu_src') || '{}'); } catch { return {}; } };
const pageProgram = () => (document.querySelector('form[data-lead] select[name=program]') as HTMLSelectElement | null)?.value || '';

export async function sendLead(data: Record<string, unknown>) {
  // Every lead needs an id: the lead store keys on it, and the ad conversions reuse it for de-duplication.
  const lead_id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const payload = { ...data, lead_id, program: data.program || pageProgram(), region: cfg.region, page: location.pathname, ...source(), ts: new Date().toISOString(), via: 'widget' };
  if (cfg.endpoint) {
    const r = await fetch(cfg.endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error(String(r.status));
  }
  (window as any).dataLayer?.push({ event: 'lead', intent: data.intent, region: cfg.region, lead_id });
}
const track = (action: string) => (window as any).dataLayer?.push({ event: 'contact_click', action, region: cfg.region });

const host = document.createElement('div');
host.id = 'cu-widget';
const root = host.attachShadow({ mode: 'open' });
root.innerHTML = `<style>${css}</style>
<button class="fab" part="fab" aria-expanded="false" aria-controls="p">${icon.chat}<span>Talk to an advisor</span></button>
<div class="panel" id="p" role="dialog" aria-label="Contact an advisor" hidden>
  <div class="hd"><button class="back" aria-label="Back" hidden>‹</button><div><b data-t>Hi! How can we help?</b><small>Free counselling · ${esc(cfg.hours || '')}</small></div><button class="x" aria-label="Close">×</button></div>
  <div class="bd"></div><div class="ft" hidden></div>
</div>`;
document.body.appendChild(host);

const $ = <T extends Element>(s: string) => root.querySelector(s) as T;
const fab = $<HTMLButtonElement>('.fab'), panel = $<HTMLDivElement>('.panel'), bd = $<HTMLDivElement>('.bd'), ft = $<HTMLDivElement>('.ft');
const back = $<HTMLButtonElement>('.back'), title = $<HTMLElement>('[data-t]');
const waLink = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent('Hi, I would like to know more about online degree programs.')}`;

function open(v = 'home') { panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); show(v); }
function close() { panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); }
fab.addEventListener('click', () => (panel.hidden ? open() : close()));
$('.x').addEventListener('click', close);
back.addEventListener('click', () => show('home'));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) close(); });

const opt = (view: string, color: string, ic: string, t: string, s: string, href = '') =>
  `<${href ? `a href="${href}"${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}` : 'button type="button"'} class="opt" data-v="${view}"><i style="background:${color}">${ic}</i><span><b>${t}</b><small>${s}</small></span></${href ? 'a' : 'button'}>`;

function leadForm(intent: string, note: string, extra = '') {
  return `<p class="note">${note}</p><form>
    <input name="name" placeholder="Your name" required autocomplete="name">
    <input name="phone" placeholder="Mobile / WhatsApp with country code" required autocomplete="tel" inputmode="tel">
    ${extra}
    <label class="c"><input type="checkbox" name="consent" required checked> I agree to be contacted by call, WhatsApp, SMS or email about programs.</label>
    <button class="btn" type="submit">Send</button></form>`;
}

function wire(intent: string, done: string) {
  const f = bd.querySelector('form')!;
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const b = f.querySelector('button') as HTMLButtonElement; b.disabled = true;
    try { await sendLead({ ...Object.fromEntries(new FormData(f).entries()), intent }); bd.innerHTML = `<div class="ok">${done}</div>`; }
    catch { b.disabled = false; b.textContent = 'Try again'; }
  });
}

function show(v: string) {
  back.hidden = v === 'home'; ft.hidden = true; ft.innerHTML = '';
  if (v === 'home') {
    title.textContent = 'Hi! How can we help?';
    bd.innerHTML =
      opt('chat', '#0f5c4d', icon.chat.replace('<svg', '<svg width="18" height="18" fill="#fff"'), 'Chat with us', 'Ask about programs, fees or eligibility') +
      opt('wa-now', '#1f9d55', icon.wa, 'WhatsApp us', 'Opens WhatsApp with our advisors', waLink) +
      opt('wa-msg', '#1f9d55', icon.wa, 'Get details on WhatsApp', 'We’ll message you with fees and intakes') +
      opt('callback', '#d9822b', icon.phone, 'Request a call back', 'An advisor calls you, usually within minutes') +
      opt('call', '#d9822b', icon.phone, 'Call us now', esc(cfg.phone || ''), `tel:${(cfg.phone || '').replace(/[^+\d]/g, '')}`) +
      opt('details', '#5b6275', '✉', 'Leave your details', 'Get a personalised program shortlist');
    bd.querySelectorAll<HTMLElement>('[data-v]').forEach((el) => el.addEventListener('click', () => {
      const t = el.dataset.v!;
      if (t === 'wa-now' || t === 'call') return track(t);
      show(t);
    }));
  } else if (v === 'wa-msg') {
    title.textContent = 'Get details on WhatsApp';
    bd.innerHTML = leadForm('whatsapp', 'We’ll send fees, eligibility and intake dates to your WhatsApp.');
    wire('whatsapp', 'Thanks! Check your WhatsApp in a few minutes.');
  } else if (v === 'callback') {
    title.textContent = 'Request a call back';
    bd.innerHTML = leadForm('callback', `An advisor will call you during ${esc(cfg.hours || 'working hours')}.`,
      `<select name="when"><option value="asap">As soon as possible</option><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option></select>`);
    wire('callback', 'Thanks! An advisor will call you shortly.');
  } else if (v === 'details') {
    title.textContent = 'Leave your details';
    bd.innerHTML = leadForm('enquiry', 'Tell us a little about you and we’ll send a shortlist of programs that fit.',
      `<input name="email" type="email" placeholder="Email (optional)" autocomplete="email"><input name="interest" placeholder="What would you like to study? (e.g. MBA in HR)">`);
    wire('enquiry', 'Thanks! An advisor will reach out on WhatsApp or by phone shortly.');
  } else if (v === 'chat') {
    title.textContent = 'Chat with us';
    const ai = (window as any).cuChat; // The AI agent (step 3) can take over here.
    if (ai?.mount) return ai.mount(bd, { region: cfg.region, sendLead });
    chat();
  }
}

// Guided chat used until the AI agent is connected. Everything the visitor types travels with the lead.
function chat() {
  const log: string[] = [];
  let interest = '';
  bd.innerHTML = '<div class="msgs"></div>';
  const msgs = bd.querySelector('.msgs')!;
  const say = (who: 'bot' | 'me', text: string) => { const d = document.createElement('div'); d.className = `m ${who}`; d.textContent = text; msgs.appendChild(d); log.push(`${who}: ${text}`); bd.scrollTop = bd.scrollHeight; };
  const chips = (list: string[], cb: (s: string) => void) => {
    const c = document.createElement('div'); c.className = 'chips';
    list.forEach((s) => { const b = document.createElement('button'); b.className = 'chip'; b.textContent = s; b.onclick = () => { c.remove(); say('me', s); cb(s); }; c.appendChild(b); });
    msgs.appendChild(c); bd.scrollTop = bd.scrollHeight;
  };
  const askContact = () => {
    say('bot', 'Share your name and WhatsApp number, and an advisor will send you fees, eligibility and the next intake date.');
    const f = document.createElement('form');
    f.innerHTML = `<input name="name" placeholder="Your name" required autocomplete="name"><input name="phone" placeholder="Mobile / WhatsApp with country code" required inputmode="tel" autocomplete="tel"><label class="c"><input type="checkbox" name="consent" required checked> I agree to be contacted about programs.</label><button class="btn">Send</button>`;
    msgs.appendChild(f); bd.scrollTop = bd.scrollHeight;
    f.addEventListener('submit', async (e) => {
      e.preventDefault(); const b = f.querySelector('button')!; b.disabled = true;
      try { await sendLead({ ...Object.fromEntries(new FormData(f).entries()), intent: 'chat', interest, transcript: log.join('\n') }); f.remove(); say('bot', 'Thank you! An advisor will message you on WhatsApp shortly.'); }
      catch { b.disabled = false; b.textContent = 'Try again'; }
    });
  };
  say('bot', 'Hi! I can help you find the right online degree. What would you like to study?');
  chips(['MBA', 'MCA', 'BBA', 'BCA', 'BCom / MCom', 'Not sure yet'], (s) => {
    interest = s;
    say('bot', s === 'Not sure yet' ? 'No problem. Are you currently working?' : `Good choice. Are you currently working?`);
    chips(['Yes, working', 'Studying', 'Neither right now'], () => askContact());
  });
  ft.hidden = false;
  ft.innerHTML = '<input placeholder="Type a question…" aria-label="Message"><button class="btn" aria-label="Send">➤</button>';
  const inp = ft.querySelector('input')!, send = () => { const t = inp.value.trim(); if (!t) return; inp.value = ''; say('me', t); if (!interest) interest = t; if (!msgs.querySelector('form')) askContact(); else say('bot', 'Thanks, I’ve noted that for your advisor.'); };
  ft.querySelector('button')!.addEventListener('click', send);
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
}

// Lets any on-page link or button open the widget, e.g. <a data-widget="callback">.
document.addEventListener('click', (e) => {
  const t = (e.target as Element).closest?.('[data-widget]') as HTMLElement | null;
  if (t) { e.preventDefault(); open(t.dataset.widget || 'home'); }
});
(window as any).cuWidget = { open, close };
