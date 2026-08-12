/**
 * Locates the Chromium that ships with this environment.
 *
 * `PLAYWRIGHT_BROWSERS_PATH` holds a pre-installed build whose revision may not match the
 * `playwright` package in package.json, so the binary is resolved by globbing rather than by
 * letting Playwright compute a path for a revision that was never downloaded.
 */
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const BROWSERS = process.env.PLAYWRIGHT_BROWSERS_PATH ?? '/opt/pw-browsers';

function find() {
  if (!existsSync(BROWSERS)) return undefined;
  const candidates = readdirSync(BROWSERS)
    .filter((entry) => entry.startsWith('chromium-'))
    .sort()
    .reverse();

  for (const dir of candidates) {
    const binary = resolve(BROWSERS, dir, 'chrome-linux/chrome');
    if (existsSync(binary)) return binary;
  }
  return undefined;
}

/** Undefined lets Playwright fall back to its own managed install. */
export const CHROME = find();
