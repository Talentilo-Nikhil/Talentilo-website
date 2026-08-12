/**
 * Drives every interactive component the way a person would, and asserts what should happen.
 *
 * Usage: node tools/qa/interactions.mjs      (needs the site running on :3000)
 */
import { chromium } from 'playwright';

import { CHROME } from './browser.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const results = [];

/**
 * Everything src/config/navigation.ts puts in the drawer: two Platform pages, four Solution
 * pages, Migration, Pricing, Sign In and Request Demo.
 */
const DRAWER_LINKS = 10;

function check(name, condition, detail = '') {
  results.push({ name, pass: Boolean(condition), detail });
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${name}${detail && !condition ? ` — ${detail}` : ''}`);
}

async function navDropdown(page) {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const trigger = page.getByRole('button', { name: 'Platform' });

  await trigger.hover();
  await page.waitForTimeout(250);
  check('nav: dropdown opens on hover', await page.getByRole('link', { name: /Command Center/ }).isVisible());
  check('nav: aria-expanded tracks state', (await trigger.getAttribute('aria-expanded')) === 'true');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  check('nav: Escape closes the dropdown', (await trigger.getAttribute('aria-expanded')) === 'false');

  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(250);
  check('nav: keyboard opens the dropdown', (await trigger.getAttribute('aria-expanded')) === 'true');

  await page.getByRole('link', { name: /Talent Intelligence/ }).first().click();
  await page.waitForURL('**/product/talent-intelligence');
  check('nav: dropdown links navigate', page.url().endsWith('/product/talent-intelligence'));
  check(
    'nav: dropdown closes after navigating',
    (await page.getByRole('button', { name: 'Platform' }).getAttribute('aria-expanded')) === 'false'
  );
}

async function mobileDrawer(browser) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  const open = page.getByRole('button', { name: 'Open menu' });
  await open.click();
  await page.waitForTimeout(400);

  const dialog = page.getByRole('dialog', { name: 'Site menu' });
  check('drawer: opens', await dialog.isVisible());

  // The drawer used to render inside the sticky header, whose `backdrop-filter` becomes the
  // containing block for fixed children — so it collapsed to the 79px header strip and showed
  // nothing but a close button. Assert it really spans the viewport, not just that it exists.
  const viewport = page.viewportSize();
  const box = await dialog.boundingBox();
  check('drawer: fills the viewport height', box !== null && box.height >= viewport.height - 1);
  check(
    'drawer: every nav destination is reachable',
    (await dialog.locator('a[href]:visible').count()) === DRAWER_LINKS
  );

  check(
    'drawer: locks background scroll',
    (await page.evaluate(() => document.body.style.overflow)) === 'hidden'
  );
  check(
    'drawer: focus moves inside',
    await page.evaluate(() => document.querySelector('#mobile-nav')?.contains(document.activeElement))
  );

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  check('drawer: Escape closes it', (await open.getAttribute('aria-expanded')) === 'false');
  check(
    'drawer: scroll lock released',
    (await page.evaluate(() => document.body.style.overflow)) !== 'hidden'
  );

  await open.click();
  await page.waitForTimeout(300);
  await dialog.getByRole('link', { name: 'Pricing', exact: true }).click();
  await page.waitForURL('**/pricing');
  check('drawer: closes after navigating', (await open.getAttribute('aria-expanded')) === 'false');

  await context.close();
}

async function accordion(page) {
  await page.goto(`${BASE}/pricing`, { waitUntil: 'networkidle' });
  const first = page.getByRole('button', { name: /Is Talentilo just an ATS/ });
  const second = page.getByRole('button', { name: /Can I upgrade my plan/ });

  check('faq: first item starts open', (await first.getAttribute('aria-expanded')) === 'true');
  await second.click();
  await page.waitForTimeout(400);
  check('faq: opening one closes the other', (await first.getAttribute('aria-expanded')) === 'false');
  check('faq: clicked item opens', (await second.getAttribute('aria-expanded')) === 'true');
  await second.click();
  await page.waitForTimeout(400);
  check('faq: clicking again collapses', (await second.getAttribute('aria-expanded')) === 'false');
}

async function pricing(page) {
  await page.goto(`${BASE}/pricing`, { waitUntil: 'networkidle' });
  check(
    'pricing: states the one per-seat rate',
    await page.locator('text=/₹1,299\\/month/').first().isVisible()
  );
  check(
    'pricing: says how that rate is billed',
    await page.locator('text=Per Seat (Billed Annually)').first().isVisible()
  );
  // Talentilo sells annually only. Nothing on the page may imply a monthly alternative exists.
  const body = await page.locator('body').innerText();
  check('pricing: no invented monthly rate anywhere on the page', !body.includes('₹1,624'), body.match(/₹[\d,]+/g)?.join(' ') ?? '');
  check(
    'pricing: no billing toggle',
    (await page.getByRole('button', { name: /Pay Monthly|Pay Annually/ }).count()) === 0
  );
}

async function roiSliders(page) {
  await page.goto(`${BASE}/pricing#roi`, { waitUntil: 'networkidle' });
  const before = await page.locator('text=/Recovered value each month/').locator('..').innerText();
  const slider = page.getByLabel('Billable value per hour');
  await slider.focus();
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(150);
  const after = await page.locator('text=/Recovered value each month/').locator('..').innerText();
  check('roi: slider recomputes the output', before !== after, `${before} -> ${after}`);
}

async function tabs(page) {
  await page.goto(`${BASE}/product/command`, { waitUntil: 'networkidle' });
  const owner = page.getByRole('tab', { name: 'The Owner/VP' });
  const recruiter = page.getByRole('tab', { name: 'The Recruiter' });

  check('tabs: first tab selected', (await owner.getAttribute('aria-selected')) === 'true');
  await owner.focus();
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(150);
  check('tabs: arrow keys wrap around', (await recruiter.getAttribute('aria-selected')) === 'true');
  check(
    'tabs: panel follows selection',
    await page.getByText('Today’s pipeline, today’s follow-ups, nothing else in the way.').isVisible()
  );
}

/** The pill group is wider than a phone, so it has to scroll rather than break onto two rows. */
async function tabsOnPhone(browser) {
  const context = await browser.newContext({ viewport: { width: 320, height: 812 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/product/command`, { waitUntil: 'networkidle' });
  const layout = await page.evaluate(() => {
    const list = document.querySelector('[role="tablist"]');
    const tops = [...list.querySelectorAll('[role="tab"]')].map((tab) =>
      Math.round(tab.getBoundingClientRect().top)
    );
    return { rows: new Set(tops).size, scrolls: list.scrollWidth > list.clientWidth };
  });
  check('tabs: stay on one row at 320px', layout.rows === 1, `${layout.rows} rows`);
  check('tabs: overflow scrolls instead of wrapping', layout.scrolls);
  await context.close();
}

/**
 * Every two-column section divides the 1312 content column the same way. The file splits it
 * 588 | 132 | 592 in thirteen of its fourteen splits, so the columns must mirror each other and
 * the gap must be the same in every section on the page.
 */
async function splitRhythm(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  const splits = await page.evaluate(() => {
    const out = [];
    for (const section of document.querySelectorAll('main > section')) {
      const grid = section.querySelector('.grid');
      if (!grid || grid.children.length !== 2) continue;
      if (getComputedStyle(grid).gridTemplateColumns.split(' ').length !== 2) continue;
      const [a, b] = [...grid.children]
        .map((el) => el.getBoundingClientRect())
        .sort((x, y) => x.left - y.left);
      out.push({
        left: Math.round(a.left),
        right: Math.round(b.right),
        gap: Math.round(b.left - a.right),
        widths: [Math.round(a.width), Math.round(b.width)],
      });
    }
    return out;
  });

  check('split: the homepage has two-column sections to measure', splits.length >= 2, `${splits.length}`);
  const gaps = [...new Set(splits.map((s) => s.gap))];
  check('split: every section uses the same gap', gaps.length === 1, `gaps ${gaps.join(', ')}`);
  check('split: the design gap of 132px at 1440', gaps[0] === 132, `${gaps[0]}px`);
  check(
    'split: columns mirror each other',
    splits.every((s) => Math.abs(s.widths[0] - s.widths[1]) <= 1),
    JSON.stringify(splits.map((s) => s.widths))
  );
  check(
    'split: columns span the 1312 content width',
    splits.every((s) => s.left === 64 && s.right === 1376),
    JSON.stringify(splits.map((s) => `${s.left}→${s.right}`))
  );
  await context.close();
}

/**
 * Every route has to open at the hero. A smooth `scroll-behavior` on <html> used to animate the
 * router's scroll reset against a document that was still growing, landing part-way down.
 */
async function landsAtTop(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  for (const label of ['Pricing', 'Migration']) {
    await page.evaluate(() => window.scrollTo(0, 3000));
    await page.waitForTimeout(200);
    await page.getByRole('link', { name: label, exact: true }).first().click();
    await page.waitForTimeout(1200);
    const y = await page.evaluate(() => window.scrollY);
    check(`scroll: ${label} opens at the top`, y === 0, `scrollY ${y}`);
    await page.goBack({ waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
  }
  await context.close();
}

async function contactForm(page) {
  await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });

  await page.getByRole('button', { name: /Send message/ }).click();
  await page.waitForTimeout(200);
  check('form: blocks an empty submit', await page.getByText('Please tell us your name.').isVisible());

  await page.getByLabel(/Your Name/).fill('Alex Recruiter');
  await page.getByLabel(/Your Email/).fill('not-an-email');
  await page.getByLabel(/Message/).fill('Short');
  await page.getByRole('button', { name: /Send message/ }).click();
  await page.waitForTimeout(200);
  check('form: rejects a malformed email', await page.getByText(/Enter an email address/).isVisible());
  check('form: rejects a too-short message', await page.getByText(/A little more detail/).isVisible());

  await page.getByLabel(/Your Email/).fill('alex@example.com');
  await page.getByLabel(/Message/).fill('We run a 40-seat desk and would like to see the Command Center.');
  await page.getByRole('button', { name: /Send message/ }).click();
  await page.waitForTimeout(1500);
  check('form: submits successfully', await page.getByText(/your message is on its way/i).isVisible());

  // And the server rejects what the client would have caught.
  const bad = await page.evaluate(async (base) => {
    const response = await fetch(`${base}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'x', email: 'nope', message: 'hi' }),
    });
    return { status: response.status, body: await response.json() };
  }, BASE);
  check('api: validates server-side too', bad.status === 422 && Boolean(bad.body.fields));
}

async function reducedMotion(browser) {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('.reveal')].some((el) => Number(getComputedStyle(el).opacity) < 0.99)
  );
  check('motion: nothing stays hidden under prefers-reduced-motion', !hidden);
  await context.close();
}

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('navigation');
  await navDropdown(page);
  console.log('mobile drawer');
  await mobileDrawer(browser);
  console.log('faq');
  await accordion(page);
  console.log('pricing');
  await pricing(page);
  console.log('roi');
  await roiSliders(page);
  console.log('tabs');
  await tabs(page);
  await tabsOnPhone(browser);
  console.log('layout');
  await splitRhythm(browser);
  console.log('scroll');
  await landsAtTop(browser);
  console.log('contact');
  await contactForm(page);
  console.log('motion');
  await reducedMotion(browser);

  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} interaction checks passed.`);
  if (failed.length) process.exitCode = 1;
}

main();
