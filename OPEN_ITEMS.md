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

### Sign In still points at the contact form

`headerActions.signIn` in `src/config/navigation.ts` sends "Sign In" to `/contact`, which is the one
link left that reaches the contact page from outside the footer. Everything else on the site books a
call now.

This entry previously recorded the destination it is waiting for: **`https://portal.talentilo.ai/login`**.
It was left as it is in this pass because that is what was asked for when the question came up, but
the URL is on file and the change is one line. The same entry named an Outlook booking page for the
demo links — that one is superseded: they go to `/demo` and the Calendly calendar now.

The QA suite's `nothing outside the footer and Sign In still routes to the contact form` check is
what holds the rest of the rule in place, and its `Sign In` exception is the line to delete when
this is fixed.

### The booking widget has never been seen rendering

`/demo` embeds Calendly's inline widget. Both `calendly.com` and `assets.calendly.com` are denied
by the build environment's egress policy (403 on CONNECT), so everything around the embed has been
tested — the route, the container width at nine viewport widths, the `data-url`, the script tag,
the fallback link and all sixty-three CTAs that lead there — but the calendar itself has never
painted here. That gap has already cost one release: the container shipped capped at 920px, which
sits inside Calendly's middle layout band, so the widget rendered stacked on every desktop and
nothing in the repository or the suite could see it.

What still needs a human on the live site: that the widget loads at all, and that it renders
side-by-side rather than stacked.

**The layout bands, since they are not obvious and they decide what the page looks like.** Calendly
reads the width of the element the widget is mounted in — 1100px and up gives the side-by-side
view, 650 to 1099 a narrower one, under 650 it stacks. The page's gutters are 64px a side at `lg`,
so the side-by-side view starts at about a **1230px viewport**; between roughly 1024 and 1230 there
is not 1100px of content width to hand it, whatever the component says. Closing that band would
mean breaking the site's 1312px measure on this one page, which is not worth it. `qa:interactions`
now asserts the mounted width is at least 1100 at 1440, which is the check that was missing.

**The mount point must never carry `calendly-inline-widget`.** That class is what `widget.js`
scans for when it loads, and the scan initialises everything it finds. With the class on an element
this component also passed to `initInlineWidget`, the calendar was built twice — two 700px iframes
in a 700px box, the second drawing over the fallback line and 582px into the footer. The element
carries `data-calendly="inline"` instead, and `qa:interactions` asserts both that the class is
absent and that the box clips what it holds.

**The URL carries no parameters**, deliberately — `hide_event_type_details=1` was removing the
panel with the host, the meeting name, its length and its description, which is half of what the
page is for. If Calendly's cookie banner turns out to be in the way for EU visitors,
`?hide_gdpr_banner=1` brings back only that behaviour and does not affect the layout. The suite
asserts the URL exactly, so any parameter added has to be added there too.

### The audit measures contrast with motion off

`qa:audit` now emulates `prefers-reduced-motion` before running axe. It had to: axe computes a
contrast ratio from composited colour, so an element part-way through a fade is measured at
whatever opacity that frame held, and the contact showcase — which steps every 3.5 seconds and
fades each part of a slide in — made the suite go red or green depending on when axe happened to
look. A red that appears and disappears on its own is worse than no check at all.

The cost is real and worth stating: the audit no longer sees contrast in mid-animation states. If
something is only unreadable while it is arriving, this will not catch it. The functional half of
each page's check still runs against the live, animating page — only the axe pass sees the settled
one.

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
  view, and "Sayali Mahale, Mumbai, India" on a record whose note says *located in New Delhi*. The
  second of those now survives only in `ros-view-ops`, the Ops Manager tab on
  `/platform/recruitment-os`. Talent Intelligence carried the same screen and no longer does — its
  scoring creative is `ScorecardPanel`, which is markup, so its city agrees with itself.
- **Two ratios baked into the artwork** do not divide out: 45% against 951/1,070, and 29% against
  3,270/3,350.
- **A sentence is cut off** mid-clause in one screen: "The candidate's skills show a weak". Same
  screen as above, so the same applies: it is `ros-view-ops` only now, and rebuilding that tab the
  way Talent Intelligence's was would retire it.
- **`ti-ranking` is no longer referenced by anything.** Talent Intelligence draws `ScorecardPanel`
  in its place. The export and its entries in `src/data/creatives.ts` and `design/creatives.json`
  are left alone deliberately — those files are generated, so pruning them is a pipeline change
  rather than a copy one.
- **`ti-hero-database` is no longer referenced by anything either.** The Talent Intelligence hero
  now shows `command-center-screen`, the command centre cut out of its ground. Same reasoning as
  above: the export stays.
- **The same dashboard is now drawn on two pages.** `/` shows it whole, on the blue ground baked
  into the export; `/platform/talent-intelligence` shows it cut out of that ground, floating on the
  band. They are the same screen, so a visitor who reads both sees it twice, and the home page is
  the one that should move — its hero is the site's first impression and the Talent Intelligence
  hero is the one that was chosen for this artwork. Nothing is broken until that happens; it is a
  question of what the home page shows instead.
- **The AI-calling transcript is written, not recorded.** The three turns on
  `/for/recruitment-operations` invent a role, a city, a salary and a booking — Senior Python in
  Pune, ₹32 LPA, Daniel on Tuesday at 11:00 — for the same reason the 312 and the 41 beside them
  are invented: the section claims the agent checks salary *in natural language*, and that cannot
  be shown without any. It is not a transcript of the MP3 underneath it and does not claim to be.
  Swap it for real words from a call you are happy to publish the moment there are some.
- **The AI-calling panel still outgrows its 588/536 wash in the two-column squeeze**, where the
  media column is narrow enough that the transcript wraps hard. The wash now holds 1.0970 exactly
  at **1440, 1280, 768 and 640**; it goes portrait at 1100 (441x495), 1024 (408x495), 500
  (460x441) and 390 (350x508). Those are all better than they were — 1024 was 408x556 — and the
  panel did this before the transcript went in too (408x441). What is left cannot be taken out
  with padding: at 1024 the card is 336px wide and three bubbles wrap to seven lines, which is
  about 90px more than the ratio allows. The only lever is type under 13px, which is not worth
  having. If the portrait wash in that band is unacceptable, the fix is a wider slot for this
  section, not a smaller creative.
- **Everything in the contact showcase is invented**, and there is a good deal more of it since
  the drawings were made to fill their card. Three replies in their own words, four scored CVs with
  the skills that earned each score, four call verdicts, and a board of seventeen named candidates
  with their years and stacks. None of it is data. It is drawn because the real thing is four
  screen recordings the site cannot reach (see the `clips` prop on `ProductShowcase`, which is
  sitting ready for them) — the moment those MP4s exist, each slide swaps its drawing for the
  recording and every invented name and figure on it goes with it. Until then, the one rule the
  drawings do keep is internal consistency: the board's column counts match the cards under them,
  and 312 sent minus the three replying is the 309 the thread says are still landing.
- **The drawings grow at `lg`, and only there.** The contact page goes to two columns at that
  breakpoint and the form beside the showcase starts setting the panel's height, which is the only
  place there is spare height to fill — so the board's second lines and the scoring slide's fourth
  CV appear there and nowhere else. It is the one thing in these drawings decided by the viewport
  rather than by a container query on the card's own width. If the contact page's grid ever moves
  off `lg`, those variants move with it.
- **The showcase steps every 3.5 seconds**, down from seven, because that is what was asked for.
  It is faster than the captions can comfortably be read, so the captions were cut to thirteen to
  sixteen words each to suit it. That is the trade: the pictures carry the argument and the line
  under them is a label. If it turns out to read as rushed, the dwell is one constant — `DWELL` at
  the top of `ProductShowcase.tsx`.
- **The reference for the showcase's motion was never seen.** The ask pointed at
  `talenthirecls18.ceipal.com`, which this environment's egress policy denies (403 on CONNECT), so
  the animation was built from the description rather than from the page. If the feel is off, a
  screenshot of that screen is what would close it.
- **A phone number is baked into a hover state** in the v5 artwork (+91 9945623125).
- **The gauge arc** on the velocity dashboard is a flat `#60a5fa`, which is not one of the site's own
  six ramps.

Fixing any of these means re-exporting the creative it lives in, which is a pipeline change rather
than a copy change — cheap, but not instant.
