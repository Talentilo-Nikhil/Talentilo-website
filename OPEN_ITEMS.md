# Open items

Everything still outstanding on the Talentilo.ai site, in plain language.
Last updated against commit `88bf7e8`.

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
  is no longer loaded at all, which also removes a font download from every page.
- **The four FAQ answers.** Confirmed correct as drafted.

---

## 2. Open: the dropdown menus differ from the live site

The top-level navigation matches the live site exactly. The **contents** of the two dropdowns do
not, and five of the live entries have no page in this build.

**Platform** — live shows five entries under a "CORE PLATFORM" heading:

| Live entry | Live description | Page in this build |
|---|---|---|
| Recruitment OS | Your entire operations in one view. | `/product/command` |
| Talent Intelligence | Semantic search and candidate ranking. | `/product/talent-intelligence` |
| Faster Operations | Real-time velocity for your workflow. | **none** |
| AI Powers | Scale your output, not your headcount. | **none** |
| Revenue Defense | Protect your placements post-offer. | **none** |

**Solution** — live shows four entries in two labelled columns, "FOR" and "RECRUITMENT TYPE":

| Live entry | Live description | Page in this build |
|---|---|---|
| Agency Owner | Scale billing and automate ops. | `/for/agency-owner` |
| Organization | Enterprise governance & security. | `/for/recruitment-operations` |
| High Volume | Automate thousands of interactions. | `/solution/high-volume` |
| Tech Recruitment | Deep semantic matching for devs. | `/solution/tech-recruitment` |

The Figma file designed only the six pages listed above, so the menus were built from those. Three
choices are open:

1. **Keep the Figma structure** — what ships today. Every menu entry leads to a real page.
2. **Adopt the live labels and grouping for the six pages that exist**, and leave out Faster
   Operations, AI Powers and Revenue Defense until they have pages.
3. **Adopt the live structure in full**, which means designing and building three more pages.

*Lives in `src/config/navigation.ts`.*

---

## 3. A design decision on mobile

The wide product mockups (homepage hero, both product pages, migration) are 1312px artworks shown
at roughly 335px on a phone — a four-times reduction, at which the text inside them is not
readable.

Two options:

- **Scroll sideways.** The mockup stays legible and the reader drags it horizontally. This is the
  usual treatment for dashboards and wide tables on phones.
- **Leave as is.** The mockups read as a decorative impression of the product rather than
  something to be examined.

Nothing is broken either way — it is a judgement call about how the product should feel on a
phone.

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

All three are covered by regression checks in `npm run qa:interactions`.
