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
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

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

/** page slug → [{ file, path, label }] */
const EXPORTS = {
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
};

async function main() {
  mkdirSync(OUT, { recursive: true });
  const images = JSON.parse(readFileSync(resolve(ROOT, 'design/images.json'), 'utf8'));
  const index = {};

  for (const [slug, entries] of Object.entries(EXPORTS)) {
    const spec = JSON.parse(readFileSync(resolve(ROOT, `design/spec/${slug}.json`), 'utf8'));
    for (const entry of entries) {
      const node = at(spec.tree, entry.path);
      const svg = await subtreeToSvg(node, images, { label: entry.label });

      const width = Math.round(node.box.w * SCALE);
      const height = Math.round(node.box.h * SCALE);
      const raster = sharp(Buffer.from(svg), { density: 72 * SCALE }).resize(width, height, {
        fit: 'fill',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      });

      const webp = await raster.clone().webp({ quality: 90, effort: 5 }).toBuffer();
      writeFileSync(resolve(OUT, `${entry.file}.webp`), webp);
      // A PNG sibling keeps transparency for the handful of very old clients without WebP.
      const png = await raster.clone().png({ compressionLevel: 9 }).toBuffer();
      writeFileSync(resolve(OUT, `${entry.file}.png`), png);

      index[entry.file] = {
        src: `/figma/creatives/${entry.file}.webp`,
        fallback: `/figma/creatives/${entry.file}.png`,
        width,
        height,
        alt: entry.label,
      };
      console.log(
        `  ${entry.file.padEnd(24)} ${width}x${height}  webp ${(webp.length / 1024).toFixed(0)}kb  png ${(
          png.length / 1024
        ).toFixed(0)}kb`
      );
    }
  }

  writeFileSync(resolve(ROOT, 'design/creatives.json'), `${JSON.stringify(index, null, 1)}\n`);
  console.log(`\nExported ${Object.keys(index).length} creatives`);
}

main();
