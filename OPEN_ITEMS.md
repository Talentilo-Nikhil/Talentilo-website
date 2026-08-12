# Open items

Everything still outstanding on the Talentilo.ai site, in plain language.
Last updated against commit `b934e6e`.

## Where to see the site

The live link is the Vercel deployment of the `claude/figma-production-website-thucpj` branch.
Every push updates it automatically within a couple of minutes — just refresh.

---

## 1. Decisions only Talentilo can make

These are places where the Figma file did not contain the answer, so the site currently carries
a stand-in. Each one is a single edit once the real answer is known.

### Monthly price

The design only states **₹1,299 per seat, billed annually**, alongside a "Save 20%" badge on the
annual option. The monthly rate is therefore shown as **₹1,624**, reverse-calculated from that
20%. If the real monthly price is different, it needs replacing.

*Lives in `src/app/pricing/page.tsx`.*

### The "Resources" menu item

The Figma header includes **Resources**, but no Resources page was designed. Rather than ship a
link that goes nowhere, it was left out. To add it back, it needs a destination — a blog, a help
centre, case studies, or an external URL.

*Lives in `src/config/navigation.ts`.*

### The Gilroy typeface

The large figures and pricing numbers are set in **Gilroy**, which is a commercial font that
cannot be distributed without a licence. **Poppins SemiBold** is used in its place — the closest
free geometric match, and already present in the Figma file for the navigation. If Talentilo owns
a Gilroy licence, swapping it is a one-line change.

*Lives in `src/app/globals.css`, the `--font-figure` variable.*

### Four FAQ answers

The Figma pricing page lists FAQ questions with no answers written. Four answers were drafted:
two from facts already stated elsewhere on the page, and two — **free trial scope** and
**refunds** — which point the reader at sales rather than invent commercial terms.

*Lives in `src/app/pricing/page.tsx`.*

---

## 2. A design decision on mobile

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

## 3. Setup still to be done

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

## 4. Known deviations from the Figma file

Recorded in full in [`FIGMA_IMPLEMENTATION_REPORT.md`](./FIGMA_IMPLEMENTATION_REPORT.md). The
short version: no tablet or mobile frames existed in the file, so every layout below 1440px was
designed rather than copied; two empty placeholder panels were dropped; and template leftovers in
the copy (`support@artifact.com` and similar) were treated as placeholders, not content.

---

## 5. Fixed since first deployment

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
