/**
 * Downloads the project's typefaces from Google Fonts into assets/fonts/ and
 * writes an @font-face stylesheet. Committing the font files keeps renders
 * deterministic and offline — the renderer never touches the network.
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Node's fetch ignores HTTPS_PROXY unless told otherwise; harmless elsewhere.
process.env.NODE_USE_ENV_PROXY ??= '1';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');

/** family -> the css2 spec we request. Static weights only; TTF is what
 *  Google serves to a non-woff2 user agent, and Chromium reads it happily. */
const FAMILIES = [
  { name: 'Archivo',          spec: 'Archivo:wght@400;500;600;700;800;900' },
  { name: 'Anton',            spec: 'Anton' },
  { name: 'Bebas Neue',       spec: 'Bebas+Neue' },
  { name: 'Space Grotesk',    spec: 'Space+Grotesk:wght@300;400;500;600;700' },
  { name: 'IBM Plex Mono',    spec: 'IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400' },
  { name: 'Barlow Condensed', spec: 'Barlow+Condensed:wght@300;400;500;600;700;800;900' },
  { name: 'Instrument Serif', spec: 'Instrument+Serif:ital@0;1' },
  { name: 'Syne',             spec: 'Syne:wght@400;600;700;800' },
  { name: 'Oswald',           spec: 'Oswald:wght@200;300;400;500;600;700' },
  { name: 'Allura',           spec: 'Allura' },
  { name: 'Inter Tight',      spec: 'Inter+Tight:wght@300;400;500;600;700;800;900' },
];

// A modern desktop UA would get woff2; the default one gets ttf. Either is fine,
// but ttf keeps the parsing simple and avoids per-glyph unicode-range splitting.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)';

const slug = (s) => s.replace(/\s+/g, '');

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function main() {
  await mkdir(FONT_DIR, { recursive: true });

  // The fonts are committed, so a normal build should not touch the network.
  if (await exists(path.join(FONT_DIR, 'fonts.css')) && !process.argv.includes('--force')) {
    console.log('  fonts already present — pass --force to re-download');
    return;
  }
  const faces = [];

  for (const family of FAMILIES) {
    const url = `https://fonts.googleapis.com/css2?family=${family.spec}&display=block`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`css fetch failed for ${family.name}: ${res.status}`);
    const css = await res.text();

    // Each @font-face block carries one style/weight/src triple.
    const blocks = css.split('@font-face').slice(1);
    let n = 0;
    for (const block of blocks) {
      const src = block.match(/url\((https:[^)]+)\)/);
      if (!src) continue;
      const weight = (block.match(/font-weight:\s*(\d+)/) || [, '400'])[1];
      const italic = /font-style:\s*italic/.test(block);
      const ext = path.extname(new URL(src[1]).pathname) || '.ttf';
      const file = `${slug(family.name)}-${weight}${italic ? 'i' : ''}${ext}`;
      const dest = path.join(FONT_DIR, file);

      if (!(await exists(dest))) {
        const bin = await fetch(src[1], { headers: { 'User-Agent': UA } });
        if (!bin.ok) throw new Error(`font fetch failed: ${file} ${bin.status}`);
        await writeFile(dest, Buffer.from(await bin.arrayBuffer()));
      }
      faces.push(
        `@font-face{font-family:'${family.name}';font-style:${italic ? 'italic' : 'normal'};` +
        `font-weight:${weight};font-display:block;src:url('./${file}');}`
      );
      n++;
    }
    console.log(`  ${family.name.padEnd(18)} ${n} face(s)`);
  }

  await writeFile(path.join(FONT_DIR, 'fonts.css'), faces.join('\n') + '\n');
  console.log(`\n${faces.length} faces -> assets/fonts/fonts.css`);
}

main().catch((e) => { console.error(e); process.exit(1); });
