# Working on the ClassUp site

classuponline.com: a static Astro site on Cloudflare, the first tenant of SalesKarma (rsabossman/saleskarma). It sends every lead and chat to SalesKarma. RSA approves every change as a pull request.

## Rules for every PR

1. **Update CHANGELOG.md**: one entry under "Unreleased" saying what changed for visitors, tracking or SEO.
2. **Open PRs against `main`.** Cloudflare deploys on every push to `main`, so merging is the deploy. PR branches get a preview URL.
3. **Run `npm run build`** and say in the PR that it passed.

## Keep working (live, paid traffic)

- Every lead posts to SalesKarma `/v1/lead` with a `lead_id`, UTMs, all ad click ids and Meta's `fbp`/`fbc` cookies (`src/scripts/client.ts`, `src/scripts/widget.ts`).
- The browser Lead event (Meta pixel) and the Google Ads conversion use that same `lead_id` as their dedupe key (`src/components/AdTags.astro`). SalesKarma's server events rely on it.
- `/go/` ad landing pages stay noindex and out of the sitemap.

## Where things are

Catalog: `src/data/catalog.json`. Brand, endpoints and tracking ids: `src/data/site.ts`. Regions: `src/data/regions.ts`. More in README.md.
