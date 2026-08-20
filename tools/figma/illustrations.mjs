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

/** page slug → [{ file, path, label, scale? }] */
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
    { file: 'offer-risk-alerts', path: '#5/Visual-2', label: 'Offer management system flagging at-risk deals' },
    { file: 'velocity-index', path: '#6/Visual-3', label: 'Agency Velocity Index dashboard' },
  ],

  'product-command': [
    // `#1/#0/Dashboard` and the tailored-views background are also the "Spend.In" placeholder —
    // still on the Figma path pending the hero-scale replacements in custom-creatives.mjs.
    { file: 'pc-hero-dashboard', path: '#1/#0/Dashboard', label: 'The Command Center dashboard' },
    // `#2/Content` and `#3/Content` hold the same placeholder — see custom-creatives.mjs for the
    // hand-authored `pc-velocity` / `pc-guardrails` artwork.
    {
      file: 'pc-tailored-views',
      path: '#5/Frame 2085665277/Background image',
      label: 'The Command Center adapted to a leadership view',
    },
  ],

  'product-talent-intelligence': [
    { file: 'ti-hero-shapes', path: '#1/#0/Group 57', label: '' },
    // `#2/Frame 2085665278` holds the same placeholder — pending a hero-scale replacement.
    { file: 'ti-boolean', path: '#2/Frame 2085665278', label: 'Semantic reading of a candidate profile' },
    // `#3/Content` holds the same placeholder — see custom-creatives.mjs for `ti-ranking`.
    { file: 'ti-recall', path: '#4/Frame 2085665278', label: 'External search cost compared with Active Recall' },
  ],

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
    { file: 'hv-always-on', path: '#3/Visuals-2', label: 'AI capacity absorbing an overnight application spike' },
  ],

  'solution-tech-recruitment': [
    // `#2/Content` and `#3/Content` hold the "Spend.In" placeholder — see custom-creatives.mjs
    // for the hand-authored `tr-semantic` / `tr-verify` artwork.
  ],

  migration: [
    { file: 'mg-transfer', path: '#1/Frame 2085665236', label: 'Data moving from a legacy ATS into Talentilo' },
    // Only the artwork at the top of each comparison card — the copy and button under it are
    // real HTML, so exporting the whole card would ship the same words twice.
    {
      file: 'mg-card-bullhorn',
      path: '#2/Frame 2085665258/#0/Frame 1597881567',
      label: 'On-premises and cloud ATS deployments being retired',
    },
    {
      file: 'mg-card-zoho',
      path: '#2/Frame 2085665258/#2/Frame 2085665757',
      label: 'A small-business tool outgrown by enterprise-scale activity',
    },
    { file: 'mg-terminal', path: '#4/Frame 52/Frame 45', label: 'The Talentilo translation layer mapping a legacy export' },
  ],

  'not-found': [{ file: 'nf-shapes', path: '#1/Group 1597881551', label: '' }],
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
    const spec = JSON.parse(readFileSync(resolve(ROOT, `design/spec/${slug}.json`), 'utf8'));
    for (const entry of entries) {
      const node = at(spec.tree, entry.path);
      const svg = await subtreeToSvg(node, images, { label: entry.label });
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
