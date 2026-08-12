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
