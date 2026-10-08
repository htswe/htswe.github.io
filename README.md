# Byte-sized learner

Personal blog of **Henry TSwe**, built with [Astro](https://astro.build) and the
[Ink theme](https://github.com/willimt/astro-theme-ink) (UnoCSS, warm "ink on
paper" typography, dark/light, TOC, search, tags, archives, RSS).

Previously a Jekyll site (minimal-mistakes). The Jekyll build has been retired;
the markdown content was kept in place so the Astro build migrates it.

## Repository layout

| Path | Purpose |
| --- | --- |
| `_posts/` | Post markdown, Jekyll-style `YYYY-MM-DD-slug.md` filenames. **Source of truth** for content. |
| `assets/` | Images referenced as `/assets/...`. |
| `astro/` | The Astro site (theme, config, pages, build tooling). |
| `_drafts/`, `_old_posts/` | Legacy Jekyll collections. Not published by the Astro build. |

## Develop

```bash
cd astro
npm install
npm run dev        # http://localhost:4321
```

`npm run dev` and `npm run build` run `predev`/`prebuild`, which execute
`astro/scripts/migrate-content.mjs`. That script reads `_posts/`, rewrites the
Jekyll/Liquid tags, and writes the Astro content collection to
`astro/src/content/blog/` (plus copies `assets/` into `astro/public/assets/`).
Both targets are git-ignored — they are always regenerated from `_posts/`.

## Build

```bash
cd astro
npm run build      # static site -> astro/dist
```

## Deploy

`.github/workflows/deploy.yml` builds the Astro site and publishes
`astro/dist` to GitHub Pages on every push to `master`.

One-time setup in the repo: **Settings → Pages → Build and deployment →
Source = GitHub Actions** (it used to build Jekyll from this branch).

## URLs

The theme serves posts at `/blog/<slug>/`. The original Jekyll permalinks are
preserved for inbound links:

- `/:category/:slug/` (e.g. `/tech/why-kotlin/`) — renders the post, canonical
  points to the `/blog/` URL.
- `/posts` → `/archives`, `/categories` → `/tags`, `/feed.xml` → `/rss.xml`,
  `/pageN/` → `/blog/N/` (config redirects).
