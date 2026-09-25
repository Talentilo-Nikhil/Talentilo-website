# Open items

Everything still outstanding on the Talentilo.ai site, in plain language.
Last updated against commit `f304d8b`.

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
**Core Platform** heading, now with all five live entries; Solution is two labelled columns,
**For** and **Recruitment Type**.

All five Platform pages are built and now live under `/platform/`, matching the live site. The two
that had Figma frames moved there from `/product/` — `/product/command` and
`/product/talent-intelligence` still resolve, via permanent redirects in `next.config.ts`.

The Figma file only ever contained **one template for this menu**, drawn twice. All five pages now
follow it: hero (eyebrow, two-line headline, lede, one action, note line, visual), four body
sections (eyebrow, heading, copy, optional pull-quote, one panel), then a closing call to action.
Content for all five comes from the HTML exports Talentilo supplied, which supersede the thinner
copy the first two pages were built with.

Two deliberate departures from the Figma template, both taken from the live site: the Platform
hero is **dark** rather than a light gradient wash, and each section carries a small-caps
**eyebrow** the Figma frames did not have. The live pages' stock Tailwind palette (navy, emerald)
was *not* carried over — the dark bands use Talentilo's own ink and brand accents so the site
keeps one colour system.

The mapping in use:

| Menu entry | Page |
|---|---|
| Recruitment OS | `/platform/recruitment-os` |
| Talent Intelligence | `/platform/talent-intelligence` |
| Faster Operations | `/platform/faster-operations` |
| AI Powers | `/platform/ai-powers` |
| Revenue Defense | `/platform/revenue-defense` |
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
| Recruitment OS | Your entire operations in one view. | `/platform/recruitment-os` |
| Talent Intelligence | Semantic search and candidate ranking. | `/platform/talent-intelligence` |
| Faster Operations | Real-time velocity for your workflow. | `/platform/faster-operations` |
| AI Powers | Scale your output, not your headcount. | `/platform/ai-powers` |
| Revenue Defense | Protect your placements post-offer. | `/platform/revenue-defense` |

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

### Nothing else

Email delivery is the only piece of setup still outstanding. The branch and pull-request questions
this section used to raise are settled: `main` exists, every change goes through a pull request into
it, and a second pull request promotes `main` to the production branch. See
[**How a change reaches the live site**](./README.md#how-a-change-reaches-the-live-site) in the
README.

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

---

## 7. Open from the page-by-page review

The review that ran from the migration heading through to the screening funnel — every fix in it is
live. What it left open is below, in the order it is likely to matter.

### Two links still point at the contact form

Both need to point at a real destination and neither has been changed, because an automated guard on
this session blocks edits that re-point outbound links. They are one line each:

| What | Where | Points at now | Should point at |
|---|---|---|---|
| **Request Demo** (every call to action on the site) | `src/config/navigation.ts`, `DEMO_URL` | `/contact` | the Outlook booking page |
| **Sign In** (header) | `src/config/navigation.ts`, `headerActions.signIn` | `/contact` | `https://portal.talentilo.ai/login` |

The booking link is the one already published on the live privacy page:
`https://outlook.office.com/book/TalentiloIntelligence@NETORG19154905.onmicrosoft.com/?ismsaljsauthenabled`.
Either edit the two lines directly, or say the word in a session that is allowed to make them.

### The Recruiter tab describes the wrong screen

On `/platform/recruitment-os` the Recruiter tab reads *"Today's pipeline, today's follow-ups, and
nothing else in the way"* (`src/data/views.tsx`), but the artwork beside it is a single candidate
record. One of the two has to move. The CV-upload / auto-generated-tracker artwork mentioned during
the review would settle it — send it and the copy can be written to match.

### Two numbers on the screening funnel are now published claims

The funnel on `/platform/ai-powers` reads 500 dialled → 300 received → 60 shortlisted, which states
a **60% answer rate** and a **1-in-5 shortlist rate**. They are live. If either is not a number
Talentilo wants to stand behind in public, the panel takes any three figures —
`src/app/platform/ai-powers/page.tsx`.

### Smaller things noticed while reading the artwork

None of these is visible damage; they are places where the artwork and the world disagree.

- **The AI-calling video slot** on `/for/recruitment-operations` is still a placeholder sized for the
  clip that was promised (`aspect-[588/536]`).
- **Contact form delivery** goes to `marketing@talentilo.ai`; the site's own copy offers a `sales@`
  address for sales enquiries (`src/lib/mailer.ts`, `site.email.enquiries`).
- **Names and places inside the exported screens** are the Figma file's, and some contradict the copy
  around them: "Set metrics for Rajkumar. S" under a *Rohan Sharma / Manager* header on the Owner
  view, and "Sayali Mahale, Mumbai, India" on a record whose note says *located in New Delhi*.
- **Two ratios baked into the artwork** do not divide out: 45% against 951/1,070, and 29% against
  3,270/3,350.
- **A sentence is cut off** mid-clause in one screen: "The candidate's skills show a weak".
- **A phone number is baked into a hover state** in the v5 artwork (+91 9945623125).
- **The gauge arc** on the velocity dashboard is a flat `#60a5fa`, which is not one of the site's own
  six ramps.

Fixing any of these means re-exporting the creative it lives in, which is a pipeline change rather
than a copy change — cheap, but not instant.
