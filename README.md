# ClassUp

A light, static site that compares online degree programs from Indian universities and captures leads for AI-assisted counselling. It's built with [Astro](https://astro.build).

## Where things live

| What | Where |
|---|---|
| Program and university data | `src/data/catalog.json`, the single source of truth. Edit it to add programs or fees. |
| Regional copy, FAQs, WhatsApp and phone numbers | `src/data/regions.ts` |
| Guides (articles) | `src/pages/articles/*.md` |
| Lead form, call-me and WhatsApp buttons | `src/components/LeadForm.astro`, `src/components/Dock.astro`, `src/scripts/client.ts` |
| AI and agent-facing files | `/llms.txt`, `/programs.json`, `/robots.txt`, `/sitemap-index.xml`, plus JSON-LD on every page |

## Regions

`/in/` India · `/me/` Middle East · `/africa/` Africa · `/intl/` Rest of world. The root page suggests a region from the visitor's time zone but never redirects, so crawlers see stable URLs.

## Settings (GitHub → Settings → Variables)

- `SITE_URL`: the production domain, for example `https://example.com`
- `BASE_PATH`: set to `/` once a custom domain is used (the default is `/classup` for the GitHub Pages preview)
- `PUBLIC_LEAD_ENDPOINT`: the webhook that receives leads (n8n → HubSpot)
- `PUBLIC_CHAT_AGENT_ID`: the AI chat agent id

## Develop

```
npm install
npm run dev
```
