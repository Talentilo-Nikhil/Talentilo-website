/**
 * Drives every interactive component the way a person would, and asserts what should happen.
 *
 * Usage: node tools/qa/interactions.mjs      (needs the site running on :3000)
 */
import { chromium } from 'playwright';

import { CHROME } from './browser.mjs';
import { ROUTES } from './routes.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const results = [];

/**
 * Everything src/config/navigation.ts puts in the drawer: five Platform pages, four Solution
 * pages, Migration, Sign In and Request Demo.
 */
const DRAWER_LINKS = 12;

function check(name, condition, detail = '') {
  results.push({ name, pass: Boolean(condition), detail });
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${name}${detail && !condition ? ` — ${detail}` : ''}`);
}

async function navDropdown(page) {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const trigger = page.getByRole('button', { name: 'Platform' });

  await trigger.hover();
  await page.waitForTimeout(250);
  // Scoped to the desktop nav: the footer now links every destination too, so an unscoped
  // lookup would resolve to both and fail Playwright's strict mode.
  const primary = page.getByLabel('Primary');
  check('nav: dropdown opens on hover', await primary.getByRole('link', { name: /Recruitment OS/ }).isVisible());
  check('nav: aria-expanded tracks state', (await trigger.getAttribute('aria-expanded')) === 'true');
  check('nav: Platform is grouped under its heading', await primary.getByText('Core Platform').isVisible());

  // The live Solution menu is two labelled columns, not one list.
  await page.getByRole('button', { name: 'Solution' }).hover();
  await page.waitForTimeout(300);
  check(
    'nav: Solution shows both column headings',
    (await primary.getByText(/^(For|Recruitment Type)$/).count()) === 2
  );
  check(
    'nav: Solution lists all four destinations',
    (await primary.getByRole('link', { name: /Agency Owner|Organization|High Volume|Tech Recruitment/ }).count()) === 4
  );
  await trigger.hover();
  await page.waitForTimeout(300);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  check('nav: Escape closes the dropdown', (await trigger.getAttribute('aria-expanded')) === 'false');

  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(250);
  check('nav: keyboard opens the dropdown', (await trigger.getAttribute('aria-expanded')) === 'true');

  await page.getByRole('link', { name: /Talent Intelligence/ }).first().click();
  await page.waitForURL('**/platform/talent-intelligence');
  check('nav: dropdown links navigate', page.url().endsWith('/platform/talent-intelligence'));
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
  await dialog.getByRole('link', { name: 'Migration', exact: true }).click();
  await page.waitForURL('**/migration');
  check('drawer: closes after navigating', (await open.getAttribute('aria-expanded')) === 'false');

  await context.close();
}

async function tabs(page) {
  await page.goto(`${BASE}/platform/recruitment-os`, { waitUntil: 'networkidle' });
  const owner = page.getByRole('tab', { name: 'The Owner/VP' });
  const recruiter = page.getByRole('tab', { name: 'The Recruiter' });

  check('tabs: first tab selected', (await owner.getAttribute('aria-selected')) === 'true');
  await owner.focus();
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(150);
  check('tabs: arrow keys wrap around', (await recruiter.getAttribute('aria-selected')) === 'true');
  // Asked structurally rather than by the panel's copy: the panel a tab controls is the one that
  // stops being hidden. `useId` puts colons in the id, so it is matched as an attribute.
  const panelId = await recruiter.getAttribute('aria-controls');
  check(
    'tabs: panel follows selection',
    await page.locator(`[id="${panelId}"]:not([hidden])`).isVisible()
  );
}

/** The pill group is wider than a phone, so it has to scroll rather than break onto two rows. */
async function tabsOnPhone(browser) {
  const context = await browser.newContext({ viewport: { width: 320, height: 812 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/platform/recruitment-os`, { waitUntil: 'networkidle' });
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
 * One content edge down the whole page, on every route.
 *
 * The 1440 frame carries a 64px gutter, leaving 1312 of content. Header, every section and the
 * footer must start at 64 and end at 1376 — a vertical line down the page should touch the left
 * edge of every block.
 */
async function contentEdges(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const offenders = [];

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    const rows = await page.evaluate(() => {
      const measured = [];

      /**
       * The container spans the frame and holds the measure in its padding, so the content edge
       * is the padding box, not the border box.
       */
      const contentBox = (el) => {
        const box = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return {
          left: Math.round(box.left + Number.parseFloat(style.paddingLeft)),
          right: Math.round(box.right - Number.parseFloat(style.paddingRight)),
        };
      };

      /** The container is the first descendant capped at the 1440 frame. */
      const container = (root) => {
        if (!root) return null;
        if (getComputedStyle(root).maxWidth === '1440px') return root;
        for (const child of root.querySelectorAll(':scope > *')) {
          const found = container(child);
          if (found) return found;
        }
        return null;
      };

      const record = (label, root) => {
        const el = container(root);
        if (!el) return;
        measured.push({ label, ...contentBox(el) });
      };

      record('header', document.querySelector('header'));
      document.querySelectorAll('main > section').forEach((section, index) => {
        record(`section ${index}`, section);
      });
      record('footer', document.querySelector('footer'));
      return measured;
    });

    for (const row of rows) {
      if (row.left !== 64 || row.right !== 1376) {
        offenders.push(`${route} ${row.label}: ${row.left}→${row.right}`);
      }
    }
  }

  check(
    'width: every block on every page sits on the 64→1376 measure',
    offenders.length === 0,
    offenders.slice(0, 6).join(' | ')
  );
  await context.close();
}

/**
 * Wide product mockups are authored 1312px across and land near 335px on a phone, so they carry a
 * tap-to-enlarge control below `lg` and none above it.
 */
async function enlargeMockups(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  const trigger = page.getByRole('button', { name: /^Enlarge:/ }).first();
  check('zoom: a phone gets the control', (await page.getByRole('button', { name: /^Enlarge:/ }).count()) > 0);

  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await page.waitForTimeout(500);

  const dialog = page.getByRole('dialog', { name: /.+/ }).last();
  const box = await dialog.boundingBox();
  check('zoom: the dialog covers the screen', box?.width === 390 && box?.height === 844);
  check(
    'zoom: the mockup opens at its design width',
    Math.round((await dialog.locator('img').boundingBox()).width) === 1312
  );
  check(
    'zoom: the page behind is locked',
    (await page.evaluate(() => document.body.style.overflow)) === 'hidden'
  );

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  check('zoom: Escape closes it', !(await dialog.isVisible()));
  check(
    'zoom: scroll lock released',
    (await page.evaluate(() => document.body.style.overflow)) !== 'hidden'
  );
  await context.close();

  const wide = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktop = await wide.newPage();
  await desktop.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(400);
  check(
    'zoom: no control on desktop, where the artwork already reads',
    (await desktop.getByRole('button', { name: /^Enlarge:/ }).count()) === 0
  );
  await wide.close();
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

  for (const label of ['Migration']) {
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

  check(
    'form: names every required field on an empty submit',
    await page.getByText('Please tell us which company you are with.').isVisible()
  );

  // The field labels are the form's own, not a paraphrase: "Company Email" and "Company Name"
  // both start with the same word, so each is matched on the word that tells them apart.
  await page.getByLabel(/Your Name/).fill('Alex Recruiter');
  await page.getByLabel(/Company Email/).fill('not-an-email');
  await page.getByLabel(/Company Name/).fill('Northgate Talent');
  await page.getByLabel(/Message/).fill('Short');
  await page.getByRole('button', { name: /Send message/ }).click();
  await page.waitForTimeout(200);
  check(
    'form: rejects a malformed email',
    await page.getByText(/Enter a company email address/).isVisible()
  );
  check('form: rejects a too-short message', await page.getByText(/A little more detail/).isVisible());

  await page.getByLabel(/Company Email/).fill('alex@example.com');
  await page.getByLabel(/Message/).fill('We run a 40-seat desk and would like to see the Command Center.');
  await page.getByRole('button', { name: /Send message/ }).click();
  // Waited for rather than slept on: this is the first request that reaches /api/contact, so in
  // dev it pays for the route's first compile, which a fixed pause loses a race with.
  const sent = page.getByText(/your message is on its way/i);
  await sent.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  check('form: submits successfully', await sent.isVisible());

  // And the server rejects what the client would have caught. Every key is present and only the
  // values are bad, so this fails on the same three rules the client just enforced rather than on
  // a missing field.
  const bad = await page.evaluate(async (base) => {
    const response = await fetch(`${base}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'x', email: 'nope', company: 'Northgate Talent', message: 'hi' }),
    });
    return { status: response.status, body: await response.json() };
  }, BASE);
  check(
    'api: validates server-side too',
    bad.status === 422 && ['name', 'email', 'message'].every((f) => f in (bad.body.fields ?? {})),
    JSON.stringify(bad.body.fields)
  );
}

/**
 * A page must be whole on arrival. Sections below the fold used to start transparent and settle
 * in only once scrolled to, which reads as the page still loading.
 */
async function loadsWhole(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const route of ['/', '/solution/high-volume', '/platform/recruitment-os']) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    const faded = await page.evaluate(() => {
      const bad = [];
      for (const section of document.querySelectorAll('main > section')) {
        for (const el of [section, ...section.querySelectorAll('*')]) {
          const style = getComputedStyle(el);
          if (style.visibility === 'hidden' || style.display === 'none') continue;
          // Deliberately hidden UI — a button's collapsed arrow, a closed accordion panel — is
          // decorative or takes no space. What must not happen is content occupying the layout
          // while being invisible.
          if (el.closest('[aria-hidden="true"]')) continue;
          const box = el.getBoundingClientRect();
          if (box.width < 1 || box.height < 1) continue;
          if (Number(style.opacity) < 0.05) {
            bad.push(el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0]);
          }
        }
      }
      return [...new Set(bad)];
    });
    check(`load: ${route} renders every section on arrival`, faded.length === 0, faded.slice(0, 3).join(', '));
  }

  const shifted = await page.evaluate(() =>
    [...document.querySelectorAll('main > section')].some(
      (s) => getComputedStyle(s).transform !== 'none'
    )
  );
  check('load: no section waits on a scroll transform', !shifted);
  await context.close();
}

async function reducedMotion(browser) {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const animated = await page.evaluate(() =>
    [...document.querySelectorAll('main *')].some((el) => {
      const duration = getComputedStyle(el).transitionDuration;
      return duration && Number.parseFloat(duration) > 0.05;
    })
  );
  check('motion: transitions are neutralised under prefers-reduced-motion', !animated);
  await context.close();
}

/**
 * The showcase beside the contact form: it must step, it must advance on its own, and it must
 * stop the moment someone is reading it or has asked for no motion.
 *
 * The dwell is seven seconds, so each wait here is a little over one of them. The pointer is
 * parked in a corner first — the showcase pauses under the cursor, and Playwright leaves it
 * wherever the last click put it, which is inside the panel.
 */
async function showcase(browser) {
  const selected = (page) =>
    page.locator('[role="tab"][aria-selected="true"]').getAttribute('id');

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });
  await page.mouse.move(1430, 20);

  const dots = page.getByRole('tablist', { name: 'Choose a capability' }).getByRole('tab');
  check('showcase: one dot per capability', (await dots.count()) === 4);

  const first = await selected(page);
  await page.waitForTimeout(7800);
  check('showcase: advances on its own', (await selected(page)) !== first);

  await page.getByRole('tablist', { name: 'Choose a capability' }).hover();
  const held = await selected(page);
  await page.waitForTimeout(7800);
  check('showcase: holds while hovered', (await selected(page)) === held);

  await page.mouse.move(1430, 20);
  await dots.first().focus();
  const before = await selected(page);
  await page.keyboard.press('ArrowRight');
  check('showcase: arrow keys step through', (await selected(page)) !== before);
  check(
    'showcase: focus follows the selection',
    (await page.evaluate(() => document.activeElement?.getAttribute('aria-selected'))) === 'true'
  );

  // Every slide draws into one grid cell, so the panel must not resize as it steps. The wait
  // clears the 450ms arrival, so each height is measured on a settled slide rather than mid-travel.
  const panel = page.locator('[role="tabpanel"]').first();
  const heights = [];
  for (let index = 0; index < 4; index++) {
    await dots.nth(index).click();
    await page.waitForTimeout(700);
    heights.push((await panel.boundingBox()).height);
  }
  check('showcase: stepping never resizes the panel', new Set(heights).size === 1, heights.join(' / '));

  // The board is the one slide that sheds content of its own, by its card's width rather than
  // the window's — so it is checked on both sides of that width.
  await dots.nth(3).click();
  await page.waitForTimeout(700);
  const wide = await page.getByText(/^Offer$/).isVisible();
  await page.setViewportSize({ width: 390, height: 900 });
  await page.waitForTimeout(400);
  const narrow = await page.getByText(/^Offer$/).isVisible();
  check('showcase: the board keeps four columns wide and drops one narrow', wide && !narrow);

  await context.close();

  const still = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const quiet = await still.newPage();
  await quiet.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });
  await quiet.mouse.move(1430, 20);
  const parked = await selected(quiet);
  await quiet.waitForTimeout(8200);
  check('showcase: never auto-advances under prefers-reduced-motion', (await selected(quiet)) === parked);
  await still.close();
}

/**
 * The scorecard on Talent Intelligence, which is markup where its neighbours are exported images.
 *
 * The ratio assertion is the one that matters. A panel built from markup lays itself out against
 * whatever width it is given, and would collapse to a different shape at every breakpoint while the
 * exported creatives beside it held 588/536 exactly — CreativeGround exists to stop that, and this
 * is the check that proves it still does.
 */
async function scorecard(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/platform/talent-intelligence`, { waitUntil: 'networkidle' });

  const panel = page.getByText('Contextual Fit Score').locator('xpath=../..');
  await panel.scrollIntoViewIfNeeded();

  check('scorecard: the leader is opened up into four dimensions',
    (await panel.getByText(/^(Location|Experience|Skills|Education)$/).count()) === 4);
  check('scorecard: the ranking runs three deep',
    (await panel.getByText(/\d+%/).count()) === 1 + 2,
    'one overall plus two ranked scores');
  check('scorecard: both sides of the skills ledger are named',
    (await panel.getByText('Skills match').isVisible()) &&
      (await panel.getByText('Missing').isVisible()));

  // The leader must be the top of their own list, and their overall must be their own arithmetic.
  const scores = (await panel.getByText(/\d+%/).allInnerTexts()).map((t) => parseInt(t, 10));
  check('scorecard: the leader outscores everyone below', scores[0] === Math.max(...scores),
    scores.join(' / '));

  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(250);
    const box = await panel.boundingBox();
    const ratio = box.width / box.height;
    check(`scorecard: holds the 588/536 slot at ${width}`, Math.abs(ratio - 588 / 536) < 0.01,
      ratio.toFixed(4));
  }

  // The card has to float in the wash, not fill it. Measured as a share of the ground rather than
  // in pixels, because the whole slot is scaled to whatever width it gets and a pixel figure would
  // only ever be true at one of them. 9% a side is the 56px the design was pulled back to at 1440.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(250);
  const ground = await panel.boundingBox();
  const card = await page.getByText('Contextual Fit Score').locator('xpath=..').boundingBox();
  const inset = Math.min(card.x - ground.x, ground.x + ground.width - card.x - card.width) / ground.width;
  check('scorecard: the card is inset from the ground it sits on', inset > 0.09,
    `${(inset * 100).toFixed(1)}% a side`);

  // And it must stay readable while it is inset: the slot renders about 1:1 at 1440, so the scale
  // factor is a straight multiplier on the smallest type in the panel.
  const caption = await page.getByText('In Pune, where the role is').evaluate((el) => {
    const style = getComputedStyle(el);
    return (el.getBoundingClientRect().height / parseFloat(style.lineHeight)) * parseFloat(style.fontSize);
  });
  check('scorecard: its smallest type still renders at 10px or more', caption >= 10,
    `${caption.toFixed(2)}px`);

  await context.close();
}

/**
 * The Talent Intelligence hero, whose artwork is a cut-out screen rather than a filled rectangle.
 *
 * Two things hold it together and neither is visible in the markup on its own. The export arrives
 * transparent to its own edges, so the box around it must not round or clip anything — a radius
 * there would bite into the screen's own corners, and by more and more as the artwork scales down.
 * And the export is already cut at the frame's foot, so its bottom edge is meant to be the band's:
 * a `reveal` or a scrap of bottom padding creeping back in would leave a strip of wash under it
 * and turn the bleed into a float.
 */
async function heroScreen(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/platform/talent-intelligence`, { waitUntil: 'networkidle' });

  const band = page.locator('section').first();
  const art = band.locator('img').first();
  check('hero screen: the hero shows the command centre cut out of its ground',
    /command-center-screen/.test(await art.getAttribute('src')));

  const radii = await art.locator('xpath=..').evaluate((el) => {
    const s = getComputedStyle(el);
    return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomLeftRadius, s.borderBottomRightRadius];
  });
  check('hero screen: nothing rounds the box around it', radii.every((r) => parseFloat(r) === 0),
    radii.join(' '));

  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(250);
    const [outer, inner] = [await band.boundingBox(), await art.boundingBox()];
    const gap = outer.y + outer.height - (inner.y + inner.height);
    check(`hero screen: it runs off the foot of the band at ${width}`, Math.abs(gap) <= 1,
      `${gap.toFixed(2)}px of wash below it`);
  }

  await context.close();
}

/**
 * The AI-calling panel, which has to read as a call that is happening rather than a picture of
 * one. Three things carry that and each can be undone without anyone noticing in a screenshot.
 *
 * The one worth the most care is the last. `--animate-speak` squashes each bar with `scaleY` and
 * deliberately carries no fill mode, because the site-wide reduced-motion block cuts every
 * animation to 0.01ms with one iteration. With a fill mode the bars would hold their final frame,
 * which is the quiet one, and a reader who asked for no motion would get a flat grey strip
 * instead of a waveform. Adding `both` to that token is a one-word change that looks harmless.
 */
async function aiCalling(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/for/recruitment-operations`, { waitUntil: 'networkidle' });

  const ground = page.locator('[class*="588/536"]').first();
  await ground.scrollIntoViewIfNeeded();

  const turns = ground.locator('ol > li');
  check('ai calling: the call is held in words, not listed as topics', (await turns.count()) === 3,
    `${await turns.count()} turns`);

  // Who is speaking is drawn with side and hue, so it has to be spelled out for a screen reader.
  const spoken = await turns.allInnerTexts();
  check('ai calling: every turn names its speaker to a screen reader',
    spoken.filter((t) => /Talentilo agent:/.test(t)).length === 2 &&
      spoken.filter((t) => /Rahul Menon:/.test(t)).length === 1);

  const moving = await ground.locator('span.animate-speak').first().evaluate((el) => {
    const style = getComputedStyle(el);
    return style.animationName === 'speak' && style.animationPlayState === 'running';
  });
  check('ai calling: the line is live — the waveform runs', moving);

  // The card has to stay inside the wash it sits on; the transcript is what could push it out.
  const [outer, card] = [await ground.boundingBox(), await ground.locator('> div').first().boundingBox()];
  const inset = Math.min(outer.y + outer.height - card.y - card.height, card.y - outer.y);
  check('ai calling: the card stays inside its ground at 1440', inset >= 0, `${inset.toFixed(1)}px`);

  await context.close();

  // The bars are drawn at their own heights and only squashed, so switching motion off has to
  // give the waveform back whole rather than freeze it part-way down.
  const still = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const quiet = await still.newPage();
  await quiet.goto(`${BASE}/for/recruitment-operations`, { waitUntil: 'networkidle' });
  await quiet.locator('[class*="588/536"]').first().scrollIntoViewIfNeeded();
  await quiet.waitForTimeout(400);
  const tallest = await quiet.locator('span.animate-speak').evaluateAll((els) =>
    Math.max(...els.map((el) => el.getBoundingClientRect().height))
  );
  // The strip is h-11, and one bar in the set is authored at 100%.
  check('ai calling: with motion off the waveform stands at full height', tallest >= 43,
    `${tallest.toFixed(1)}px of 44`);
  await still.close();
}

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('navigation');
  await navDropdown(page);
  console.log('mobile drawer');
  await mobileDrawer(browser);
  console.log('tabs');
  await tabs(page);
  await tabsOnPhone(browser);
  console.log('layout');
  await splitRhythm(browser);
  await contentEdges(browser);
  console.log('zoom');
  await enlargeMockups(browser);
  console.log('scroll');
  await landsAtTop(browser);
  console.log('contact');
  await contactForm(page);
  await showcase(browser);
  console.log('scorecard');
  await scorecard(browser);
  console.log('hero screen');
  await heroScreen(browser);
  console.log('ai calling');
  await aiCalling(browser);
  console.log('load');
  await loadsWhole(browser);
  console.log('motion');
  await reducedMotion(browser);

  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} interaction checks passed.`);
  if (failed.length) process.exitCode = 1;
}

main();
