/**
 * Installs the design's fonts locally so the creative rasteriser renders type correctly.
 *
 * The `.fig` references these by family + style name only; Google Fonts serves all of them
 * except Gilroy, which is commercial (see FIGMA_IMPLEMENTATION_REPORT.md for the substitution).
 *
 * Usage: node tools/figma/fonts.mjs
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

const FONT_DIR = resolve(homedir(), '.local/share/fonts/talentilo');

const FAMILIES = [
  { family: 'Albert Sans', weights: [400, 500, 600, 700], italics: [400, 500] },
  { family: 'EB Garamond', weights: [400, 500, 600] },
  { family: 'Poppins', weights: [400, 500, 600, 700] },
  { family: 'Plus Jakarta Sans', weights: [500, 600, 700, 800] },
  { family: 'JetBrains Mono', weights: [400, 700] },
  { family: 'Inter', weights: [400, 700] },
];

// A modern browser UA gets woff2; a bare one gets ttf, which fontconfig handles natively.
const UA = 'Mozilla/5.0 (X11; Linux x86_64)';

function fetchCss(url) {
  return execFileSync('curl', ['-sSL', '--max-time', '30', '-A', UA, url], { encoding: 'utf8' });
}

async function main() {
  mkdirSync(FONT_DIR, { recursive: true });
  let downloaded = 0;

  for (const { family, weights, italics = [] } of FAMILIES) {
    const specs = [
      ...weights.map((w) => ({ weight: w, italic: false })),
      ...italics.map((w) => ({ weight: w, italic: true })),
    ];
    const axis = italics.length
      ? `ital,wght@${specs.map((s) => `${s.italic ? 1 : 0},${s.weight}`).sort().join(';')}`
      : `wght@${weights.join(';')}`;
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${axis}`;

    const css = fetchCss(url);
    const urls = [...css.matchAll(/url\((https:\/\/[^)]+\.ttf)\)/g)].map((m) => m[1]);
    const seen = new Set();

    for (const [i, fontUrl] of urls.entries()) {
      if (seen.has(fontUrl)) continue;
      seen.add(fontUrl);
      const file = resolve(FONT_DIR, `${family.replace(/\s+/g, '')}-${i}.ttf`);
      if (existsSync(file)) continue;
      const bytes = execFileSync('curl', ['-sSL', '--max-time', '60', '-A', UA, fontUrl], {
        maxBuffer: 32 * 1024 * 1024,
        encoding: 'buffer',
      });
      writeFileSync(file, bytes);
      downloaded++;
    }
    console.log(`  ${family.padEnd(20)} ${seen.size} faces`);
  }

  execFileSync('fc-cache', ['-f', FONT_DIR]);
  console.log(`\nInstalled ${downloaded} font files into ${FONT_DIR}`);
}

main();
