/**
 * Exports the creatives of each page as WebP images.
 *
 * Only decorative artwork goes through here — product mockups, client logos, background shapes.
 * Everything that is real content (headings, copy, buttons, forms) is built as HTML instead, so
 * it stays selectable, translatable and accessible.
 *
 * Each creative is composed from the Figma spec into an SVG, then rasterised at 2x for crisp
 * rendering on retina displays. Run `node tools/figma/fonts.mjs` first so text rasterises with
 * the real typefaces.
 *
 * Usage: node tools/figma/illustrations.mjs
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import { customCreatives } from './custom-creatives.mjs';
import { subtreeToSvg } from './svg.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = resolve(ROOT, 'public/figma/creatives');
const SCALE = 2;

/**
 * Locate a node by a `/`-separated path. Segments are layer names, or `#n` for the nth child
 * when names repeat (the Figma file reuses "Hero v1/Desktop" for most sections).
 */
function at(tree, path) {
  let node = tree;
  for (const raw of path.split('/')) {
    const segment = raw.trim();
    if (!segment) continue;
    const children = node.children ?? [];
    const next = segment.startsWith('#') ? children[Number(segment.slice(1))] : children.find((c) => c.name === segment);
    if (!next) throw new Error(`path "${path}" broke at "${segment}"`);
    node = next;
  }
  return node;
}

const readSpec = (slug) => JSON.parse(readFileSync(resolve(ROOT, `design/spec/${slug}.json`), 'utf8'));

/** Deep-copy a subtree with every position moved by (dx, dy), so it can land somewhere else. */
function shifted(node, dx, dy) {
  const out = { ...node, box: { ...node.box, x: node.box.x + dx, y: node.box.y + dy } };
  // `matrix` carries the same translation as `box` for rotated and flipped layers.
  if (node.matrix) out.matrix = node.matrix.map((v, i) => (i === 4 ? v + dx : i === 5 ? v + dy : v));
  if (node.children) out.children = node.children.map((child) => shifted(child, dx, dy));
  return out;
}

/**
 * Swap one layer of a creative for the same layer re-cut from a later export, aligned on the
 * old layer's top-left corner. A revision file carries only the frames whose copy changed, so a
 * creative that straddles two exports — the ingestion pair is half original terminal, half
 * corrected form — is assembled here rather than redrawn whole in Figma.
 */
function applyGraft(root, { replace, from }) {
  const segments = replace.split('/');
  const leaf = segments.pop();
  const children = at(root, segments.join('/')).children ?? [];
  const index = leaf.startsWith('#') ? Number(leaf.slice(1)) : children.findIndex((c) => c.name === leaf);
  const target = children[index];
  if (!target) throw new Error(`graft target "${replace}" not found`);

  const patch = at(readSpec(from.slug).tree, from.path ?? '');
  children[index] = shifted(patch, target.box.x - patch.box.x, target.box.y - patch.box.y);
}

const round = (v) => +Number(v).toFixed(2);

/**
 * The packet mark that rides each ingest line on the Bullhorn card.
 *
 * The frame draws it as a flat 16px ellipse of #19b11f at 40% alpha: no edge, no direction, and
 * no relation to the line under it, so it reads as a smudge on the artwork rather than as a mark.
 * The two are also parked at unrelated points along their lines — 41% and 66% — which is what
 * makes the pair look accidental.
 *
 * Redrawn as a record actually in flight. The core is the green the rest of the site already uses
 * for a safe outcome (#12b76a, the "Nothing left behind" pill) rather than the grass green that
 * appears nowhere else, it sits in a white gap so it never touches the dashes underneath, and it
 * trails back the way it came so a still frame still carries the direction of travel. Both packets
 * take the same fraction of their line, so the pair reads as composed.
 */
function ingestPacket(id, [ax, ay], [bx, by], t = 0.42) {
  const GREEN = '#12b76a';
  // The arrowhead sits at (ax, ay), so travel runs b → a and the trail streams back toward b.
  const length = Math.hypot(bx - ax, by - ay);
  const [ux, uy] = [(bx - ax) / length, (by - ay) / length];
  const [x, y] = [ax + (bx - ax) * t, ay + (by - ay) * t];
  const [tx, ty] = [x + ux * 28, y + uy * 28];

  // The trail crosses the route's own grey dashes, so it is laid over a white wash that fades on
  // the same ramp: solid at the core, where the dashes would otherwise show through the green,
  // and gone by the tail, where the route resumes as if the packet had never passed.
  const ramp = (stops) =>
    `<linearGradient id="${id}-${stops.id}" x1="${round(x)}" y1="${round(y)}" x2="${round(tx)}" y2="${round(ty)}" ` +
    `gradientUnits="userSpaceOnUse">` +
    `<stop offset="0%" stop-color="${stops.color}" stop-opacity="${stops.from}"/>` +
    `<stop offset="100%" stop-color="${stops.color}" stop-opacity="0"/></linearGradient>`;

  const streak = (suffix, width) =>
    `<line x1="${round(x)}" y1="${round(y)}" x2="${round(tx)}" y2="${round(ty)}" ` +
    `stroke="url(#${id}-${suffix})" stroke-width="${width}" stroke-linecap="round"/>`;

  return (
    `<defs>${ramp({ id: 'wash', color: '#ffffff', from: 1 })}${ramp({ id: 'glow', color: GREEN, from: 0.7 })}</defs>` +
    streak('wash', 4.2) +
    streak('glow', 2.4) +
    `<circle cx="${round(x)}" cy="${round(y)}" r="8.4" fill="${GREEN}" fill-opacity="0.12"/>` +
    `<circle cx="${round(x)}" cy="${round(y)}" r="5.2" fill="#ffffff"/>` +
    `<circle cx="${round(x)}" cy="${round(y)}" r="3.4" fill="${GREEN}"/>`
  );
}

/** page slug → [{ file, path, label, scale?, graft?, hide?, overlay? }] */
const EXPORTS = {
  // The four approved lockups, taken from the Design system canvas rather than lifted off a page.
  // Each frame is 1495px wide — roughly eight times its largest use — so scale 1 is plenty.
  'ds-logo': [
    {
      file: 'logo-color',
      path: 'Logo-color,bg-white/Frame 4374',
      label: 'Talentilo.ai',
      scale: 1,
    },
    {
      file: 'logo-color-on-dark',
      path: 'Logo-color,bg-black/Frame 4374',
      label: 'Talentilo.ai',
      scale: 1,
    },
    { file: 'logo-mono-black', path: 'Logo-black,bg-white/Frame 4374', label: 'Talentilo.ai', scale: 1 },
    { file: 'logo-mono-white', path: 'Logo-white,bg-black/Frame 4374', label: 'Talentilo.ai', scale: 1 },
  ],

  homepage: [
    { file: 'hero-command-center', path: '#1/Visual-1', label: 'Talentilo command centre dashboard' },
    { file: 'logo-bell', path: '#2/#1/Bell Logo', label: 'Bell' },
    { file: 'logo-asana', path: '#2/#1/Asana Logo', label: 'Asana' },
    { file: 'logo-sap', path: '#2/#1/SAP Logo', label: 'SAP' },
    { file: 'logo-salesforce', path: '#2/#1/Salesforce Logo', label: 'Salesforce' },
    { file: 'logo-notion', path: '#2/#1/Notion Logo', label: 'Notion' },
    {
      file: 'semantic-matching',
      path: '#4/Semantic Matching Engine',
      label: 'Semantic matching engine ranking 500+ profiles down to 3 perfect matches',
    },
    // `offer-risk-alerts` now comes from the revision export — see `upd-offer-risk` below.
    { file: 'velocity-index', path: '#6/Visual-3', label: 'Agency Velocity Index dashboard' },
  ],

  /**
   * Nothing is exported from these two frames any more.
   *
   * Every "Content" slot on them holds the same pasted "Spend.In" invoice-app screenshot the
   * Figma file was assembled with, not Talentilo design — that includes the hero dashboard, the
   * tailored-views background and the Boolean comparison. `/platform/recruitment-os` and
   * `/platform/talent-intelligence` are now built from the supplied HTML content instead, using
   * the hand-authored creatives in custom-creatives.mjs and the panels in src/components/panels.
   * `ti-hero-shapes` was a blank decorative group and is likewise no longer used.
   */
  'product-command': [],
  // `ti-recall` moved to the `/platform/talent-intelligence` design, which redraws this section.
  'product-talent-intelligence': [],

  'for-agency-owner': [
    { file: 'ao-testimonial', path: '#1/Frame 2085665273', label: 'Customer testimonial' },
    // `#3/Content` and `#4/Content` hold the same placeholder — see custom-creatives.mjs for the
    // hand-authored `ao-superstar` / `ao-margins` artwork.
  ],

  'for-recruitment-operations': [
    { file: 'ro-testimonial', path: '#1/Frame 2085665273', label: 'Customer testimonial' },
    // `#3/Content` and `#4/Content` hold a pasted "Spend.In" invoice template, not real design —
    // see custom-creatives.mjs for the hand-authored `ro-governance` / `ro-single-truth` artwork.
  ],

  'solution-high-volume': [
    { file: 'hv-engaging', path: '#2/Visuals-1', label: 'AI voice agents engaging 500+ candidates' },
    // The frame's "AI Capacity" series is a set of zero-width vectors and its first bar uses the
    // wrong gradient — see custom-creatives.mjs for the hand-authored `hv-always-on` chart.
  ],

  'solution-tech-recruitment': [
    // `#2/Content` and `#3/Content` hold the "Spend.In" placeholder — see custom-creatives.mjs
    // for the hand-authored `tr-semantic` / `tr-verify` artwork.
  ],

  migration: [
    // The hero frame drew the legacy side as empty skeleton rows and asserted "100% INTACT" with
    // nothing behind it — see custom-creatives.mjs for the hand-authored `mg-transfer` ledger.
    // Only the artwork at the top of each comparison card — the copy and button under it are
    // real HTML, so exporting the whole card would ship the same words twice.
    {
      file: 'mg-card-bullhorn',
      path: '#2/Frame 2085665258/#0/Frame 1597881567',
      hide: ['Group 1597881566/Ellipse 115', 'Group 1597881566/Ellipse 116'],
      overlay:
        ingestPacket('mg-packet-a', [158, 125.28], [261.45, 126.02]) +
        ingestPacket('mg-packet-b', [157.83, 197.05], [261.62, 197.81]),
      label: 'On-premises and cloud ATS deployments being retired',
    },
    {
      file: 'mg-card-zoho',
      path: '#2/Frame 2085665258/#2/Frame 2085665757',
      // The "Enterprise Scale" icon carries a third vector — a 5x10 chevron parked to the right of
      // its two stacked rows, inside the icon frame but not part of the icon. On the page it reads
      // as a stray ‹ next to the label, so it is switched off here rather than in the design file.
      hide: ['Group 1597881565/Group 1597881564/Group 1597881562/#1/#1'],
      label: 'A small-business tool outgrown by enterprise-scale activity',
    },
    { file: 'mg-terminal', path: '#4/Frame 52/Frame 45', label: 'The Talentilo translation layer mapping a legacy export' },
  ],

  'not-found': [{ file: 'nf-shapes', path: '#1/Group 1597881551', label: '' }],

  // Recruitment OS is designed in its own file, so its frames come from
  // design/platform-recruitment-os.fig by way of STANDALONE_SOURCES.
  'platform-recruitment-os': [
    {
      file: 'ros-command-center',
      path: '#1/Frame 2085665231/Manager Review',
      label: 'The Talentilo command centre showing a job pipeline across every hiring stage',
    },
    // `ros-pending-review` now comes from the revision export — see `upd-pending-review` below.
    {
      file: 'ros-guardrails',
      path: '#3/Content',
      label: 'Operational guardrail alerts for SLA breaches, offers, AI matches and daily digests',
    },
    {
      // Only the candidate form on the right of this pair was revised, so the corrected frame is
      // dropped back onto the original terminal rather than the whole pair being re-exported.
      file: 'ros-ingestion',
      path: '#4/Frame 2085665792',
      graft: [{ replace: 'Add Candidate-3', from: { slug: 'upd-add-candidate' } }],
      label: 'The Talentilo translation layer importing a legacy export into a structured candidate record',
    },
  ],

  // One capture per role tab. Each is a whole 1312x614 frame, so the export takes the tree root.
  'platform-recruitment-os-owner': [
    { file: 'ros-view-owner', path: '', label: 'The owner view: annual revenue targets tracked per recruiter' },
  ],
  'platform-recruitment-os-ops': [
    { file: 'ros-view-ops', path: '', label: 'The operations view: floor alerts, held-up CVs and offer accept rate' },
  ],
  'platform-recruitment-os-recruiter': [
    { file: 'ros-view-recruiter', path: '', label: 'The recruiter view: a single candidate record with contact details and history' },
  ],

  'platform-talent-intelligence': [
    {
      // The frame is named "All Candidates/Database", and a slash is the path separator here.
      file: 'ti-hero-database',
      path: '#1/Frame 2085665231/#1',
      label: 'The Talentilo candidate database listing every profile with education, experience and skills',
    },
    { file: 'ti-recall', path: '#4/Frame 2085665278', label: 'External search cost compared with Active Recall' },
    // `#5/Frame 2085665277` (Universal Parser) and the two `Content` frames under `#2` (the
    // Boolean comparison) were left empty in the design, so `ti-parser`, `ti-boolean-legacy` and
    // `ti-boolean-semantic` are hand-authored in custom-creatives.mjs instead.
  ],

  // Single frames lifted out of the revision export, which carries only what it revises.
  'upd-offer-risk': [
    { file: 'offer-risk-alerts', path: '', label: 'Offer management system flagging at-risk deals' },
  ],
  'upd-pending-review': [
    {
      file: 'ros-pending-review',
      path: '',
      label: 'A pending-review queue listing each job with its client and how long it has waited',
    },
  ],

  // AI Powers and Revenue Defense had no Figma source for their hero art — the hero ran on a
  // live panel standing in for it. website-update-v2.fig supplies the real frame for both, drawn
  // the same way Recruitment OS's command centre is: the artwork bleeds off the band, and the CTA
  // floats over its foot — see HERO_REVEAL and `ctaPlacement="overlay"` in PageHero.
  'platform-ai-powers-hero': [
    {
      file: 'ap-hero-screening',
      path: 'Frame 2085665236/Frame 2085665231/Candidate Screening',
      label: 'A candidate call summary: overall score, evidence for the score, and the recording it came from',
      patch: [
        // The Recruiter QA check icon's own vector is #4f4f4f — a dark grey that reads as a smudge
        // on the green circle behind it. Every other icon on the page recolours to fit the chip it
        // sits in (the X's stroke is already the alert orange); this one just didn't. White is the
        // only value here that isn't read off the file, chosen to match the circle's fill the way
        // a check-on-a-colour-chip normally would.
        {
          path: 'Frame 2085665674/Frame 2085665830/Frame 2085665690/Frame 2085665689/Frame 2085665686/Frame 2085665687/Checkbox validation/Icon/Icon/Vector',
          fills: [{ kind: 'solid', color: 'rgba(255, 255, 255, 1)', hex: '#ffffff' }],
        },
        // The line measures 450px (Canvas 2d, Albert Sans SemiBold 14px) but the row only has
        // ~380px before it runs off the creative's own canvas — there's no clip-path catching it,
        // "questions." starts past the edge and the pixels just don't exist out there. Trimmed to
        // 363px, under the sibling line's own 385px, same three things checked, no attempt at
        // wrapping (the row is a single auto-width line, not a text box Figma would wrap).
        {
          path: 'Frame 2085665674/Frame 2085665830/Frame 2085665690/Frame 2085665689/Frame 2085665686/Frame 2085665687/Checkbox validation/#1',
          text: 'Introduced company, confirmed availability, relevant Qs.',
          lines: [{ text: 'Introduced company, confirmed availability, relevant Qs.', x: 0, y: 15.9, w: 363 }],
        },
        // Both recordings carry the same "0:00 / 1:23" from the source file, which reads as one
        // clip pasted twice rather than two real calls. Given different, plausible lengths.
        {
          path: 'Frame 2085665674/Frame 2085665688/#1/#2',
          text: '0:00 / 1:47',
          lines: [{ text: '0:00 / 1:47', x: 0, y: 12.79, w: 66.76 }],
        },
        {
          path: 'Frame 2085665674/Frame 2085665688/#2/#2',
          text: '0:00 / 2:12',
          lines: [{ text: '0:00 / 2:12', x: 0, y: 12.79, w: 66.76 }],
        },
      ],
    },
  ],
  'platform-revenue-defense-hero': [
    {
      file: 'rd-hero-offers',
      path: 'Frame 2085665236/Frame 2085665231/Offer Reminders',
      label: 'The offer-reminders workspace tracking every signed candidate through their notice period',
      patch: [
        // The signed-in user in the top-right chip was the file's own placeholder, "John Doe".
        // Its frame is an auto-layout row (avatar, name+role, chevron) that Figma would reflow on
        // its own; the export just draws the resolved absolute boxes, so a longer name needs its
        // neighbours re-laid-out by hand. "Rohan Sharma" measures 69.08px at this chip's own size
        // (10.44px, Albert Sans SemiBold — the ADVANCE table's calibration weight) against "John
        // Doe"'s 46px, a 23.08px gap the chip has nowhere to absorb on its own: expanding it
        // rightward alone runs the chevron 8.17px past the creative's own right edge, and pinning
        // the chevron and expanding leftward alone runs the avatar into the icon left of it. Split
        // 13px left, 10.08px right instead, which lands both sides with a buffer still in hand —
        // 7.89px between the avatar and that icon, 4.83px between the chevron and the canvas edge.
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373',
          box: { x: 1117.51, y: 518.93, w: 137.7, h: 29.84 },
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/29 9',
          box: { x: 1120.49, y: 518.93, w: 29.84, h: 29.84 },
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/_Avatar online indicator',
          box: { x: 1142.12, y: 540.57, w: 7.46, h: 7.46 },
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/Frame 2085665374',
          box: { x: 1159.28, y: 520.35, w: 69.08, h: 27.02 },
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/Frame 2085665374/John Doe',
          box: { x: 1159.28, y: 520.35, w: 69.08, h: 17 },
          text: 'Rohan Sharma',
          lines: [{ text: 'Rohan Sharma', x: 0, y: 12.16, w: 69.08 }],
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/Frame 2085665374/Manager',
          box: { x: 1159.28, y: 534.36, w: 33, h: 13 },
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/ChevronDown',
          box: { x: 1237.31, y: 526.39, w: 14.92, h: 14.92 },
        },
        {
          path: 'Body/Frame 2085665351/Frame 2085665376/Frame 2085665372/Frame 2085665373/ChevronDown/Icon',
          box: { x: 1241.41, y: 532.55, w: 7.09, h: 4.1 },
        },
      ],
    },
  ],
};

/** Rasterise one SVG string to webp+png at `width`x`height`, write both, return its manifest entry. */
async function rasterize({ file, label, svg, width, height, designWidth, designHeight, scale = SCALE }) {
  const raster = sharp(Buffer.from(svg), { density: 72 * scale }).resize(width, height, {
    fit: 'fill',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  const webp = await raster.clone().webp({ quality: 90, effort: 5 }).toBuffer();
  writeFileSync(resolve(OUT, `${file}.webp`), webp);
  // A PNG sibling keeps transparency for the handful of very old clients without WebP.
  const png = await raster.clone().png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(resolve(OUT, `${file}.png`), png);

  console.log(
    `  ${file.padEnd(24)} ${width}x${height}  webp ${(webp.length / 1024).toFixed(0)}kb  png ${(png.length / 1024).toFixed(0)}kb`
  );

  return {
    src: `/figma/creatives/${file}.webp`,
    fallback: `/figma/creatives/${file}.png`,
    // Pixel dimensions of the exported file, plus the size it occupies in the 1440 design.
    width,
    height,
    designWidth,
    designHeight,
    alt: label,
  };
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const images = JSON.parse(readFileSync(resolve(ROOT, 'design/images.json'), 'utf8'));
  const index = {};

  for (const [slug, entries] of Object.entries(EXPORTS)) {
    const spec = readSpec(slug);
    for (const entry of entries) {
      // A graft, a hide or a patch rewrites the tree, so it works on a copy the other entries
      // never see.
      const tree = entry.graft || entry.hide || entry.patch ? structuredClone(spec.tree) : spec.tree;
      const node = at(tree, entry.path);
      for (const patch of entry.graft ?? []) applyGraft(node, patch);
      // `hidden` is what the writer already checks for a layer switched off in Figma, so a layer
      // switched off here needs nothing new downstream.
      for (const path of entry.hide ?? []) at(node, path).hidden = true;
      // A field-level fix for one layer's own values — a fill the source file got wrong, copy a
      // spec text run carries verbatim. `{ path, ...fields }`; fields are shallow-merged onto the
      // node `at(path)` resolves to.
      for (const { path, ...fields } of entry.patch ?? []) Object.assign(at(node, path), fields);
      const svg = await subtreeToSvg(node, images, { label: entry.label, overlay: entry.overlay });
      const scale = entry.scale ?? SCALE;

      index[entry.file] = await rasterize({
        file: entry.file,
        label: entry.label,
        svg,
        scale,
        width: Math.round(node.box.w * scale),
        height: Math.round(node.box.h * scale),
        designWidth: +node.box.w.toFixed(2),
        designHeight: +node.box.h.toFixed(2),
      });
    }
  }

  // Hand-authored artwork for frames whose Figma content is a placeholder, not a real design.
  for (const entry of customCreatives()) {
    index[entry.file] = await rasterize({
      ...entry,
      width: Math.round(entry.designWidth * SCALE),
      height: Math.round(entry.designHeight * SCALE),
    });
  }

  // Drop anything left behind by an earlier run so the directory always matches the manifest.
  const wanted = new Set(Object.keys(index).flatMap((name) => [`${name}.webp`, `${name}.png`]));
  for (const file of readdirSync(OUT)) {
    if (wanted.has(file)) continue;
    rmSync(resolve(OUT, file));
    console.log(`  - removed stale ${file}`);
  }

  writeFileSync(resolve(ROOT, 'design/creatives.json'), `${JSON.stringify(index, null, 1)}\n`);
  mkdirSync(resolve(ROOT, 'src/data'), { recursive: true });
  writeFileSync(
    resolve(ROOT, 'src/data/creatives.ts'),
    '/** Generated by tools/figma/illustrations.mjs — do not edit by hand. */\n' +
      `export const creatives = ${JSON.stringify(index, null, 2)} as const;\n\n` +
      'export type CreativeName = keyof typeof creatives;\n'
  );
  console.log(`\nExported ${Object.keys(index).length} creatives`);
}

main();
