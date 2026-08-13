/**
 * Screenshots routes at the three reference widths.
 *
 * Usage: node tools/qa/shoot.mjs [route ...]        (defaults to every route)
 *        BASE=http://localhost:3000 node tools/qa/shoot.mjs /
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

import { CHROME } from './browser.mjs';
import { MISSING_ROUTE, ROUTES, VIEWPORTS } from './routes.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = resolve(ROOT, '.qa/shots');
const BASE = process.env.BASE ?? 'http://localhost:3000';

const routes = process.argv.slice(2).length ? process.argv.slice(2) : [...ROUTES, MISSING_ROUTE];

const slug = (route) => (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-'));

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME });
  const report = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });

    for (const route of routes) {
      const page = await context.newPage();
      const problems = [];
      page.on('console', (message) => {
        if (message.type() === 'error') problems.push(`console: ${message.text()}`);
      });
      page.on('requestfailed', (request) => problems.push(`request failed: ${request.url()}`));

      const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 60_000 });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(700);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );

      const file = resolve(OUT, `${slug(route)}-${viewport.name}.png`);
      await page.screenshot({ path: file, fullPage: true });

      report.push({
        route,
        viewport: viewport.name,
        status: response?.status(),
        overflow,
        problems,
        file,
      });
      console.log(
        `  ${route.padEnd(32)} ${viewport.name.padEnd(8)} ${response?.status()}  overflow:${overflow}px  ` +
          `${problems.length ? `${problems.length} problem(s)` : 'clean'}`
      );
      for (const problem of problems) console.log(`      ${problem}`);
      await page.close();
    }

    await context.close();
  }

  await browser.close();
  writeFileSync(resolve(ROOT, '.qa/shots.json'), `${JSON.stringify(report, null, 1)}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
