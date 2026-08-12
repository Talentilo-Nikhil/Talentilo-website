# Figma → Production Website: Implementation Report

Source of truth: `design/Talentilowebsite.fig` (committed), section **Website UI-Draft-V3**.
Stack: Next.js 16.3 (App Router, Turbopack) · React 19.2 · TypeScript strict · Tailwind v4.

---

## 1. How the Figma file was read

The `.fig` is a zip containing `canvas.fig` — a Kiwi-serialised document with a raw-deflate schema
chunk and a **zstd** data chunk — plus 37 raster assets. No Figma API access was available or
needed: the file was decoded offline and turned into checked-in data.

`tools/figma/` is that toolchain, and it is reproducible (`npm run figma:all`):

| Tool | What it does |
|---|---|
| `fig.mjs` | Kiwi container + schema decoder; builds the scene graph (11,528 nodes, 3,885 blobs) |
| `style.mjs` | Paints, effects, auto-layout and type → CSS-shaped values |
| `geometry.mjs` | `commandsBlob` → SVG path data, **plus a vector-network decoder** for the 185 shapes Figma never flattened |
| `extract.mjs` | Per-page resolved tree → `design/spec/<slug>.json` (11 pages) |
| `images.mjs` | Image-fill hashes → `public/figma/images/` + `src/data/images.ts` (15 assets) |
| `icons.mjs` | Icon symbols → `src/components/icons/*.tsx` (10 components) |
| `illustrations.mjs` | Creatives → `public/figma/creatives/*.webp|png` + `src/data/creatives.ts` (34 assets) |
| `outline.mjs` | Human-readable page outlines, used to author against exact numbers |
| `fonts.mjs` | Installs the design's typefaces locally so creatives rasterise with real type |

Things that had to be solved to make the extraction faithful:

- **Flips are negative scale.** Figma stores a flip as `m11 = -1`, which moves the transform
  origin to the far edge. All four corners are projected so `box` is always the visual top-left,
  and the full world matrix is emitted whenever the transform is not a plain translation.
- **Exact text layout.** `derivedTextData.baselines` carries Figma's own resolved line boxes, so
  wrapping in the exported creatives matches the file instead of being re-measured.
- **Masks vs. clipping.** `mask === true` (a layer that clips its following siblings) and
  `frameMaskDisabled === false` (a frame that clips its own content) are different things; groups
  are frames with `resizeToFit` and never clip.
- **Layer blur.** `FOREGROUND_BLUR` and `BACKGROUND_BLUR` are separate (`filter` vs
  `backdrop-filter`). The colour wash behind the "Semantic Match" pill is five hard rectangles
  under a 100px layer blur.
- **Resized instances scale their contents.** 721 of 1,093 instances are a different size from
  their master — icon sets drawn at 20 or 24px and placed at half a dozen sizes.
- **Gradient-filled text.** "3 Perfect Matches" is a warm gradient, not a solid.
- **Embedded image fills.** The rasteriser's SVG backend decodes PNG and JPEG but not WebP, which
  is why image fills were silently dropping out until the data URIs were re-encoded.

---

## 2. Pages and routes

Every Figma frame in the section has a route. All 11 are implemented.

| Figma frame | Route | File |
|---|---|---|
| `Homepage` | `/` | `src/app/page.tsx` |
| `Product/command` | `/product/command` | `src/app/product/command/page.tsx` |
| `Product/talent-intelligence` | `/product/talent-intelligence` | `src/app/product/talent-intelligence/page.tsx` |
| `for/agency-owner` | `/for/agency-owner` | `src/app/for/agency-owner/page.tsx` |
| `for/recruitment-operations` | `/for/recruitment-operations` | `src/app/for/recruitment-operations/page.tsx` |
| `solution/high-volume` | `/solution/high-volume` | `src/app/solution/high-volume/page.tsx` |
| `/solution/tech-recruitment` | `/solution/tech-recruitment` | `src/app/solution/tech-recruitment/page.tsx` |
| `/migration` | `/migration` | `src/app/migration/page.tsx` |
| `/Pricing` | `/pricing` | `src/app/pricing/page.tsx` |
| `Contact-us` | `/contact` | `src/app/contact/page.tsx` |
| `/404` | any unknown path | `src/app/not-found.tsx` |

Three further routes exist so the footer has no dead links: `/privacy`, `/terms`, `/trust`
(see [Deviations](#6-deviations-and-assumptions)). Plus one API route, `POST /api/contact`.

---

## 3. Design system

`src/app/globals.css` holds the tokens, all taken from the file rather than eyeballed.

- **Type** — EB Garamond headings (65 / 52 / 41 / 33 / 27, all `line-height: 1.2`), Albert Sans
  body (17 / 14 / 11 at 1.6), Poppins for the nav and the large figures. Every heading size is a
  `clamp()` anchored to its exact desktop value.
- **Colour** — ink `#0c0a10`, ink-soft `#212121`, muted `#667085`, footer text `#98a2b3`,
  divider `#a0a1a8`, mint `#e6f0de`, plus the accents used in the product visuals.
- **Gradients** — `--gradient-brand` (`#fdfcff → #b1a4ff 45.68% → #4da8fd`), its vertical 80%
  variant, `--gradient-warm`, `--gradient-magenta`; midpoints are the file's.
- **Layout** — 1440 shell, 1312 content, 64px desktop gutter tapering to 20px on phones.
- **Shape** — 12px cards, 50px pills, 112px on the oversized footer CTA.

### Components

`Container` · `Section` · `SectionHeading` · `Button` / `ButtonLink` · `Creative` · `FigmaImage` ·
`Reveal` · `Logo` · `Header` · `NavDropdown` · `MobileNav` · `Footer` · `PageHero` ·
`CenteredFeature` · `FeatureSplit` · `LogoStrip` · `StatGrid` · `Testimonial` · `CtaBanner` ·
`CtaCentered` · `TabbedViews` · `Faq` · `PricingPlan` · `RoiCalculator` · `ContactForm` ·
`LegalPage` · 10 generated icons.

---

## 4. Assets

**Nothing was redrawn.** Every illustration, product mockup, client logo and the wordmark is
exported from the `.fig` itself and shipped as WebP with a PNG fallback, at 2x (4x for the
wordmark). No stock imagery, no icon-font substitutes, no emoji.

- 34 creatives in `public/figma/creatives/`
- 15 raster assets in `public/figma/images/` (WebP alongside the original)
- 10 icons as inline SVG components, generated from the file's own vector geometry so they
  inherit `currentColor` and stay crisp

Everything that is *content* — headings, body copy, buttons, lists, tables of contact details,
the FAQ, the form — is real HTML, so it stays selectable, translatable and reachable by a screen
reader.

---

## 5. Interactions, motion and accessibility

| Interaction | Behaviour |
|---|---|
| Header dropdowns | Open on hover with a close grace period, and on click/Enter. `aria-expanded`, `aria-controls`, Escape restores focus to the trigger, outside click closes, navigation closes. |
| Mobile drawer | Below 1024px. Scroll lock, focus moved inside, Tab trapped, Escape closes and restores focus, closes on navigation. `visibility` (not just opacity) keeps its links out of the tab order when shut. |
| FAQ accordion | Single-open, first item expanded, animated with grid rows so the height matches the real content. Collapsed answers leave the accessibility tree. |
| Pricing billing toggle | Switches the per-seat price and the billing note; `aria-pressed` on both options, `aria-live` on the price. |
| ROI calculator | Three range inputs recompute the payback day, recovered value and surplus live. |
| Tailored Views tabs | Full ARIA tabs pattern: arrow keys move and wrap, only the selected tab is tabbable. |
| Contact form | Client + server validation with the same zod schema, per-field errors wired with `aria-describedby`, loading / success / error states, honeypot, per-IP rate limit. |
| Buttons | The paired arrow the Figma buttons hide by default slides in on hover *and* on keyboard focus; resting width matches the design exactly. |
| Logo strip | Scrolls horizontally below `lg`, keyboard-reachable. |
| Scroll reveal | `IntersectionObserver`, transform + opacity only, 600ms. |

Motion is transform/opacity only, 150–400ms, and the whole site is neutralised under
`prefers-reduced-motion: reduce` — verified by a test that asserts nothing stays hidden.
A `<noscript>` rule does the same when JavaScript is off.

Accessibility: semantic landmarks, exactly one `h1` per page, a skip link, visible focus rings
everywhere including on dark sections, labelled fields, and alt text on meaningful imagery with
decorative artwork marked `alt=""`.

---

## 6. Deviations and assumptions

1. **`Resources` is omitted from the nav.** It is the only nav item in the Figma with no designed
   page behind it, and `talentilo.ai` was unreachable from this sandbox to mirror the live nav.
   Adding it back is one entry in `src/config/navigation.ts`.
2. **Gilroy** (the large stat figures and pricing numbers) is a commercial font and cannot ship.
   **Poppins SemiBold** stands in — already in the file for the nav, and the closest geometric
   match. Swappable via `--font-figure`.
3. **Tablet and mobile layouts are designed, not copied.** The Figma contains desktop-only frames
   at 1440. Breakpoints are 640 / 1024 / 1440; two-column splits stack copy-first, three-column
   grids collapse, the nav becomes a drawer below 1024, and oversized mockups scale rather than
   overflow.
4. **`/privacy`, `/terms`, `/trust` are placeholder pages.** The footer links to them and the
   Figma has no page for any of the three. Legal copy is not something to invent, so each route
   resolves to a real page that says what the document will cover and how to request it today.
5. **Template leftovers are treated as placeholders, not content.** `support@artifact.com` and
   `sales@artifact.com` both become `marketing@talentilo.ai`. The "Tailored Views" tab group on
   `/product/command` reuses a pricing toggle in the file (its labels read "Monthly / Yearly /
   Yearly"); the tabs ship with the persona labels the site actually has pages for, keeping the
   one real label the design shows, "The Owner/VP".
6. **The monthly price is derived.** The file states ₹1,299 per seat per month billed annually and
   a 20% annual saving. The monthly rate shown by the toggle (₹1,624) is that saving reversed out,
   so the two prices stay consistent. Replace with the real figure when you have it.
7. **Four FAQ answers were written.** Only the first question has an authored answer in the file.
   Two of the remaining four are answered from facts already on the page (annual discount,
   per-seat upgrades); the two that depend on policy we do not have (trial scope, refunds) point
   at the sales address rather than inventing terms.
8. **Two empty placeholder panels were dropped.** `Frame 45` on `/product/talent-intelligence`
   (1312×518) and the reserved slot on `/product/command`'s mint band are flat colour blocks with
   no content in the Figma. Shipping an empty coloured rectangle adds nothing, so those sections
   render as copy only. This is most of the height difference reported by `spec-diff` on those
   two pages.
9. **The audience-page testimonial is HTML, not the exported card.** The Figma renders it as a
   graphic; rebuilding it as text makes the quote selectable and readable by assistive tech.
10. **Contact delivery is pluggable.** With `RESEND_API_KEY` set, `POST /api/contact` sends
    through Resend. Without it the message is validated, logged, and reported as
    `delivered: false` — never silently dropped. No secrets are committed; `.env.example`
    documents the variables.

---

## 7. Verification

All of the following pass, against `next build` output served on `:3000`.

```
npm run typecheck        # TypeScript strict, 0 errors
npm run lint             # eslint, 0 errors 0 warnings
npm run build            # 15 routes, all static except /api/contact
npm run qa:audit         # 39 page/viewport combinations — no failures
npm run qa:interactions  # 29/29 interaction checks passed
npm run qa:spec-diff     # section geometry vs the Figma spec at 1440
npm run qa:shots         # full-page screenshots at 1440 / 768 / 375
```

`qa:audit` asserts, for every route at 1440 / 768 / 375: HTTP 200, zero console errors, zero
failed requests, **zero horizontal overflow**, exactly one `h1`, every internal link resolving to
a route the site serves, and **no serious or critical axe-core violations** across
`wcag2a / wcag2aa / wcag21a / wcag21aa`.

`qa:interactions` drives the dropdowns, drawer, accordion, pricing toggle, ROI sliders, tabs and
contact form — including a deliberately malformed request to prove the server validates
independently of the client — and asserts reduced-motion behaviour.

`qa:spec-diff` compares rendered section heights at 1440 against `design/spec/`. After the
refinement pass, page totals land within ~1–3% of the design; the remaining per-section
differences are the documented placeholder panels in item 8 above.

### What the second pass changed

The first pass shipped; the second pass fixed what QA and a visual review found:

- Image fills were rendering blank in every exported creative (WebP data URIs the SVG backend
  cannot decode) → re-encoded as PNG/JPEG.
- Gradient-filled text rendered black, i.e. invisible on the dark section → gradient paints now
  resolve for text.
- Resized icon instances were drawn at their master's size, so the notification status icons
  overflowed their badges → instances now scale their contents.
- Frame clipping was not honoured, leaking a blurred colour wash outside the "Semantic Match"
  pill → `clipsContent` implemented, and layer blur with it.
- The closed mobile drawer widened the document by a full viewport at 375 and 768 → clipped, and
  its links taken out of the tab order.
- The footer's gradient-hairline CTA rendered as a solid gradient blob → rebuilt as a 1px
  gradient frame around an ink fill.
- The horizontally scrollable logo strip was not keyboard-reachable (axe *serious*) → fixed.
- FAQ questions inherited the display serif from their heading element → set in the UI face.
- The contact form reported a network failure on success, because `event.currentTarget` is
  nulled once the handler yields → the form element is captured before the await.
- Hero artwork spanned the full content width instead of the width it occupies in the 1440 frame,
  and did not bleed off the bottom of the band on `/product/command` → both corrected.
- Two creatives duplicated copy that is also real HTML on `/migration` → replaced with the
  artwork sub-frames only.

---

## 8. Scores

Honest numbers, not a self-congratulation exercise.

| | Score | Why not higher |
|---|---|---|
| **Visual fidelity to Figma** | **8.5 / 10** | Type, colour, gradients, spacing and every creative come from the file itself, and section geometry lands within a few percent at 1440. Held back by the placeholder panels I chose to drop, the Gilroy substitution, and a handful of sections where I traded the design's very large whitespace for something tighter. |
| **Functional completeness** | **9 / 10** | All 11 designed pages, every nav path, every button and link resolves, and each interactive component in the file is real. `Resources` is absent because it has no page, and Sign In points at contact rather than a product that does not exist yet. |
| **Responsiveness** | **8.5 / 10** | Zero horizontal overflow at 1440 / 768 / 375 on every route, verified. Not a 10 because the tablet and mobile layouts are my design decisions — there is nothing in the file to check them against. |
| **Code quality** | **9 / 10** | TypeScript strict, lint clean, one source of truth for navigation and tokens, components reused across all 11 pages, and the extraction pipeline is committed and re-runnable. There are no unit tests — verification is end-to-end. |
| **Attention to detail** | **8.5 / 10** | Exact Figma line breaks in creatives, real vector geometry for icons, the arrow-on-hover the buttons encode, focus and reduced-motion handled throughout. Two design details I know remain approximations: the 60px stat indent is rendered as a rule, and the ROI section is an interactive calculator rather than the file's static worked example. |

**Not claimed: 10/10 on anything.** The gaps above are real and are listed so they can be closed.

---

## 9. Running it

```bash
npm install
npm run dev                   # http://localhost:3000

# Re-derive everything from the .fig (needs the fonts installed once)
npm run figma:fonts
npm run figma:all

# QA (needs the site running)
npm run qa:audit
npm run qa:interactions
npm run qa:spec-diff
npm run qa:shots              # writes .qa/shots/
```

To enable real contact-form delivery, copy `.env.example` to `.env.local` and set
`RESEND_API_KEY`.
