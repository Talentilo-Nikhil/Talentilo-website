/**
 * Functional and accessibility sweep over every route, at the three reference widths.
 *
 * Asserts: no console errors, no failed requests, no horizontal overflow, every internal link
 * resolves to a route the site actually serves, and no serious or critical axe-core violations.
 *
 * Usage: node tools/qa/audit.mjs            (needs `npm run dev` or `npm start` on :3000)
 */
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

import { CHROME } from './browser.mjs';
import { ROUTES, VIEWPORTS } from './routes.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const known = new Set(ROUTES);

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME });
  const failures = [];
  let checks = 0;

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of known) {
      const page = await context.newPage();
      const consoleErrors = [];
      const failedRequests = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('requestfailed', (request) => failedRequests.push(request.url()));

      const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 60_000 });
      const where = `${route} @${viewport.name}`;

      if (response?.status() !== 200) failures.push(`${where}: HTTP ${response?.status()}`);
      for (const error of consoleErrors) failures.push(`${where}: console error — ${error}`);
      for (const url of failedRequests) failures.push(`${where}: request failed — ${url}`);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      if (overflow > 0) failures.push(`${where}: ${overflow}px of horizontal overflow`);

      // Every internal href must point at a route in the manifest.
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'))
      );
      for (const href of new Set(hrefs)) {
        if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) continue;
        const path = href.split('#')[0].split('?')[0];
        if (path && !known.has(path)) failures.push(`${where}: link to unknown route "${href}"`);
      }

      // One heading level per page, and it must be an h1.
      const h1s = await page.evaluate(() => document.querySelectorAll('h1').length);
      if (h1s !== 1) failures.push(`${where}: ${h1s} <h1> elements (expected 1)`);

      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      for (const violation of axe.violations) {
        if (violation.impact !== 'serious' && violation.impact !== 'critical') continue;
        const targets = violation.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ');
        failures.push(`${where}: axe ${violation.impact} — ${violation.id} (${targets})`);
      }

      checks++;
      await page.close();
    }

    await context.close();
  }

  await browser.close();

  console.log(`\nChecked ${checks} page/viewport combinations.`);
  if (!failures.length) {
    console.log('No failures.');
    return;
  }
  console.log(`${failures.length} failure(s):`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exitCode = 1;
}

main();
