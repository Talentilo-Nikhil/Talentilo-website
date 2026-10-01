# Handoff: Talentilo LinkedIn Promo Video (v10)

## Overview
A 53.4-second, 1920×1080 (16:9) product walkthrough video for Talentilo's LinkedIn company page. It shows the AI recruitment platform end-to-end: hook → logo → workspace → AI JD creation → candidate scoring → AI voice calling → pipeline + WhatsApp → candidate call kit → calling performance → targets → reports → offers → outro CTA. A synced music track runs underneath.

Goal for implementation: reproduce this animation as a renderable video (MP4, H.264, 1920×1080, 30 or 60 fps) — or as an embeddable web animation — with frame-accurate timing.

## About the Design Files
The files in this bundle are **design references created in HTML/React** — a working prototype that shows the intended look, motion and timing. They are not production code to ship directly. Recreate the video in the target environment using its established patterns. If no environment exists yet, **Remotion (React → MP4)** is the recommended choice: the prototype is already React components driven by a single time value, so each scene maps almost 1:1 onto a Remotion `<Sequence>` using `useCurrentFrame() / fps` as `T`.

To preview the reference: serve this folder over any static server (e.g. `npx serve .`) and open `Talentilo Promo Video v10.dc.html`. It plays in a loop with a timeline scrubber.

## Fidelity
**High-fidelity.** Final colors, typography, layout, copy, motion timing and audio. App screens are vector recreations of the real Talentilo product UI (see `reference/` for the real screenshots they were matched to). Candidate names, companies and figures are invented demo data — keep them unless the client supplies real ones.

## Canvas & global layout
- Canvas: 1920×1080, background `#0c0a10` (dark) with a subtle second tone `#15121c`.
- Product scenes show a floating **app window** (white, rounded, soft shadow) that swings in with a 3D perspective tilt (perspective 2400px) at the Workspace scene and stays on screen through Offers; screens swap inside it.
- App window chrome: top header bar (height `HD`) with logo `assets/logo-color.png` (22px tall), tabs "My Workspace" / "Reports & Analytics" (Outfit 19px/500; active tab ink + 3px `#9b8cff` underline); left sidebar of width `SB`. Exact constants `WX, WY, WW, WH, SB, HD` are at the top of `talentilo-v10-piece.jsx`.
- **Side copy**: to the left of the window, each scene has a small kicker label + a 3-line headline, the 3rd line in Instrument Serif italic. It cross-fades on each cut (next caption starts 0.05s before the cut so the left side is never empty).
- **Cursor**: an animated pointer moves between scripted targets and shows a press (scale-down + ripple) on each click. Click targets per scene are in the `CURSOR`/path arrays in the piece file.

## Timeline (seconds)
| # | Scene | Start | End | Dur |
|---|---|---|---|---|
| 1 | Hook | 0.0 | 3.0 | 3.0 |
| 2 | Logo | 3.0 | 5.6 | 2.6 |
| 3 | Workspace | 5.6 | 9.2 | 3.6 |
| 4 | JD creation | 9.2 | 15.6 | 6.4 |
| 5 | Scoring | 15.6 | 20.0 | 4.4 |
| 6 | AI Calling | 20.0 | 25.0 | 5.0 |
| 7 | Pipeline + WhatsApp | 25.0 | 29.4 | 4.4 |
| 8 | Candidate Call (interview kit) | 29.4 | 34.0 | 4.6 |
| 9 | Calling performance | 34.0 | 37.2 | 3.2 |
| 10 | Targets | 37.2 | 40.4 | 3.2 |
| 11 | Reports & Analytics | 40.4 | 43.6 | 3.2 |
| 12 | Offers | 43.6 | 48.6 | 5.0 |
| 13 | Outro | 48.6 | 53.4 | 4.8 |

Scene list lives in `window.OM_SCENES` in the HTML file; the piece file derives cut times from it.

## Screens / Scenes
Within each scene, animation uses local time `r` (seconds since scene start). Helpers: `E.in(a,b)` = easeOutCubic 0→1 over [a,b]; `E.io(a,b)` = easeInOutCubic; `E.pop(a,b)` = overshoot pop-in; `mix(a,b,k)` = lerp.

1. **Hook** — Dark full-bleed. Line: "Recruiters lose 40 hours a week to calls, chasing and spreadsheets" in large Outfit with word-by-word reveal.
2. **Logo** — `assets/logo-color-on-dark.png` scales 0.7→1 with a left-to-right clip-path wipe; tagline "The AI-native recruitment OS" (Outfit 36px, `#b9b4cc`) fades in at +1.1s.
3. **Workspace** — App window swings in; KPI stat cards count up. Side copy: "My Workspace" / "Every offer, / interview, win. / *One screen.*"
4. **JD creation** — Create New Job form: job details type in → Next → skill chips added → "Generate JD" → AI-written JD streams in → keywords generated (keywords stay inside the form box). Side copy: "AI JD creation" / "Fill the basics. / AI writes / *the JD.*"
5. **Scoring** — Job header "Junior Accountant" (Instrument Serif 48px) + "Job-001380 · Northwind Retail". Tabs Summary / **Candidates** / Notes / Attachments. Table with 5 rows (cols `56px 60px 300px 150px 170px 1fr`), score % counts up. Row 2 "Rahul Pillai" highlights, cursor clicks the info icon at r≈1.2 → **Scoring modal** (820px wide, radius 22, backdrop rgba(20,18,30,.38)): avatar RP, overall 93% (green `#2e8b3e`, 46px), 4 criteria cards with ring gauges (Location 100, Experience 90, Skills 92, Education 100), green "Skills Match" chips and red "Missing Skills" chips pop in.
6. **AI Calling** — AI voice agent works through a call queue; counter dials to 500; transcript lines appear; "meeting booked" pops at r≈4.2. Side copy: "AI calls / every candidate. / *You meet the fit.*"
7. **Pipeline + WhatsApp** — Kanban columns Manager Review / Client Review / Shortlisted (collapsed vertical) / Interview. Cursor clicks "Move Stage" (r≈0.45); Rahul Pillai's card lifts, rotates ~2°, arcs into Interview (r 0.55–1.2); column counts update; "Interview" tag pops. Cursor clicks the green WhatsApp button on the card (r≈1.55) → WhatsApp chat panel (480px, header `#075e54`, bg `#efeae2`, outgoing `#d9fdd3`) slides in from the right; template invite → slot buttons "11:00 AM / 3:00 PM" → candidate replies → confirmation.
8. **Candidate Call** — Full modal "Candidate Call / Capture candidate details during the call". Left panel: 3 Q&A cards ("Q1…" + green "Ideal Answer:"), scrolling up 190px. Right: 6 enquiry fields (pill inputs, 54px tall) that type in sequentially with focus ring `#9cc4ff`. Cursor clicks Submit (r≈3.65) → "✓ Saved to candidate profile" toast.
9. **Calling performance** — Recruiter call table (cols `60px 250px 110px 110px 130px 120px 1fr`) + call-detail highlight.
10. **Targets** — Recruiter target bars + semicircle gauge (gradient `#9b8cff→#5aa7ff`) counting to 46%, "Target achieved".
11. **Reports & Analytics** — Title + "Pre-built performance, billing and client data." "All Reports" tab, date-range pill, search. 4×2 grid of report cards (270px tall, radius 14) with teal doc icon `#1aa3b8`, title, description and black "Download" pill. Cursor clicks Download on "Recruiter Performance" at r≈1.45 → "Preparing…" → green "✓ Downloaded".
12. **Offers** — Offers table; "Accepted" pills flip to "Yes" one by one.
13. **Outro** — App window exits. Headline "Bring back the human / in recruitment." word-by-word (128px), then logo (44px tall) and a compact white "Book demo" pill button with subtle glow fade up at +1.7s.

## Design Tokens
Colors (from `B` in the piece file):
- dark `#0c0a10`, dark2 `#15121c`
- purple `#9b8cff`, blue `#5aa7ff` (brand gradient `linear-gradient(90deg,#9b8cff,#5aa7ff)`)
- orange `#ff9a4d`, green `#5fb35f`, red `#d0512f`
- app bg `#f6f6f9`, card `#ffffff`, line `#ececf1`, soft `#efeefe`
- ink `#1f1f24`, muted `#55555f`, faint `#a3a3ad`
- WhatsApp: head `#075e54`, bg `#efeae2`, out `#d9fdd3`, ticks `#53bdeb`, button `#25d366`

Typography (Google Fonts):
- Sans: **Outfit** 400/500/600/700 — all UI and body
- Serif: **Instrument Serif** (regular + italic) — page titles and the accent line of every headline

Radii: pills 999px; cards 14–16px; modals 22px; inputs 27px (pill).
Shadows: app window / modals `0 30px 80px rgba(0,0,0,0.25)`; lifted kanban card up to `0 20px 36px rgba(30,30,60,0.18)`.

## Audio
- `assets/talentilo-music-v14-calm.wav` — 53.4s, 44.1kHz stereo, original composition (118 BPM, C–G–Am–F). Hits are aligned to: logo 3.0s, workspace 5.6s, ~20s lift, 34.0s section lift, outro 48.6s. Starts at t=0 with the video; 2.2s fade-out at the end.
- The client may replace it with a licensed track; if so, keep the scene cut times above and re-check alignment.

## Assets
- `assets/logo-color.png` — logo for light backgrounds (app header)
- `assets/logo-color-on-dark.png` — logo for the dark logo/outro scenes
- `assets/talentilo-music-v14-calm.wav` — soundtrack
- `reference/product-screen-*.png` — real Talentilo product screenshots (Scoring, pipeline, candidate call, reports) the mockups were matched to
- Icons are inline SVG paths (Lucide-style, 1.8 stroke) defined in the `I` object in the piece file.

## Files
- `Talentilo Promo Video v10.dc.html` — entry page; holds the scene list (`OM_SCENES`) and loads the scripts below
- `talentilo-v10-piece.jsx` — **all scenes, data, timing and styles** (main source of truth)
- `animations-v3.jsx` — timeline engine used by the prototype (Stage, scrubber, `animate`, `Easing`) — reference only; replace with Remotion/your engine
- `tweaks-panel.jsx`, `support.js` — prototype runtime; not needed in the real build

## Implementation notes
- Drive everything from one clock: `T = frame / fps`; scene-local `r = T - sceneStart`.
- Render at 1920×1080; export H.264 MP4 with AAC audio for LinkedIn (≤ 10 min, ≤ 5 GB). Also export a captioned version — most LinkedIn viewers watch muted.
- Keep fonts loaded before render (Remotion: `@remotion/google-fonts` for Outfit + Instrument Serif).
