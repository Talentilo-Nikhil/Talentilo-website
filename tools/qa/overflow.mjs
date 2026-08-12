/**
 * Names the elements that push the page wider than the viewport.
 *
 * Usage: node tools/qa/overflow.mjs [route] [width]
 */
import { chromium } from 'playwright';

import { CHROME } from './browser.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const [route = '/', width = '375'] = process.argv.slice(2);

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });

const offenders = await page.evaluate((limit) => {
  const found = [];
  for (const el of document.querySelectorAll('body *')) {
    const box = el.getBoundingClientRect();
    if (box.width === 0 && box.height === 0) continue;
    const right = box.right + window.scrollX;
    const left = box.left + window.scrollX;
    if (right <= limit + 1 && left >= -1) continue;
    found.push({
      tag: el.tagName.toLowerCase(),
      className: typeof el.className === 'string' ? el.className.slice(0, 110) : '',
      left: Math.round(left),
      right: Math.round(right),
      width: Math.round(box.width),
    });
  }
  return found;
}, Number(width));

// Only report the outermost offender of each subtree — children inherit their parent's overflow.
console.log(`${offenders.length} element(s) outside 0..${width}px on ${route}`);
for (const item of offenders.slice(0, 25)) {
  console.log(`  <${item.tag}> ${item.left}..${item.right} (${item.width}px)  ${item.className}`);
}

await browser.close();
