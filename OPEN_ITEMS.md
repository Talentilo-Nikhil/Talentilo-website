# Open items

Everything still outstanding on the Talentilo.ai site, in plain language.
Last updated against commit `1d72dda`.

## Where to see the site

The live link is the Vercel deployment of the `claude/figma-production-website-thucpj` branch.
Every push updates it automatically within a couple of minutes — just refresh.

---

## 1. Answered — now settled

- **Pricing.** Talentilo sells one rate: **₹1,299 per seat per month, billed annually**. The
  Monthly / Annually toggle the Figma draws has been removed, along with the ₹1,624 monthly figure
  that had been derived from the file's "Save 20%" badge. The "What's Coming" list now matches the
  live site: AI Calling, Custom Reports, Growth Module (BD).
- **"Resources" menu item.** Stays out. The live site's nav is Platform / Solution / Migration /
  Pricing, which is what the site already ships.
- **Gilroy.** Replaced with **Albert Sans**, the Google font already used for body copy. Poppins
  is no longer loaded at all, which also removes a font download from every page. This turns out
  to match the file's own typography sheet, which sanctions exactly two typefaces — EB Garamond
  and Albert Sans — and never mentions Gilroy.
- **The four FAQ answers.** Confirmed correct as drafted.
- **The Design system canvas is now used.** The Figma file carries a `Design system` page next to
  the page designs, holding the logo lockups, the typography sheet and a six-ramp colour palette.
  The first build read only the page designs. All four frames are now extracted to
  `design/spec/ds-*.json`, the six ramps ship as tokens (50–950 each), and the header and footer
  use the approved logo lockups rather than a wordmark lifted off the homepage.

---

## 2. Done: the dropdown menus now follow the live site

Settled — the menus use the live labels, descriptions and grouping. Platform sits under a
**Core Platform** heading; Solution is two labelled columns, **For** and **Recruitment Type**.

The live Platform menu also lists **Faster Operations**, **AI Powers** and **Revenue Defense**.
The Figma designed no pages for those three, so they are left out rather than shipped as links
that go nowhere. Each becomes a one-line entry in `src/config/navigation.ts` the moment it has a
page to point at.

The mapping in use:

| Menu entry | Page |
|---|---|
| Recruitment OS | `/product/command` |
| Talent Intelligence | `/product/talent-intelligence` |
| Agency Owner | `/for/agency-owner` |
| Organization | `/for/recruitment-operations` |
| High Volume | `/solution/high-volume` |
| Tech Recruitment | `/solution/tech-recruitment` |

---

## 2b. For reference: what the live menus contain

Transcribed from the screenshots Talentilo supplied, since the sandbox cannot reach the live site.

**Platform** — five entries under a "CORE PLATFORM" heading:

| Live entry | Live description | Page in this build |
|---|---|---|
| Recruitment OS | Your entire operations in one view. | `/product/command` |
| Talent Intelligence | Semantic search and candidate ranking. | `/product/talent-intelligence` |
| Faster Operations | Real-time velocity for your workflow. | **none** |
| AI Powers | Scale your output, not your headcount. | **none** |
| Revenue Defense | Protect your placements post-offer. | **none** |

**Solution** — four entries in two labelled columns, "FOR" and "RECRUITMENT TYPE":

| Live entry | Live description | Page in this build |
|---|---|---|
| Agency Owner | Scale billing and automate ops. | `/for/agency-owner` |
| Organization | Enterprise governance & security. | `/for/recruitment-operations` |
| High Volume | Automate thousands of interactions. | `/solution/high-volume` |
| Tech Recruitment | Deep semantic matching for devs. | `/solution/tech-recruitment` |

*Lives in `src/config/navigation.ts`.*

---

## 3. Done: wide mockups can be enlarged on a phone

Settled — **tap to enlarge**. Artwork authored at least 1000px across lands near 335px on a phone,
a four-times reduction that puts its contents past reading. Below the desktop breakpoint each such
mockup now carries a control that opens it at its full design width in a dialog the reader can pan.
Escape closes it, focus is trapped while it is open and returns to the artwork afterwards, and the
page behind cannot scroll.

Above the desktop breakpoint nothing is added and no control enters the tab order, because the
artwork already reads at that size. Eight mockups qualify; the logo lockups are wider still but are
not mockups, so they are excluded explicitly.

---

## 4. Setup still to be done

### Email delivery for the contact form

The contact form at `/contact` works, validates on both the client and the server, and never
silently drops a message. But until an email provider key is configured it only writes submissions
to the server log instead of sending them.

To turn delivery on: create an account at resend.com, verify the `talentilo.ai` domain, then in
the Vercel dashboard go to **Settings → Environment Variables** and add:

```
RESEND_API_KEY = <the key from Resend>
```

Then redeploy. Both the Support and Sales cards on the page send to **marketing@talentilo.ai**.

*No key is stored in this repository. `.env.example` documents the variable and nothing else.*

### A pull request, if one is wanted

There is no pull request for this work, because the repository has only one branch —
`claude/figma-production-website-thucpj` — which became the default when the empty repository
received its first push. A pull request needs a second branch to merge into.

This has no effect on the website. It only matters if a reviewable code diff is wanted. To create
one:

```
git push origin 9b910dce6ca27e344633c7f147017ca1a78ae41f:refs/heads/main
```

That points a `main` branch at the initial scaffold commit, after which a pull request can be
opened against it.

---

## 5. Known deviations from the Figma file

Recorded in full in [`FIGMA_IMPLEMENTATION_REPORT.md`](./FIGMA_IMPLEMENTATION_REPORT.md). The
short version: no tablet or mobile frames existed in the file, so every layout below 1440px was
designed rather than copied; two empty placeholder panels were dropped; and template leftovers in
the copy (`support@artifact.com` and similar) were treated as placeholders, not content.

---

## 6. Fixed since first deployment

- **The mobile menu opened as an empty white bar.** It was rendered inside the frosted header, and
  a backdrop-filter makes that header the containing block for anything positioned `fixed` — so
  the menu could only ever be as tall as the header. Navigation on phones was impossible. The
  drawer is now portalled to `<body>`.
- **Pages opened part-way down instead of at the hero.** Smooth scrolling was enabled globally,
  which turned the router's scroll reset into an animation that ran while the page was still
  growing as artwork loaded.
- **The persona tab row broke onto two lines** inside its pill on every phone width. It now
  scrolls horizontally below 640px.
- **Two-column sections used the wrong column rhythm.** They rendered as 636 | 40 | 636, where the
  file divides the 1312 content column as 588 | 132 | 592 in thirteen of its fourteen splits. The
  gap was less than a third of the design's, and because adjacent sections alternate which side
  the artwork sits on, they did not line up with one another. Now 590 | 132 | 590 spanning
  64→1376, from a single `--spacing-split` token, identical in every split on every page. The
  file's one 86px outlier was normalised to match the other thirteen rather than reproduced.

All of these are covered by regression checks in `npm run qa:interactions`.
