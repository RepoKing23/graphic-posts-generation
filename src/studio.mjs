/**
 * The rendering harness: one Chromium, one loopback server, and the assertions
 * that keep a bad render from reaching disk.
 *
 * Split out of render.mjs so the poster renderer and the social pipeline share
 * exactly the same guarantees — a missing typeface or an off-size PNG fails
 * the same way whether it happens to a poster, a carousel slide or a card.
 */
import { chromium } from 'playwright-core';
import { writeFile, readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { page } from './page.mjs';
import { startServer } from './serve.mjs';

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

/**
 * @param {string} root  repository root, served over loopback
 * @returns {{shoot: Function, close: Function, origin: string}}
 */
export async function openStudio(root) {
  const server = await startServer(root);
  const browser = await chromium.launch({ executablePath: await chromePath() });
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  const tab = await ctx.newPage();

  /**
   * Render one page and write the PNG.
   *
   * @param {string} inner  stage HTML
   * @param {{w:number,h:number}} size
   * @param {string} file   absolute output path
   * @param {string} label  used in warnings
   */
  async function shoot(inner, size, file, label = '') {
    server.set(page(inner, size));
    await tab.setViewportSize({ width: size.w, height: size.h });
    await tab.goto(`${server.origin}/poster`, { waitUntil: 'load' });
    await tab.evaluate(() => document.fonts.ready);

    // A silently-missing typeface restyles the whole page, so fail loudly.
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
    }, size);
    for (const c of clipped) console.warn(`  ! ${label} text off-canvas: ${c}`);

    await mkdir(path.dirname(file), { recursive: true });
    const buf = await tab.screenshot({
      clip: { x: 0, y: 0, width: size.w, height: size.h }, type: 'png',
    });
    await writeFile(file, buf);

    // Verify the PNG really is the size asked for, by reading the IHDR header.
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    if (w !== size.w || h !== size.h) {
      throw new Error(`${label}: rendered ${w}x${h}, expected ${size.w}x${size.h}`);
    }
    return { file, w, h, clipped };
  }

  return {
    shoot,
    origin: server.origin,
    close: async () => { await browser.close(); await server.close(); },
  };
}
