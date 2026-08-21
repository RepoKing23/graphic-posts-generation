/** Contact sheet — all ten posters on one page, with photo coverage noted. */
import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { CARS } from './data/cars.js';
import { BRANDS } from './data/brands.js';
import { photoStatus } from './photo.js';

/** Always lists every poster on disk, not just the ones this run produced —
 *  otherwise `npm run render 03` leaves a contact sheet with one poster on it. */
export async function buildGallery(_written, outDir) {
  const cards = CARS
    .map((car) => ({ car, file: `${car.id}-${car.slug}.png` }))
    .filter(({ file }) => existsSync(path.join(outDir, file)))
    .map(({ car, file }) => {
    const st = photoStatus(car);
    const src = st.photo || st.cutout
      ? [st.photo && 'photo', st.cutout && 'cut-out'].filter(Boolean).join(' + ')
      : 'silhouette';
    return `<figure>
      <a href="${file}" target="_blank"><img src="${file}" alt="${car.model}"></a>
      <figcaption>
        <b>${car.id} · ${BRANDS[car.brand].name} ${car.model}</b>
        <span>${car.layout} · ${src}</span>
      </figcaption>
    </figure>`;
  }).join('');

  const html = `<!doctype html><meta charset="utf-8"><title>Car spec posts — contact sheet</title>
<style>
:root{color-scheme:light dark;--bg:#F3F1EC;--fg:#1A1A18;--mut:#6B6656;--line:#D6D2C7;}
@media (prefers-color-scheme:dark){:root{--bg:#121214;--fg:#EDEBE6;--mut:#8B8578;--line:#2A2A2E;}}
body{margin:0;padding:48px clamp(20px,4vw,64px);background:var(--bg);color:var(--fg);
  font:400 15px/1.5 ui-sans-serif,system-ui,sans-serif;}
h1{font-size:clamp(24px,3vw,34px);letter-spacing:-.02em;margin:0 0 6px;}
p.sub{color:var(--mut);margin:0 0 40px;max-width:62ch;}
.grid{display:grid;gap:34px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));}
figure{margin:0;}
img{width:100%;height:auto;display:block;border:1px solid var(--line);border-radius:2px;}
figcaption{display:flex;justify-content:space-between;gap:12px;margin-top:10px;
  font-size:12.5px;letter-spacing:.02em;}
figcaption span{color:var(--mut);text-transform:uppercase;letter-spacing:.12em;font-size:11px;
  white-space:nowrap;align-self:center;}
</style>
<h1>Car spec posts</h1>
<p class="sub">Ten 1080&times;1350 posters, rendered from code. Posters marked
<em>silhouette</em> are using the vector fallback — drop a photograph into
<code>assets/cars/</code> and re-run <code>npm run render</code> to swap it in.</p>
<div class="grid">${cards}</div>`;

  await writeFile(path.join(outDir, 'index.html'), html);
}
