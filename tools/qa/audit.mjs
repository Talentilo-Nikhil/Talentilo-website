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

/**
 * Third-party hosts whose failure to load is the network's business, not the site's.
 *
 * Calendly's widget script is the only one: /demo embeds the booking calendar, and the egress
 * policy in the environment this suite runs in denies both calendly.com and assets.calendly.com
 * (403 on CONNECT). Without this the page fails three times over — once per viewport — for a
 * reason no change to this repository could fix.
 *
 * This hides one genuine class of bug: a wrong script URL would now be silent here. That is
 * covered instead by `qa:interactions`, whose `demo:` group asserts the exact `src` on the tag and
 * the exact `data-url` on the widget, neither of which needs the network.
 */
const BLOCKED_HOSTS = ['assets.calendly.com', 'calendly.com'];
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
        if (message.type() !== 'error') return;
        // The console error a blocked host produces carries no URL, only the transport failure,
        // so it is matched by shape rather than by name. See BLOCKED_HOSTS.
        if (/ERR_TUNNEL_CONNECTION_FAILED|ERR_BLOCKED_BY_CLIENT/.test(message.text())) return;
        consoleErrors.push(message.text());
      });
      page.on('requestfailed', (request) => {
        // A media element told to preload only its metadata opens a range request, reads the
        // header it needs and cancels the rest — the server answers 206 and the browser reports
        // net::ERR_ABORTED. That is the feature working, not a request that failed, so it is the
        // one abort worth ignoring. Every other failure, and an abort of anything but media,
        // still counts.
        const aborted = request.failure()?.errorText === 'net::ERR_ABORTED';
        if (aborted && request.resourceType() === 'media') return;
        if (BLOCKED_HOSTS.some((host) => request.url().includes(host))) return;
        failedRequests.push(request.url());
      });

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

      /*
       * Colour contrast is measured with motion off.
       *
       * axe computes a ratio from the composited colours, so an element part-way through a fade
       * is measured at whatever opacity that frame happened to hold — and reports a failure that
       * exists for 200ms and belongs to no particular element. The contact page's showcase brought
       * this in: it steps every 3.5s and fades each part of a slide in, so whether the suite went
       * red depended on when axe looked, which is the worst kind of red.
       *
       * Reduced motion is the honest state to audit anyway. globals.css collapses every animation
       * and delay under the switch, so every element sits at its final frame and full opacity, and
       * the showcase stops advancing entirely. The functional checks above still ran against the
       * live page; only this pass sees the settled one.
       */
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(150);

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
