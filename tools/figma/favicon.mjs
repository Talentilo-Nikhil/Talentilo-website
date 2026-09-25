/**
 * Builds the browser and home-screen icons from the logo mark.
 *
 * The site shipped Next's stock icon — a black circle with a white triangle — because nothing
 * ever replaced the scaffold's `favicon.ico`. The mark is the one part of the lockup that reads
 * at 16px, so all three files come from `mark-color`, the same artwork the header logo carries.
 *
 * These land in `src/app/` rather than `public/figma/creatives/`, so they survive
 * `npm run figma:creatives` — that step deletes everything in the creatives directory its
 * manifest does not list.
 *
 * Usage: node tools/figma/favicon.mjs   (after figma:creatives, which writes the mark)
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const MARK = resolve(ROOT, 'public/figma/creatives/mark-color.png');
const APP = resolve(ROOT, 'src/app');

/** The mark is 720x715, so it is padded to square before scaling or it lands stretched. */
async function square(size, { background = { r: 0, g: 0, b: 0, alpha: 0 }, padding = 0 } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const art = await sharp(MARK)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: art, gravity: 'centre' }])
    .png()
    .toBuffer();
}

/**
 * ICO container around PNG payloads.
 *
 * Every browser that matters has read PNG-compressed entries since IE11, and the alternative —
 * bottom-up BGRA bitmaps with a padded AND mask — is a lot of bit-twiddling for clients that no
 * longer exist.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(images.length * 16);
  let offset = header.length + directory.length;

  images.forEach(({ size, data }, i) => {
    const at = i * 16;
    directory[at] = size >= 256 ? 0 : size; // 0 means 256
    directory[at + 1] = size >= 256 ? 0 : size;
    directory[at + 2] = 0; // palette size
    directory[at + 3] = 0; // reserved
    directory.writeUInt16LE(1, at + 4); // colour planes
    directory.writeUInt16LE(32, at + 6); // bits per pixel
    directory.writeUInt32LE(data.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...images.map((image) => image.data)]);
}

const sizes = [16, 32, 48];
const entries = [];
for (const size of sizes) entries.push({ size, data: await square(size) });

writeFileSync(resolve(APP, 'favicon.ico'), ico(entries));
console.log(`  favicon.ico              ${sizes.join(', ')}px`);

// The transparent icon browsers prefer over the .ico when they read the <link> tags.
writeFileSync(resolve(APP, 'icon.png'), await square(512));
console.log('  icon.png                 512px');

/*
 * iOS composites a home-screen icon onto black rather than honouring its alpha, and it rounds the
 * corners itself, so this one is opaque white with the mark inset to clear the rounding.
 */
writeFileSync(resolve(APP, 'apple-icon.png'), await square(180, { background: '#ffffff', padding: 0.12 }));
console.log('  apple-icon.png           180px, white ground');

console.log(`\nWrote 3 icons from ${MARK.replace(`${ROOT}/`, '')}`);
