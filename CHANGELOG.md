# Changelog

What changed on classuponline.com, newest first, so every thread and project working on this repo knows what is live.
Every PR adds an entry under **Unreleased** (see CLAUDE.md). A merge to `main` deploys to Cloudflare; its entry then moves under that date.

## Unreleased

- **New guide: online MBA for working professionals** (`/articles/online-mba-for-working-professionals/`), answer-first, with a comparison table, FAQs and FAQ schema. Articles can now carry `faqs` in frontmatter, which renders an FAQ section and FAQPage schema. Listed in llms.txt.
- **SalesKarma traffic pixel on every page.** A tiny inline script (`SkPixel.astro`, about 1 KB, no cookies, no extra script download) sends one beacon per page view to SalesKarma `/v1/visit` after the page has loaded, so visits by source, campaign, city and device show in the SalesKarma desk and link to the leads they become. It keeps a random visitor id and session id in localStorage (`sk_vid`, `sk_ses`, `sk_lid`). When a lead is sent (the existing `cu:lead` event), one more beacon links the visit to that lead id. The lead payload, the Meta Lead event and the Google Ads conversion and their `lead_id` dedupe are unchanged. `/go/` pages stay noindex and out of the sitemap. New setting `visitEndpoint` in `site.ts` (empty turns it off). Needs SalesKarma's traffic PR merged first.
- **Lead payload carries Meta's browser cookies.** The lead form and the advisor widget now send the Meta pixel's `_fbp` and `_fbc` cookies (as `fbp`, `fbc`) with each lead to SalesKarma, which passes them on with its Conversions API events so Meta can match qualified and enrolled leads to the ad. Nothing else in the payload, the browser Lead event or its event id changes. Pairs with SalesKarma's Meta match-quality change.
- Docs: CHANGELOG.md and CLAUDE.md added.

## 2026-11-25

- Online MBA fees comparison page for India (#27).
- Bing fixes: image alt text, titles under 60 characters (#26).
- Organization schema with the CU monogram logo (#25); fuller Course and EducationalOccupationalProgram schema on program pages (#24).

## 2026-11-24

- AEO: tells AI engines which "ClassUp" this is (#23); answer-first summaries, FAQs, Course and WebSite schema, AI crawler rules (#19).
- Regions: South Asia (SAARC) and South East Asia added (#22); homepage picks the region from the visitor's country, new header, mobile menu and social icons (#21).
- Homepage search bar with instant answers from the catalog and a hand-off to Ria (#20).
- Ria's number on the widget and landing pages; WhatsApp options hidden until it is live (#18).
- **Leads and chat go to SalesKarma** (`/v1/lead`, `/v1/chat`), with live advisor replies in the chat (#14). Advisor widget chats with Ria (#13).
- **Ad tracking:** ClassUp Meta pixel on the ad landing pages (#17), Google Ads lead conversion (#16), Google Tag Manager GTM-TWZWWGCC (#15). The browser Lead event and the Google conversion both use the lead id as the dedupe key.
- Paid-ad landing pages under `/go/` (noindex), the advisor widget, first-touch attribution (#12, #9); university names and per-university fees removed from landing pages.
- Images: campus photos on university pages (#11), stock heroes and illustrated cards (#7).
- Speed and SEO: lazy analytics (#8, #10), prefetch on hover (#6), inline CSS and cache headers (#5), regional titles, hreflang, IndexNow (#4).
- VTU India fees (#3); deployed as static assets on Cloudflare Workers (#2); first version of the site (#1).
