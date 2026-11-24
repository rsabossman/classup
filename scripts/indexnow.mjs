// IndexNow: tells Bing, Yandex, Seznam and Naver which pages changed, so they recrawl within hours.
// Production deploy runs:  node scripts/indexnow.mjs diff && npx wrangler deploy && node scripts/indexnow.mjs submit
//   diff   (after build) hashes every built page, compares with the live site's manifest, writes the changed URLs.
//   submit (after deploy) sends those URLs to IndexNow.
// It never fails the deploy: any error is logged and skipped.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const KEY = '0a147dbd0470fbab4b0e00d3b24f5dfb';
const SITE = (process.env.SITE_URL || 'https://classuponline.com').replace(/\/$/, '');
const DIST = 'dist';
const PENDING = '.indexnow-pending.json';
const MANIFEST = 'indexnow-manifest.json';

function builtUrls() {
  const xml = readdirSync(DIST).filter((f) => /^sitemap-\d+\.xml$/.test(f)).map((f) => readFileSync(join(DIST, f), 'utf8')).join('');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function fileFor(u) {
  const path = new URL(u).pathname;
  const f = join(DIST, path.endsWith('/') ? path + 'index.html' : path);
  return existsSync(f) ? f : null;
}

async function diff() {
  const hashes = {};
  for (const u of builtUrls()) {
    const f = fileFor(u);
    if (f) hashes[new URL(u).pathname] = createHash('sha1').update(readFileSync(f)).digest('hex').slice(0, 12);
  }
  writeFileSync(join(DIST, MANIFEST), JSON.stringify(hashes));
  let live = {};
  try {
    const r = await fetch(`${SITE}/${MANIFEST}`, { signal: AbortSignal.timeout(10000) });
    if (r.ok) live = await r.json();
  } catch (e) { console.log('indexnow: no live manifest, submitting every page', e.message); }
  const changed = Object.keys(hashes).filter((p) => hashes[p] !== live[p]).map((p) => SITE + p);
  writeFileSync(PENDING, JSON.stringify(changed));
  console.log(`indexnow: ${changed.length} of ${Object.keys(hashes).length} pages changed`);
}

async function submit() {
  if (!existsSync(PENDING)) return console.log('indexnow: nothing pending');
  const urlList = JSON.parse(readFileSync(PENDING, 'utf8'));
  if (!urlList.length) return console.log('indexnow: no changed pages');
  const host = new URL(SITE).host;
  for (let i = 0; i < urlList.length; i += 10000) {
    const send = () => fetch('https://api.indexnow.org/indexnow', {
      method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urlList.slice(i, i + 10000) }),
    });
    let r = await send();
    // 403 means IndexNow could not verify the key yet, usually because the key file was only just deployed. Retry once.
    if (r.status === 403) { await new Promise((ok) => setTimeout(ok, 30000)); r = await send(); }
    console.log(`indexnow: submitted ${Math.min(10000, urlList.length - i)} URLs, HTTP ${r.status}`);
  }
}

const mode = process.argv[2];
try { await (mode === 'submit' ? submit() : diff()); } catch (e) { console.log('indexnow: skipped,', e.message); }
