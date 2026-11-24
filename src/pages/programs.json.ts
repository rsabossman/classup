import type { APIRoute } from 'astro';
import { programs, universities, updated } from '../data/catalog';
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ updated, universities: Object.values(universities).map(({ source, ...u }) => u), programs: programs.map(({ source_url, ...p }) => p) }, null, 1), { headers: { 'content-type': 'application/json' } });
