# Talentilo.ai

The Talentilo.ai marketing site, built from `design/Talentilowebsite.fig`.

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4.

```bash
npm install
npm run dev        # http://localhost:3000
```

## What is where

```
design/                  the .fig and the data extracted from it
  Talentilowebsite.fig   source of truth, committed so extraction is reproducible
  spec/<page>.json       resolved per-page tree: geometry, layout, paints, type
  spec/ds-*.json         the Design system canvas: logo lockups, typography, palette
src/
  app/                   one directory per route, plus api/contact
  components/
    layout/              header, mobile drawer, footer, logo
    sections/            the page-level building blocks
    ui/                  primitives: Container, Section, Button, Creative, Reveal
    icons/               generated from the file's vector geometry — do not hand-edit
  config/                navigation.ts and site.ts: the only place URLs and copy-of-record live
  data/                  generated asset manifests — do not hand-edit
tools/
  figma/                 the offline .fig decoder and asset pipeline
  qa/                    Playwright audit, interaction suite, spec diff, screenshots
public/figma/            exported creatives and raster assets
```

## Regenerating assets from the `.fig`

```bash
npm run figma:fonts      # once: installs the design's typefaces for the rasteriser
npm run figma:all        # spec + images + icons + creatives
```

Everything under `design/spec/`, `src/data/`, `src/components/icons/` and `public/figma/` is
generated. Edit the pipeline, not the output.

## How a change reaches the live site

The repository carries three kinds of branch, and the live site is not the one git calls default
in the usual sense — it is the one Vercel builds:

| Branch | What it is |
|---|---|
| `claude/figma-production-website-thucpj` | **Production.** Vercel builds this branch, and it is also the repository's default branch. A push here is a deployment. |
| `main` | The integration branch. Work lands here first and is reviewed here. Merging to `main` does **not** deploy. |
| `claude/<name>-bNN` | One short-lived branch per change, opened off `main`. |

So a change ships in two merges:

```bash
git checkout -b claude/<name>-b44 origin/main    # one branch per change
# ... work, then open a pull request into main and merge it
# ... then open a second pull request, main -> claude/figma-production-website-thucpj, and merge that
git fetch origin main claude/figma-production-website-thucpj
git rev-list --count origin/claude/figma-production-website-thucpj..origin/main   # 0 when production is current
```

That last count is the check worth doing: if it is not `0`, something is sitting on `main` that the
live site does not have yet.

## QA

With the site running on `:3000`:

```bash
npm run qa:audit         # console errors, overflow, link resolution, axe-core
npm run qa:interactions  # dropdowns, drawer, accordion, toggles, sliders, form
npm run qa:spec-diff     # rendered section geometry vs the Figma spec at 1440
npm run qa:shots         # full-page screenshots at 1440 / 768 / 375 into .qa/
```

## Contact form

`POST /api/contact` validates with the same zod schema as the client and sends through Resend
when `RESEND_API_KEY` is set. Without a key it logs the message and returns
`{ ok: true, delivered: false }`, so nothing is dropped silently. Copy `.env.example` to
`.env.local` to configure.

## Implementation notes

See [`FIGMA_IMPLEMENTATION_REPORT.md`](./FIGMA_IMPLEMENTATION_REPORT.md) for how the Figma file
was decoded, what deviates from the design and why, and the verification results.
