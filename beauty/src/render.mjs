/**
 * Renders the before/after series to beauty/out/gbp-NN.png at 1200x900.
 *
 *   node beauty/src/render.mjs        # all
 *   node beauty/src/render.mjs 3 5    # just pairs 3 and 5
 */
import { chromium } from 'playwright-core';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from '../../src/serve.mjs';
import { POSTS } from './posts.js';
import { page, CANVAS } from './page.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(ROOT, 'beauty', 'out');

async function chromePath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (base && existsSync(base)) {
    for (const d of (await readdir(base)).filter((d) => d.startsWith('chromium-')).sort().reverse()) {
      const p = path.join(base, d, 'chrome-linux', 'chrome');
      if (existsSync(p)) return p;
    }
  }
  return undefined;
}

const only = process.argv.slice(2).map(Number);
const posts = POSTS.map((p, i) => ({ p, i })).filter(({ p }) => !only.length || only.includes(p.n));

await mkdir(OUT, { recursive: true });
const server = await startServer(ROOT);
const browser = await chromium.launch({ executablePath: await chromePath() });
const tab = await (await browser.newContext({ viewport: { width: CANVAS.w, height: CANVAS.h } })).newPage();

for (const { p, i } of posts) {
  server.set(page(p, i, POSTS.length));
  await tab.goto(`${server.origin}/poster`, { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  const broken = await tab.evaluate(() => [...document.images].filter((im) => !im.naturalWidth).map((im) => im.src));
  if (broken.length) throw new Error(`images failed to load: ${broken.join(', ')}`);
  const file = path.join(OUT, `gbp-${String(p.n).padStart(2, '0')}.png`);
  await writeFile(file, await tab.screenshot({ type: 'png' }));
  console.log('wrote', path.relative(ROOT, file));
}
await browser.close();
await server.close();
