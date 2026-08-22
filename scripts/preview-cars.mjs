/**
 * Contact sheet of the ten car drawings on their own, so the artwork can be
 * judged without a poster layout on top of it. Not part of the build.
 *
 *   node scripts/preview-cars.mjs [outfile.png]
 */
import { chromium } from 'playwright-core';
import { writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARS } from '../src/data/cars.js';
import { carSVG } from '../src/theme/carart.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dest = process.argv[2] || path.join(ROOT, 'out', 'preview-cars.png');

async function chromePath() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (base && existsSync(base)) {
    for (const d of (await readdir(base)).filter((x) => x.startsWith('chromium-')).sort().reverse()) {
      const p = path.join(base, d, 'chrome-linux', 'chrome');
      if (existsSync(p)) return p;
    }
  }
  return undefined;
}

const cells = CARS.map((c) => `
  <div style="width:640px;padding:14px 18px 20px;background:#EDEBE5;">
    <div style="font:600 13px/1 ui-monospace,monospace;letter-spacing:.18em;
      text-transform:uppercase;color:#55503f;margin-bottom:10px;">
      ${c.id} · ${c.model} ${c.trim}</div>
    ${carSVG(c.slug, {
      fill: '#23262B', sheen: 'rgba(255,255,255,.10)', shadow: true,
      detail: 'rgba(255,255,255,.28)', lamp: 'rgba(255,245,220,.85)',
      accent: c.accent, rim: '#C9CCD1', style: 'width:100%;display:block;',
    })}
  </div>`).join('');

const html = `<!doctype html><meta charset="utf-8">
<body style="margin:0;background:#D8D5CC;display:flex;flex-wrap:wrap;gap:2px;width:1288px;">
${cells}</body>`;

const browser = await chromium.launch({ executablePath: await chromePath() });
const tab = await browser.newPage({ viewport: { width: 1288, height: 900 } });
await tab.setContent(html);
await writeFile(dest, await tab.screenshot({ fullPage: true, type: 'png' }));
await browser.close();
console.log(`preview -> ${dest}`);
