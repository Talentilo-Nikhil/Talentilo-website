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
    // The two comparison frames are drawn there as well: they carried dashed connectors, cross
    // badges and an avatar feed that match nothing else on the site.
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
      // A graft or a hide rewrites the tree, so it works on a copy the other entries never see.
      const tree = entry.graft || entry.hide ? structuredClone(spec.tree) : spec.tree;
      const node = at(tree, entry.path);
      for (const patch of entry.graft ?? []) applyGraft(node, patch);
      // `hidden` is what the writer already checks for a layer switched off in Figma, so a layer
      // switched off here needs nothing new downstream.
      for (const path of entry.hide ?? []) at(node, path).hidden = true;
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
