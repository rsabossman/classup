// Client for Ria, the AI admissions advisor (n8n webhook). Loaded only when a visitor opens the chat.
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
