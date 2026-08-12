/**
 * Compares the rendered page against the Figma geometry at 1440.
 *
 * For each page it lines up the section stack in the browser with the section stack in
 * `design/spec/<slug>.json` and reports height differences beyond a tolerance, so a section that
 * has drifted a long way from the design shows up as a number rather than a hunch.
 *
 * Heights, not positions: the implementation is responsive, so a section that reflows its copy
 * onto a different number of lines legitimately shifts everything below it.
 *
 * Usage: node tools/qa/spec-diff.mjs [tolerancePx]
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

import { CHROME } from './browser.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const BASE = process.env.BASE ?? 'http://localhost:3000';
const TOLERANCE = Number(process.argv[2] ?? 120);

const manifest = JSON.parse(readFileSync(resolve(ROOT, 'design/spec/manifest.json'), 'utf8'));

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  let drifted = 0;

  for (const entry of manifest) {
    if (entry.route === '/404') continue;
    const spec = JSON.parse(readFileSync(resolve(ROOT, `design/spec/${entry.slug}.json`), 'utf8'));

    // Skip the shared header and footer; they are chrome, not page content.
    const designSections = (spec.tree.children ?? []).filter(
      (child) => child.name !== 'Header' && child.name !== 'Dark mode'
    );

    await page.goto(`${BASE}${entry.route}`, { waitUntil: 'networkidle' });
    const rendered = await page.evaluate(() =>
      [...document.querySelectorAll('main > *')].map((el) => Math.round(el.getBoundingClientRect().height))
    );

    const designTotal = designSections.reduce((sum, s) => sum + s.box.h, 0);
    const renderedTotal = rendered.reduce((sum, h) => sum + h, 0);
    const countMatch = rendered.length === designSections.length;

    console.log(
      `\n${entry.route}  ${designSections.length} design sections / ${rendered.length} rendered  ` +
        `total ${Math.round(designTotal)}px vs ${renderedTotal}px`
    );

    if (!countMatch) {
      console.log('  ! section count differs — comparing totals only');
      continue;
    }

    for (const [index, section] of designSections.entries()) {
      const delta = rendered[index] - Math.round(section.box.h);
      if (Math.abs(delta) <= TOLERANCE) continue;
      drifted++;
      console.log(
        `  section ${index} "${section.name}": design ${Math.round(section.box.h)}px, ` +
          `rendered ${rendered[index]}px (${delta > 0 ? '+' : ''}${delta})`
      );
    }
  }

  await browser.close();
  console.log(`\n${drifted} section(s) outside ±${TOLERANCE}px.`);
}

main();
