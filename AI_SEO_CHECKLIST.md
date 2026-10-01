# Basic AI SEO On-Page Optimization Guide

A practical, beginner-friendly checklist for optimizing pages for traditional Google search **and** AI-powered search (Google AI Overviews, ChatGPT, Perplexity, Gemini, and similar). This is a **basic/standard** guide — not an enterprise SEO program, not a link-building strategy, and it doesn't require paid tools.

This is the single reference for the Talentilo.ai SEO work. It contains three things:

1. **[Status: what has already been done](#status-what-has-already-been-done)** — everything shipped so far, with before/after numbers.
2. **[What's remaining](#whats-remaining)** — one defect to fix, post-deploy tasks, pages not yet covered, and what was deliberately left alone.
3. **The guide itself** — the reusable checklist, from [Must Do](#must-do) onward. Hand this part to a writer, an SEO person, or a developer and they can work through it page by page.

*Last updated: 9 September 2026.*

> **Terms used in this guide**
> - **SEO** — Search Engine Optimization: making pages easier for search engines to find, understand and rank.
> - **GEO / AEO** — Generative/Answer Engine Optimization: making content easier for AI systems to read, quote and cite in AI-generated answers. This field is newer and less proven than traditional SEO — treat GEO advice as *reasonable practice*, not guaranteed results.
> - **Schema / structured data** — a standardized code format (usually JSON-LD) that tells search engines exactly what a piece of content *is* (a product, an article, a business, etc.).

---

## Executive summary

This guide turns on-page SEO into a repeatable checklist you can run on any page, without specialist knowledge or paid tools. It covers the traditional fundamentals that still decide whether a page ranks (title tags, headings, indexability, page structure) and the newer practices that make content easier for AI systems to read, quote and represent accurately.

The core insight is that these two goals mostly overlap. Writing a clear direct answer up front, using descriptive headings, keeping paragraphs self-contained, and being factually specific helps a human skimming the page, helps Google understand it, and makes it easier for an AI system to extract and cite. Very little of this is exotic "AI SEO" — it is mostly good writing applied consistently.

Work is split into three tiers so it doesn't become overwhelming: **Must Do** (roughly 14 items, apply to every important page), **Recommended** (depends on the page type and business), and **Optional/Advanced** (safely ignore at this level). If you only ever do the Must Do tier, you will have covered the majority of the available benefit.

Two honest caveats. First, no tactic here — or anywhere — guarantees a Google ranking position or a citation in an AI answer; AI systems do not publish their selection criteria. Second, the AI-search (GEO) field is young, so this guide deliberately marks which advice comes from Google's own documentation, which is established SEO practice, and which is reasonable-but-unproven, rather than presenting it all with equal confidence.

---

## Status: what has already been done

Everything in this section is live on `main` (merged 9 Sep 2026, PR #131, merge commit `b79f2ed`).

### Site-wide infrastructure

| What | Where | Note |
| --- | --- | --- |
| `robots.txt` | `src/app/robots.ts` | **The site had none.** Allow-all plus a sitemap reference. |
| XML sitemap | `src/app/sitemap.ts` | **The site had none.** Generated from the existing `allRoutes` list in `src/config/navigation.ts`, so it can't drift as routes are added. 16 URLs. |
| Organization schema | `src/app/layout.tsx` | **The site had no structured data at all.** One sitewide node: name, URL, logo, description, social profiles, sales contact. |
| Stable entity id | `src/config/site.ts` (`ORGANIZATION_ID`) | Lets page schema reference the company by `@id` instead of redefining it, so no page carries two competing Organization nodes. |
| Schema helpers | `src/lib/json-ld.ts`, `src/components/ui/JsonLd.tsx` | `serviceSchema()` + a render component, shared by all 7 product pages. |

### Per-page on-page SEO

All seven solution and platform pages received: a rewritten title tag, a rewritten meta description, `Service` structured data, and 2–3 in-body internal links. Before this work, **every in-page CTA pointed at `/contact` and the pages never linked to each other.**

Title and description lengths, before → after (limits: title ~60 incl. the ` — Talentilo.ai` suffix, description ~155):

| Page | Title | Description |
| --- | --- | --- |
| `/solution/tech-recruitment` | 33 → 54 | 152 → 147 |
| `/solution/high-volume` | 33 → 42 | 130 → 151 |
| `/platform/recruitment-os` | **63** → 41 | **210** → 154 |
| `/platform/talent-intelligence` | **62** → 45 | **198** → 145 |
| `/platform/faster-operations` | **67** → 44 | **192** → 140 |
| `/platform/ai-powers` | **70** → 46 | **186** → 151 |
| `/platform/revenue-defense` | **62** → 57 | **195** → 147 |

Bold = was being truncated in search results. Every platform page was over on both counts.

Also changed: the `/solution/tech-recruitment` H1 was rewritten from a bare tagline to a descriptive headline, and verified in Chromium at 1440px and 390px.

Checked and found already correct — no change needed: image alt text (sourced from `src/data/creatives.ts`), heading hierarchy on all pages (single H1 → H2s, no skipped levels), canonical URLs, HTTPS.

---

## What's remaining

### 1. One defect to fix first

**The sitemap lists three `noindex` pages.** `/privacy`, `/terms` and `/trust` all set `robots: { index: false }`, but `src/app/sitemap.ts` builds from `allRoutes`, which includes them. Google Search Console will report these as *"Submitted URL marked 'noindex'"*. Fix by filtering those three routes out of the sitemap. **Priority: High** — small fix, but it produces recurring errors in Search Console until done.

### 2. Blocked until the deploy is confirmed live

- [ ] **Confirm production deployed.** The merge is on `main` and Vercel built the same code successfully as a preview, but production could not be verified from the build environment (network policy blocks `talentilo.ai`). Check the Vercel dashboard, or load `https://talentilo.ai/robots.txt` — it did not exist before this work, so any valid response confirms it.
- [ ] **Validate the structured data.** Run the homepage and `/solution/tech-recruitment` through Google's Rich Results Test (free). The shape is verified locally; only Google's parser confirms how it reads it.
- [ ] **Submit the sitemap** at `https://talentilo.ai/sitemap.xml` in Google Search Console.

### 3. Pages that have not had the SEO pass

The work so far covered only the seven solution and platform pages. These remain:

| Page | Issue found | Priority |
| --- | --- | --- |
| `/` (homepage) | Description is 160 chars — over the ~155 limit, will truncate | High |
| `/pricing` | Title is just `Pricing`; no schema. Commercially important page | High |
| `/migration` | Title is just `Migration`; a real search term ("ATS migration") is being left on the table | Medium |
| `/contact` | Title is just `Contact`; description at exactly 155 | Low |
| `/for/agency-owner` | Metadata is fine; no `Service` schema, no in-body internal links | Medium |
| `/for/recruitment-operations` | Metadata is fine; no `Service` schema, no in-body internal links | Medium |
| `/privacy`, `/terms`, `/trust` | Intentionally `noindex` — no SEO work needed, but see the sitemap defect above | — |

### 4. Deferred by choice

- **Hero H1 copy on four platform pages.** `/platform/faster-operations`, `/platform/ai-powers`, `/platform/revenue-defense` and `/platform/talent-intelligence` open with taglines rather than topic statements (e.g. *"Speed is the Only Competitive Advantage Left."*). The guide rates a descriptive H1 as High priority, but these are Figma-sourced with hand-placed line breaks, and the rewritten title tags now carry the keyword clarity. **This is a copy and design decision, not a technical one** — left as-is deliberately.
- **FAQ sections and author/expertise signals.** Genuinely useful, but there is no blog or guide content on the site yet for them to apply to.

---

## How this guide was built

The recommendations below focus on three things:
1. **What's consistently agreed on** across SEO practitioners and Google's own documentation (Google Search Central).
2. **What Google explicitly states** — given more weight for Google-specific items (title tags, structured data, Core Web Vitals, etc.), since Google publishes its own guidance directly.
3. **What's reasonable, non-speculative practice** for AI search — clarity, direct answers, factual accuracy, and clean structure genuinely help both human readers and AI systems parse content, even though no one (including AI companies) publishes a guaranteed formula for being cited in an AI answer.

Anything unproven, speculative, or "trick the algorithm" is labeled **Optional/Advanced** or explicitly flagged as **unproven** — never presented as a guaranteed tactic. This guide does not claim any tactic guarantees a Google ranking or an AI citation.

---

## Must Do

Implement these on almost every important page (homepage, product/service pages, key blog posts):

- [ ] Every page has one clear search intent and answers a specific question
- [ ] Unique, descriptive title tag under ~60 characters
- [ ] Unique meta description under ~155 characters that reads like a real answer, not keyword-stuffed
- [ ] Clean, readable URL
- [ ] Exactly one H1 that describes the page topic
- [ ] Opening paragraph directly answers the main question in the first 1–3 sentences
- [ ] Logical H2/H3 heading structure (no skipped levels, no heading soup)
- [ ] Meaningful, descriptive alt text on non-decorative images
- [ ] Page is indexable (not accidentally blocked by robots.txt or `noindex`)
- [ ] Canonical URL set correctly
- [ ] Mobile-friendly and reasonably fast (basic Core Web Vitals)
- [ ] No broken internal links
- [ ] HTTPS is used
- [ ] Content is factually accurate and not thin/duplicate

## Recommended

Useful, but depends on the page and business:

- [ ] FAQ section for pages with genuine, common follow-up questions
- [ ] 2–5 relevant internal links to related pages
- [ ] 1–3 outbound citations to credible sources, where claims benefit from backup
- [ ] Author name and short bio/expertise note on blog/guide content
- [ ] Trust signals (testimonials, case studies, client logos, certifications) on commercial pages
- [ ] Basic structured data (Organization, Article, Product, FAQPage, etc. — only where genuinely applicable)
- [ ] "Last updated" date on evergreen/how-to content, kept honest
- [ ] Tables or lists where they genuinely make information clearer

## Optional / Advanced

Don't worry about these for a basic implementation:

- [ ] Advanced entity/knowledge-graph optimization
- [ ] Extensive schema markup across many types (Speakable, HowTo, Event, etc.) "just in case"
- [ ] Enterprise content governance, editorial workflows, or content scoring tools
- [ ] Programmatic/AI-generated content at scale for SEO purposes (explicitly **not** recommended — see Content Freshness section)
- [ ] Complex technical SEO (log file analysis, JavaScript rendering audits, international hreflang strategy) — **may require developer/SEO help**
- [ ] Speculative "AI crawler optimization" tactics with no public evidence they affect citation rates
- [ ] Paid rank-tracking or AI-visibility tracking tools (free/manual spot-checks are enough at this stage)

---

# Detailed Section-by-Section Guide

## Search Intent and Page Purpose

**What to check**
- The page has one primary purpose (inform, compare, convert, etc.)
- That purpose matches what someone searching the target phrase actually wants
- The page isn't trying to rank for five unrelated ideas at once

**How to do it**
1. Write down the one question or need this page should satisfy.
2. Search the target phrase yourself (or imagine doing so) — what kind of page currently ranks: a product page, a blog explainer, a comparison?
3. Match your page's format to that intent.
4. If the page tries to serve multiple unrelated intents, split it into separate pages instead.

**Good example**
A page titled "Tech Recruitment Software" is structured as a solution/product page (what it does, who it's for, proof, CTA) — not a rambling blog post.

**Avoid**
- One page trying to rank for both a broad awareness term and a narrow transactional term
- Pages built primarily to "target a keyword" rather than serve a real reader need

**Priority: High**

---

## Title Tag

**What to check**
- Every page has a unique `<title>`
- It's under ~60 characters (so it doesn't get cut off in search results)
- It clearly describes the page and includes the main topic/keyword naturally

**How to do it**
1. Identify the page's main topic in plain language.
2. Write a title that a human would understand out of context.
3. Put the most important words near the front.
4. Keep it under ~60 characters where possible (Google can rewrite longer titles anyway).
5. Avoid duplicating the same title across multiple pages.

**Good example**
`Tech Recruitment Software for Engineers — Talentilo.ai`

**Avoid**
- Generic titles like "Home" or "Solutions"
- Keyword-stuffed titles ("Tech Recruitment | IT Recruiting | Engineer Hiring | Developer Staffing")
- Every page sharing the same title

**Priority: High**
*(Google's own guidance is explicit here: unique, descriptive titles are one of the most consistently recommended basics.)*

---

## Meta Description

**What to check**
- Every important page has a unique meta description
- It's roughly 120–155 characters
- It reads like a natural summary/answer, not a keyword list

**How to do it**
1. Write 1–2 sentences that describe what the page offers and why it matters.
2. Include the main topic naturally — don't force keywords.
3. Keep it concise; Google may rewrite it anyway, but a good one improves click-through.

**Good example**
"Talentilo is tech recruitment software that matches engineers by architectural fit, coding capability and experience density — not Boolean keyword strings."

**Avoid**
- Leaving it blank (Google will auto-generate one, often worse)
- Copy-pasting the same description across many pages
- Cramming in multiple unrelated keywords

**Priority: High**

**Note:** Google doesn't use the meta description as a ranking factor, but it directly affects click-through rate from search results, so it's still worth doing well.

---

## URL

**What to check**
- URL is short, readable, and describes the page
- Uses hyphens, not underscores or spaces
- Lowercase, no unnecessary parameters or IDs

**How to do it**
1. Use plain words that describe the page topic.
2. Keep the folder structure shallow and logical (e.g. `/solution/tech-recruitment`).
3. Avoid changing URLs once published; if you must, set up a redirect.

**Good example**
`talentilo.ai/solution/tech-recruitment`

**Avoid**
- `talentilo.ai/page?id=4821&cat=3`
- Very long URLs stuffed with keywords

**Priority: Medium** — good to get right from the start, but changing a working URL just for "SEO" carries real risk (broken links, lost rankings) and **may require developer help** to redirect properly.

---

## H1

**What to check**
- Exactly one H1 per page
- It clearly states the page topic (not just a clever tagline)
- It's different from the title tag, but topically aligned

**How to do it**
1. Write the H1 so someone landing on the page instantly understands what it's about.
2. It's fine to be a little more brand-voiced than the title tag, but don't sacrifice clarity for cleverness.
3. Check there's only one `<h1>` in the page's HTML.

**Good example**
"Tech Recruitment Software That Speaks the Language of Engineering" — keeps the brand phrase but leads with what the page is about.

**Avoid**
- A pure tagline with no topic words ("Speak the Language of Engineering" alone)
- Multiple H1s on one page
- Using an image with no real text as the H1

**Priority: High**

---

## H2/H3 Headings

**What to check**
- Headings follow a logical order (H1 → H2 → H3, no skipped levels)
- Each H2 introduces one clear subtopic
- Headings describe content accurately (someone should be able to skim just the headings and understand the page)

**How to do it**
1. List the subtopics the page actually covers.
2. Turn each one into a clear, descriptive H2.
3. Use H3s only for subpoints under an H2.
4. Don't use headings purely for visual styling — use them for structure.

**Good example**
`H2: Stop Matching "Java" to "JavaScript"` — describes a specific idea, not a vague label like "Features."

**Avoid**
- Skipping straight from H1 to H3
- Vague headings like "More Info" or "Details"
- Using heading tags just to make text bigger

**Priority: High**

---

## Opening Paragraph / Direct Answer

**What to check**
- The first 1–3 sentences directly answer the page's main question or state its main point
- A reader (or an AI system scanning the page) doesn't have to read five paragraphs to find the point

**How to do it**
1. Identify the single most important sentence you'd want quoted if someone only read one line.
2. Put that near the very top, in plain language.
3. Follow with supporting detail and context.

**Good example**
"Talentilo is tech recruitment software that matches engineers by real skill, not keyword matching." (Then elaborate.)

**Avoid**
- Starting with a long story, disclaimer, or unrelated context before the actual point
- Burying the definition/answer three paragraphs down

**Priority: High**
*(This is one of the clearest, most defensible AI-search recommendations: a direct, self-contained answer near the top is easy for both readers and AI systems to extract and quote.)*

---

## Content Structure

**What to check**
- Content is broken into scannable sections
- Related ideas are grouped together
- Paragraphs are reasonably short

**How to do it**
1. Use headings to break up long stretches of text.
2. Keep paragraphs to 2–4 sentences where possible.
3. Use bullet lists for genuinely list-like information (features, steps, comparisons).
4. Make sure each section can mostly stand on its own if read out of context.

**Good example**
A features page with a short intro, then one H2 + short paragraph per feature, rather than one long unbroken block of text.

**Avoid**
- Giant walls of text with no headings or breaks
- Over-fragmenting simple ideas into excessive bullet points

**Priority: Medium**

---

## Keyword and Topic Usage

**What to check**
- The main topic/keyword appears naturally in the title, H1, opening paragraph, and a couple of times in the body
- Phrasing sounds natural when read aloud

**How to do it**
1. Identify the 1 primary topic phrase and 2–4 natural variations (synonyms, related phrasing).
2. Use them where they fit naturally — don't force them into every sentence.
3. Write for the reader first; keyword placement should feel invisible.

**Good example**
A page about "tech recruitment software" also naturally uses "IT staffing," "technical hiring," and "engineering recruitment" where they fit.

**Avoid**
- Repeating the exact same phrase unnaturally many times ("keyword stuffing")
- Awkward phrasing that clearly exists only for search engines

**Priority: Medium**

---

## Semantic/Contextual Coverage

**What to check**
- The page covers the subtopics a knowledgeable reader would expect
- Related concepts and terminology are used naturally, not just the exact target phrase

**How to do it**
1. List the main topic and 3–6 subtopics a reader would expect a thorough page to cover.
2. Check each subtopic has at least a sentence or section addressing it.
3. Use a clear heading for each major subtopic.
4. Don't pad the page with subtopics nobody searching this topic would care about.

**Good example**
A tech recruitment page covers: how matching works, verification/assessment, speed of hiring, and proof (stats) — the natural set of things a buyer would want to know.

**Avoid**
- Only ever using one exact phrase and never any related terms
- Adding unrelated subtopics just to "cover more keywords"

**Priority: Medium**

---

## Questions and FAQs

**What to check**
- FAQs (if used) answer real, common questions — not invented ones for SEO padding
- Each answer is self-contained and understandable without reading the rest of the page

**How to do it**
1. Collect the 3–6 questions real users/prospects actually ask (sales team, support tickets, comments).
2. Write a direct, 1–3 sentence answer to each, then add detail if needed.
3. Only add an FAQ section if it genuinely helps — not on every page by default.

**Good example**
Q: "Does Talentilo replace my ATS?" A: "No — Talentilo integrates with your existing ATS and adds semantic matching on top of it." (Direct answer, then could elaborate.)

**Avoid**
- Filler questions nobody would actually ask, just to add an FAQPage schema
- Answers that only make sense if you've already read the whole page

**Priority: Medium** (High if the page genuinely has common recurring questions)

---

## Internal Linking

**What to check**
- The page links to a few genuinely related pages
- Link text (anchor text) describes the destination, not "click here"
- Important pages aren't orphaned (zero internal links pointing to them)

**How to do it**
1. Identify 2–5 closely related pages (a related solution, pricing, a relevant blog post).
2. Link to them from natural points in the copy.
3. Use descriptive anchor text.
4. Periodically check that every important page has at least one internal link pointing to it.

**Good example**
A tech recruitment page links to "See how pricing works" (→ `/pricing`) and "Read the Recruitment OS overview" (→ `/platform/recruitment-os`).

**Avoid**
- No internal links at all
- Generic anchor text ("click here," "read more") everywhere
- Linking to dozens of unrelated pages just to "spread link equity"

**Priority: Medium**

---

## External/Source Citations

**What to check**
- Specific factual or statistical claims are backed by a credible source where appropriate
- Links point to reputable, relevant sites

**How to do it**
1. Flag any specific stat, claim, or quote in the copy.
2. If it's not your own first-party data, link to where it came from.
3. If it IS your own data (e.g., "based on 10,000 placements"), say so explicitly — this is itself a trust signal.

**Good example**
"According to [source], the average technical hire takes X weeks" with a link, or "Based on Talentilo's own data across 10,000+ placements..." if it's proprietary.

**Avoid**
- Vague, unsourced stats ("Studies show...")
- Linking out excessively or to low-quality/unrelated sites

**Priority: Medium** — not every page needs citations, but pages making factual claims benefit from them, and this is a genuine, reasonable AI-search-readability practice (AI systems weigh sourced claims more usefully).

---

## Author and Expertise Signals

**What to check**
- Blog posts and guides show who wrote them
- There's a short indication of relevant expertise

**How to do it**
1. Add an author name and 1-sentence bio ("Written by [Name], [relevant role/experience]") to blog/guide content.
2. Link the author name to a bio page or LinkedIn if available.
3. Keep it honest — don't invent credentials.

**Good example**
"Written by [Name], Head of Recruitment Operations at Talentilo, 8 years placing technical talent."

**Avoid**
- Fake or exaggerated author credentials
- No author information at all on advice/guide content

**Priority: Medium** — High for blog/guide content where a named author adds real credibility; Low for straightforward product/service pages, where a company voice is expected instead.

---

## Trust and Credibility Signals

**What to check**
- Commercial pages show real evidence: testimonials, logos, case studies, certifications, results
- Claims are specific, not vague ("we're the best")

**How to do it**
1. Add 1–3 genuine proof points relevant to the page (a stat, a client quote, a logo).
2. Be specific ("reduces time-to-hire by X%" beats "we're faster").
3. Make sure any stat shown is real and can be substantiated if asked.

**Good example**
A stat grid showing real, specific numbers (placements made, time saved) rather than generic marketing claims.

**Avoid**
- Unverifiable superlatives ("#1 rated," "the best") with no evidence
- Fabricated or outdated statistics

**Priority: Medium** — High for commercial/conversion pages specifically.

---

## Images and Alt Text

**What to check**
- Every meaningful image has descriptive alt text
- Purely decorative images have empty alt text (`alt=""`), not missing alt attributes
- Images are reasonably compressed and sized for the web

**How to do it**
1. For each image, ask: "does this convey information?" If yes, write alt text describing it in context.
2. If it's purely decorative (background texture, spacer), set `alt=""`.
3. Use modern formats (WebP) and appropriate sizing — most frameworks (like Next.js's Image component) handle this automatically.
4. Don't stuff keywords into alt text — describe what's actually shown.

**Good example**
`alt="Three candidates ranked by the assessment they passed rather than the level they claimed"` — describes the actual content and its purpose.

**Avoid**
- `alt="image1.jpg"` or missing alt entirely
- Keyword-stuffed alt text unrelated to the image
- Giant unoptimized image files that slow the page down

**Priority: High**

---

## Structured Data / Schema.org

**What it is:** Structured data (usually written as JSON-LD, a small block of code in the page) tells search engines explicitly what something *is* — e.g., "this is a Product with this price" or "this is an Article by this author." Search engines already try to infer this from your content, but structured data removes the guesswork and can enable rich results (star ratings, FAQ dropdowns, etc.) in Google Search.

**Do you actually need it?** Only where it's genuinely true and adds value — not by default on every page. Adding schema that doesn't match the visible content on the page can violate Google's structured data guidelines and provides no real benefit.

**Which types are normally useful:**
- **Organization** — once, sitewide (in the layout/footer), describing your company (name, URL, logo, social profiles). Almost always safe and useful.
- **Article / BlogPosting** — for genuine blog/guide content with a clear author and publish date.
- **Product** — for actual purchasable products with price/availability. **Don't** use this for a SaaS feature/solution page with no listed price — it can trigger warnings for missing required fields (price, availability). A **Service** type fits a B2B solution/service page better.
- **FAQPage** — only for pages with genuine, visible Q&A content matching what's marked up (Google has tightened how FAQ rich results display, so treat this as "nice for accuracy," not a guaranteed rich-result driver).
- **LocalBusiness** — only if you have a physical location or service area customers visit/interact with.
- **BreadcrumbList** — useful if the site has a clear nested page hierarchy shown in the UI.

**When NOT to use a schema type:** if the page doesn't actually have the thing the schema describes (don't mark up a solution page as a "Product" with no price; don't use FAQPage on content that isn't real, visible FAQs).

**How to implement it at a basic level**
1. Identify what the page actually is (an article, a service, a business listing).
2. Write a minimal JSON-LD object with just the relevant, accurate fields — don't over-fill with speculative data.
3. Add it as a `<script type="application/ld+json">` block in the page.
4. Keep the data in sync with what's visibly on the page (Google explicitly requires structured data to match visible content).

**How to validate it**
- Use Google's free **Rich Results Test** (search.google.com/test/rich-results) — paste the URL or code and check for errors.
- Use **Schema.org's validator** (validator.schema.org) for general syntax checking.
- Re-check after any content change that affects the marked-up fields.

**Priority: Medium** — valuable when it accurately reflects real content, skippable otherwise. Never a substitute for the content itself.

---

## Content Freshness

**What to check**
- Time-sensitive or evergreen how-to content is kept accurate
- Any visible "updated" date is genuinely true

**How to do it**
1. Periodically review high-traffic pages for outdated facts, prices, or screenshots.
2. Update the content itself, not just the visible date — a fake "updated" stamp on unchanged content is misleading and can be seen as such by both users and search engines.
3. For genuinely time-sensitive content (pricing, statistics), review at least a couple of times a year.

**Good example**
A "2024 guide to X" gets its stats and screenshots actually refreshed before the date label changes.

**Avoid**
- Changing the "last updated" date without changing any actual content
- Letting stats/pricing pages go stale for years

**Priority: Medium**

---

## Duplicate/Thin/Low-Value Content

**What to check**
- No two pages target the same intent with near-identical content
- Pages have enough substance to be genuinely useful (not a few sentences padded with fluff)
- Content wasn't mass-produced purely to "have more pages"

**How to do it**
1. Search your own site for pages covering the same topic — merge or differentiate them.
2. Ask: "if I removed the filler, is there still a genuinely useful page here?"
3. Avoid generating large volumes of AI-written content purely for SEO volume — this risks both quality and, per Google's guidance, can be treated as low-value/spam content regardless of how it was produced.

**Good example**
One well-developed "Tech Recruitment" solution page instead of five thin variants targeting near-identical phrases.

**Avoid**
- Multiple pages competing for the same search intent
- Padding a page to hit a word count with no added value

**Priority: High**

---

## Crawlability and Indexability Basics

**What to check**
- Important pages aren't blocked by `robots.txt`
- Important pages don't have an accidental `noindex` tag
- An XML sitemap exists and lists key pages
- No important pages return broken (4xx/5xx) responses

**How to do it**
1. Check `robots.txt` doesn't disallow pages you want found.
2. Check page `<meta>` tags for accidental `noindex`.
3. Confirm an XML sitemap exists (e.g., `/sitemap.xml`) and is submitted in Google Search Console.
4. Spot-check that internal links resolve (no 404s).

**Good example**
`robots.txt` allows crawling of all public marketing pages; `/sitemap.xml` lists them; Search Console shows them as indexed.

**Avoid**
- Blocking whole sections by accident
- No sitemap at all
- Leaving `noindex` on from a staging/testing phase

**Priority: High** — foundational; if a page isn't indexable, none of the on-page work matters. **May require developer help** to implement `robots.txt`/sitemap generation correctly.

> **Audit finding for talentilo.ai (at time of writing):** the site had **no `robots.txt` and no XML sitemap** — neither `/robots.txt` nor `/sitemap.xml` existed. This is the highest-impact gap found during this audit, because it affects how efficiently every page on the site gets discovered. Both have now been added (`src/app/robots.ts` and `src/app/sitemap.ts`, generated from the existing `allRoutes` list so they stay in sync automatically). After deploying, submit the sitemap in Google Search Console.

---

## Technical Basics

The handful of technical things that directly affect whether a page can be displayed and trusted. This is deliberately not a full technical audit.

**What to check**
- Each page has a canonical URL pointing at itself (or at the preferred version, if duplicates exist)
- The page works properly on a phone
- The page loads in a reasonable time
- The site uses HTTPS everywhere

**How to do it**
1. **Canonical URL** — a canonical tag tells search engines "this is the official version of this page," which prevents duplicate versions (with/without trailing slash, tracking parameters) from competing with each other. Check it by loading the page, viewing source (Ctrl/Cmd+U), and searching for `rel="canonical"`. It should show the clean, preferred URL of that page.
2. **Mobile usability** — open the page on an actual phone, or use your browser's device mode (right-click → Inspect → toggle the device toolbar). Check that text is readable without zooming, buttons are tappable, and nothing overflows sideways.
3. **Page speed / Core Web Vitals** — run the page through Google's free **PageSpeed Insights** (pagespeed.web.dev). Aim for "Good" on the three Core Web Vitals (LCP = how fast the main content appears, CLS = how much the layout jumps around, INP = how quickly it responds to taps). Fix the specific issues it lists — usually oversized images. Don't chase a perfect score of 100; "Good" is enough.
4. **HTTPS** — check for the padlock in the address bar, and confirm that typing the `http://` version redirects to `https://`.

**Good example**
Page source contains `<link rel="canonical" href="https://talentilo.ai/solution/tech-recruitment"/>`, PageSpeed Insights reports all three Core Web Vitals as "Good" on mobile, and `http://` requests redirect to `https://`.

**Avoid**
- Every page pointing its canonical at the homepage (a common and damaging mistake)
- Ignoring mobile because the desktop version looks fine — most search traffic is mobile, and Google indexes the mobile version
- Chasing a perfect 100 speed score at the expense of everything else

**Priority: High** — **May require developer help** for canonical tags, redirects, and speed fixes.

---

## AI-Search / GEO Considerations

These are the practices with the most direct connection to how AI systems (AI Overviews, ChatGPT, Perplexity, Gemini, etc.) read and quote web content. None of them are guaranteed to produce a citation — AI companies don't publish exact criteria — but they're reasonable, low-risk practices that also happen to be good writing:

- **Direct answers first** — state the key fact/answer in the first sentence or two of a section, then elaborate. This is the single most consistently cited GEO practice.
- **Self-contained paragraphs** — write each paragraph so it makes sense if quoted alone, without needing the paragraph before it for context.
- **Clear, descriptive headings** — an AI system (and a skimming human) should understand a section from its heading alone.
- **Clear definitions** — if you introduce a term or concept, define it plainly in a sentence.
- **Factual accuracy** — inaccurate content can get you excluded from being cited, and damages trust generally. Never sacrifice accuracy for phrasing.
- **Context and specificity** — concrete numbers, named examples, and specific claims are easier to extract and more credible than vague statements.
- **First-hand experience where relevant** — if you genuinely did the thing (ran the test, used the tool, made the placements), say so specifically; this is a real trust signal, not just an SEO tactic.
- **Structured information where it genuinely helps** — a table for comparisons, a numbered list for steps, a short FAQ for real recurring questions. Don't force structure where prose reads better.
- **Keep facts extractable without stripping context** — a reader (human or AI) should be able to pull out one sentence, but that sentence shouldn't need three prior paragraphs to make sense.

**What's speculative/unproven and NOT recommended here:** publishing content specifically shaped to "trick" AI crawlers, chasing unverified "AI SEO" ranking-factor lists, or any tactic sold as a guaranteed way to appear in AI answers. Treat these claims skeptically — no one, including the AI vendors, publishes a reliable formula for this.

**Priority: High** for direct-answer structure and factual accuracy (these are just good writing); **Optional** for anything sold as an exotic "AI crawler" trick.

---

## Final Page-Level Quality Check

**What to check**
- Read the page as if you were a first-time visitor — is it genuinely useful?
- Would you be comfortable if this exact page were quoted directly in an AI answer?
- Does it deliver on what the title/description promise?

**How to do it**
1. Read the page top to bottom without editing.
2. Check it answers the core question clearly and honestly.
3. Check nothing is misleading, exaggerated, or outdated.
4. Confirm formatting (headings, links, images) all render correctly.

**Priority: High** — the final gate before publishing/updating any page.

---

# Repeatable Content Optimization Process

Use this on any existing page:

1. Identify the page's primary search intent (what is someone looking for when they land here?).
2. Identify the main question the page should directly answer.
3. Check the title tag — is it clear, unique, and under ~60 characters?
4. Check the H1 — does it clearly state the topic?
5. Rewrite the opening paragraph to give a direct answer in the first 1–3 sentences.
6. Review the H2/H3 structure — logical order, descriptive, no gaps.
7. Identify missing subtopics a knowledgeable reader would expect, and add short sections for them.
8. Improve factual clarity — replace vague claims with specific, accurate ones.
9. Add 2–5 relevant internal links with descriptive anchor text.
10. Add sources/citations where factual claims would benefit from backup.
11. Review images — meaningful alt text, decorative images marked `alt=""`.
12. Check structured data — is it accurate, or does the page need any at all?
13. Check indexability — not blocked, canonical set, in the sitemap.
14. Do the final AI-search readability/extractability check: can you pull one sentence out of each section and have it still make sense?

---

# 10-Minute Page Audit

- [ ] Title tag is unique, clear, under ~60 characters
- [ ] Meta description is unique and reads like a real answer
- [ ] URL is clean and readable
- [ ] Exactly one H1, and it's descriptive
- [ ] Opening paragraph directly answers the main question
- [ ] Headings are logical and descriptive at a glance
- [ ] No obviously broken links or images
- [ ] Page loads reasonably fast on mobile
- [ ] Page isn't accidentally `noindex`d or blocked
- [ ] Content is accurate and not thin/duplicate of another page

---

# Full Page Optimization Checklist

**Foundations**
- [ ] Search intent identified and matched to page format
- [ ] Title tag optimized
- [ ] Meta description optimized
- [ ] URL is clean (or intentionally left as-is if changing it isn't worth the redirect risk)
- [ ] Canonical URL set

**Content**
- [ ] H1 clearly states the topic
- [ ] Opening paragraph gives a direct answer
- [ ] H2/H3 structure is logical and descriptive
- [ ] All expected subtopics are covered
- [ ] Keyword/topic usage is natural, not stuffed
- [ ] Paragraphs are self-contained and scannable
- [ ] Tables/lists used where they genuinely help
- [ ] FAQ added if there are genuine recurring questions

**Trust & Sourcing**
- [ ] Author/expertise info added (if blog/guide content)
- [ ] Trust signals present (testimonials, stats, proof) where relevant
- [ ] External citations added where claims need backup
- [ ] Any stat or claim shown is accurate and current

**Linking**
- [ ] 2–5 relevant internal links added
- [ ] Anchor text is descriptive
- [ ] Page is linked to from at least one other relevant page (not orphaned)

**Media**
- [ ] All meaningful images have descriptive alt text
- [ ] Decorative images have `alt=""`
- [ ] Images are compressed/appropriately sized

**Structured Data**
- [ ] Schema type (if any) accurately matches the page content
- [ ] Validated with Google's Rich Results Test or Schema.org validator

**Technical**
- [ ] Page is indexable (no accidental noindex/robots block)
- [ ] Included in XML sitemap
- [ ] Mobile-friendly
- [ ] No broken links on the page
- [ ] HTTPS

**Final Check**
- [ ] Read end-to-end for accuracy and usefulness
- [ ] Content is genuinely extractable/quotable in self-contained chunks
- [ ] Not a near-duplicate of another page on the site

---

# Before vs. After Example

Fictional example: a page for a project management tool's "task automation" feature.

### URL
- **Before:** `example.com/page?id=482`
- **After:** `example.com/features/task-automation`

### Title
- **Before:** `Features - ExampleApp`
- **After:** `Task Automation Software for Teams | ExampleApp`

### Meta Description
- **Before:** *(none — Google auto-generates one)*
- **After:** `ExampleApp automates repetitive project tasks — assigning, updating and reminding your team — so nothing falls through the cracks.`

### H1
- **Before:** `Powerful Features`
- **After:** `Task Automation Software That Runs Your Project's Busywork`

### Opening Paragraph
- **Before:** "At ExampleApp, we've always believed that great software starts with great design. Over the years, we've built a platform trusted by teams everywhere. Today, we want to tell you about one of our favorite features..."
- **After:** "ExampleApp's task automation assigns, updates, and reminds your team automatically, based on rules you set once. No more manually re-assigning tasks or chasing status updates."

### H2s
- **Before:** `Features`, `More Features`, `Even More`
- **After:** `How Rule-Based Assignment Works`, `Automatic Status Reminders`, `Setting Up Your First Automation`

### Body Content Structure
- **Before:** One long unbroken paragraph mixing feature descriptions, company history, and a sales pitch.
- **After:** Short sections under each H2, a 4-step numbered list for setup, one comparison table (manual vs. automated workflow).

### FAQ / Questions
- **Before:** None.
- **After:** Added 3 real questions from the sales team, e.g., "Does automation work with existing projects, or only new ones?" with direct 1–2 sentence answers.

### Internal Links
- **Before:** None.
- **After:** Links to `/pricing`, `/integrations`, and `/features/reporting` with descriptive anchor text ("see how automation fits into reporting").

### Images / Alt Text
- **Before:** `<img src="screenshot3.png">` (no alt text).
- **After:** `<img src="screenshot3.png" alt="A task automation rule that reassigns overdue tasks and notifies the new owner">`

### Author / Trust Information
- **Before:** None.
- **After:** A short "Written by [Name], Head of Product" line on the related blog post, plus one specific customer stat on the feature page ("Teams using automation cut manual task updates by 40% on average, based on our own usage data").

### Schema
- **Before:** None.
- **After:** Minimal `Service`/`SoftwareApplication`-appropriate structured data matching the visible content (name, description, provider), validated with Google's Rich Results Test. No fake pricing/review data added since none is shown on the page.

---

# Priority / Difficulty / Time Table

| Task | Priority | Difficulty | Approx. Time | Applies To |
|---|---|---|---|---|
| Fix/write unique title tags | Must | Easy | 5–10 min/page | All pages |
| Fix/write unique meta descriptions | Must | Easy | 5–10 min/page | All pages |
| Clean up URL structure | Recommended | Medium (needs redirects) | 15–30 min/page | All pages — **may require developer help** |
| Ensure one clear, descriptive H1 | Must | Easy | 5 min/page | All pages |
| Fix heading hierarchy (H2/H3) | Must | Medium | 15–30 min/page | All pages |
| Rewrite opening paragraph as direct answer | Must | Medium | 10–20 min/page | All pages |
| Cover missing subtopics | Recommended | Medium–Hard | 30–90 min/page | Blog, Service, Product |
| Add FAQ section | Recommended | Medium | 20–40 min/page | Blog, Service, Product |
| Add internal links | Recommended | Easy | 10 min/page | All pages |
| Add external citations | Recommended | Easy–Medium | 10–20 min/page | Blog, guides |
| Add author/expertise info | Recommended | Easy | 10 min/page | Blog, guides |
| Add trust signals (stats, testimonials) | Recommended | Medium | 30–60 min/page | Product, Service, Local business |
| Add/fix image alt text | Must | Easy | 10–20 min/page | All pages |
| Add basic structured data | Recommended | Medium | 20–40 min/page | Depends on page type — **may require developer help** |
| Validate structured data | Recommended | Easy | 5 min/page | Any page with schema |
| Check indexability/robots/sitemap | Must | Easy–Medium | 15–30 min (site-wide) | All pages — **may require developer help** |
| Fix broken links | Must | Easy–Medium | Varies | All pages |
| Basic mobile/speed check | Must | Easy | 10 min/page | All pages |
| Refresh outdated content | Recommended | Medium | 30–60 min/page | Evergreen/how-to content |
| Consolidate duplicate/thin pages | Must | Hard | Varies | All pages |

---

# Recommended Implementation Order

**Phase 1 — Basic on-page SEO**
Title tags, meta descriptions, URLs, H1s, heading hierarchy, alt text.

**Phase 2 — Content clarity and AI extractability**
Direct-answer openings, self-contained paragraphs, missing subtopics, FAQs where genuinely useful.

**Phase 3 — Trust and credibility**
Author/expertise info, trust signals, citations for factual claims.

**Phase 4 — Internal linking and structured data**
Add relevant internal links; add and validate structured data only where it accurately applies.

**Phase 5 — Technical checks**
Indexability, robots.txt, sitemap, canonical URLs, broken links, mobile/speed basics.

**Phase 6 — Monitoring**
Periodically re-run the 10-minute audit on key pages; refresh outdated content; check Google Search Console for indexing issues and broken links every few months. No paid tools required for this basic level — free tools (Google Search Console, Rich Results Test, Schema.org validator) are sufficient.

---

# Final One-Page Master Checklist

- [ ] Clear search intent and matching page format
- [ ] Unique title tag (<60 chars)
- [ ] Unique meta description (<155 chars)
- [ ] Clean, readable URL
- [ ] One clear H1
- [ ] Logical, descriptive H2/H3 structure
- [ ] Direct-answer opening paragraph
- [ ] Self-contained, scannable paragraphs
- [ ] Relevant subtopics covered
- [ ] Natural keyword usage (no stuffing)
- [ ] FAQ added where genuinely useful
- [ ] 2–5 relevant internal links
- [ ] External citations where claims need backup
- [ ] Author/expertise info on guide content
- [ ] Trust signals on commercial pages
- [ ] Meaningful alt text on all real images
- [ ] Accurate structured data, validated (only where applicable)
- [ ] Content is current and honestly dated
- [ ] Not thin, not duplicate
- [ ] Indexable, canonical set, in sitemap
- [ ] No broken links, HTTPS, mobile-friendly, reasonably fast
- [ ] Final read-through for accuracy and quotability

---

## A note on limitations

No tactic in this guide guarantees a Google ranking position or an AI-generated citation. AI search systems don't publish their selection criteria, and Google's own algorithm changes over time. This guide reflects widely-agreed, low-risk, genuinely useful practices — treat any source (including this one) claiming a guaranteed formula for AI visibility with skepticism.
