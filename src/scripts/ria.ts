// Client for Ria, the AI admissions advisor (SalesKarma API). Loaded only when a visitor opens the chat.
// Conversation history is stored server side by lead_id; the widget keeps the transcript for display only.
export type RiaReply = { reply: string; stage?: string; paused?: boolean };

export async function askRia(endpoint: string, lead_id: string, message: string, name = ''): Promise<RiaReply> {
  const r = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ lead_id, message, channel: 'web', name }),
  });
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

// Live replies from a human advisor who takes over the chat. The chat endpoint is
// https://api.../v1/chat?k=KEY, so the socket is wss://api.../v1/chat/ws?k=KEY&lead_id=...
// Calls onAdvisor for advisor messages only (Ria's replies already arrive through askRia).
export function listen(endpoint: string, lead_id: string, onAdvisor: (text: string) => void): () => void {
  if (!('WebSocket' in window) || !endpoint.includes('/v1/chat')) return () => {};
  const u = new URL(endpoint, location.href);
  u.pathname = u.pathname.replace(/\/v1\/chat\/?$/, '/v1/chat/ws');
  u.protocol = u.protocol === 'http:' ? 'ws:' : 'wss:';
  u.searchParams.set('lead_id', lead_id);
  let ws: WebSocket | null = null, stopped = false, tries = 0, ping: any;
  const connect = () => {
    if (stopped) return;
    ws = new WebSocket(u.toString());
    ws.onopen = () => { tries = 0; };
    ws.onmessage = (e) => {
      if (e.data === 'pong') return;
      try { const m = JSON.parse(e.data); if (m.type === 'message' && m.who === 'advisor' && m.text) onAdvisor(m.text); } catch {}
    };
    ws.onclose = () => { if (!stopped && tries < 6) setTimeout(connect, Math.min(30000, 1000 * 2 ** tries++)); };
  };
  connect();
  ping = setInterval(() => { if (ws?.readyState === 1) ws.send('ping'); }, 25000);
  return () => { stopped = true; clearInterval(ping); ws?.close(); };
}
