/**
 * Renders every poster in src/data/cars.js to out/<id>-<slug>.png.
 *
 * Each render is verified at exactly 1080x1350 — a layout that overflows the
 * stage is a bug, and a silent off-size PNG is worse than a loud failure.
 */
import { chromium } from 'playwright-core';
import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARS } from './data/cars.js';
import { CANVAS } from './theme/tokens.js';
import { page } from './page.mjs';
import { buildGallery } from './gallery.mjs';
import { startServer } from './serve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');

/** Playwright's bundled Chromium, wherever this happens to be running. */
async function chromePath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (base && existsSync(base)) {
    const dirs = (await readdir(base)).filter((d) => d.startsWith('chromium-')).sort();
    for (const d of dirs.reverse()) {
      const p = path.join(base, d, 'chrome-linux', 'chrome');
      if (existsSync(p)) return p;
    }
  }
  return undefined; // let playwright resolve its own download
}

async function main() {
  const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const cars = only.length ? CARS.filter((c) => only.includes(c.id) || only.includes(c.layout)) : CARS;
  if (!cars.length) throw new Error(`no posters matched: ${only.join(', ')}`);

  await mkdir(OUT, { recursive: true });
  const layouts = {};
  for (const c of cars) {
    if (!layouts[c.layout]) {
      layouts[c.layout] = (await import(`./layouts/${c.layout}.js`)).default;
    }
  }

  const server = await startServer(ROOT);
  const browser = await chromium.launch({ executablePath: await chromePath() });
  const ctx = await browser.newContext({
    viewport: { width: CANVAS.w, height: CANVAS.h },
    deviceScaleFactor: 1,
  });
  const tab = await ctx.newPage();
  const written = [];

  for (const car of cars) {
    server.set(page(layouts[car.layout](car)));
    await tab.goto(`${server.origin}/poster`, { waitUntil: 'load' });
    await tab.evaluate(() => document.fonts.ready);

    // A silently-missing typeface restyles the whole poster, so fail loudly.
    // Only families the page actually asks for matter — a declared face that
    // this layout never uses legitimately stays unloaded.
    const badFonts = await tab.evaluate(() => {
      const loaded = new Set(Array.from(document.fonts)
        .filter((f) => f.status === 'loaded').map((f) => f.family.replace(/['"]/g, '')));
      const declared = new Set(Array.from(document.fonts).map((f) => f.family.replace(/['"]/g, '')));
      const wanted = new Set();
      for (const el of document.querySelectorAll('.stage, .stage *')) {
        const first = getComputedStyle(el).fontFamily.split(',')[0].trim().replace(/['"]/g, '');
        if (declared.has(first)) wanted.add(first);
      }
      return [...wanted].filter((f) => !loaded.has(f));
    });
    if (badFonts.length) throw new Error(`typefaces used but not loaded: ${badFonts.join(', ')}`);

    // Decorative shapes are meant to bleed off the page; text is not. Only
    // warn when a run of type actually leaves the canvas.
    const clipped = await tab.evaluate(({ w, h }) => {
      const out = [];
      for (const el of document.querySelectorAll('.stage *')) {
        const direct = [...el.childNodes]
          .filter((n) => n.nodeType === 3 && n.textContent.trim()).length;
        if (!direct) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        if (r.left < -1 || r.top < -1 || r.right > w + 1 || r.bottom > h + 1) {
          out.push(`"${el.textContent.trim().slice(0, 28)}" at `
            + `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      }
      return out;
    }, CANVAS);
    for (const c of clipped) console.warn(`  ! ${car.id} text off-canvas: ${c}`);

    const file = path.join(OUT, `${car.id}-${car.slug}.png`);
    const buf = await tab.screenshot({ clip: { x: 0, y: 0, width: CANVAS.w, height: CANVAS.h }, type: 'png' });
    await writeFile(file, buf);

    // Verify the PNG really is 1080x1350 by reading the IHDR header.
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    if (w !== CANVAS.w || h !== CANVAS.h) {
      throw new Error(`${car.id}: rendered ${w}x${h}, expected ${CANVAS.w}x${CANVAS.h}`);
    }
    console.log(`  ${car.id}  ${car.layout.padEnd(11)} ${path.basename(file)}  ${w}x${h}`);
    written.push({ car, file: path.basename(file) });
  }

  await browser.close();
  await server.close();
  await buildGallery(written, OUT);
  console.log(`\n${written.length} poster(s) -> out/  (contact sheet: out/index.html)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
