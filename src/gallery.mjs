/** Contact sheet — all ten posters on one page, with photo coverage noted.
 *
 *  Each poster is also the source article for three derived social posts; when
 *  those have been generated the sheet links through to their own board. */
import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { CARS } from './data/cars.js';
import { BRANDS } from './data/brands.js';
import { photoStatus } from './photo.js';
import { textureCoverage } from './texture.js';

/** Always lists every poster on disk, not just the ones this run produced —
 *  otherwise `npm run render 03` leaves a contact sheet with one poster on it. */
export async function buildGallery(_written, outDir) {
  const tex = textureCoverage();
  const posts = await countPosts(outDir);
  const haveTex = tex.filter((t) => t.present).length;
  const cards = CARS
    .map((car) => ({ car, file: `${car.id}-${car.slug}.png` }))
    .filter(({ file }) => existsSync(path.join(outDir, file)))
    .map(({ car, file }) => {
    const st = photoStatus(car);
    const src = st.photo || st.cutout
      ? [st.photo && 'photo', st.cutout && 'cut-out'].filter(Boolean).join(' + ')
      : 'vector car';
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
a{color:inherit;}
figcaption span{color:var(--mut);text-transform:uppercase;letter-spacing:.12em;font-size:11px;
  white-space:nowrap;align-self:center;}
</style>
<h1>Car spec posts</h1>
<p class="sub">Ten 1080&times;1350 posters, rendered from code. The identifiable car in each
poster is vector by design; photography supplies the world around it.
<b>${haveTex} of ${tex.length} textures present.</b>
${haveTex === tex.length ? '' : `Missing: <code>${tex.filter((t) => !t.present).map((t) => t.id).join('</code> <code>')}</code>.
See <code>SHOTLIST.md</code>, drop them in <code>assets/textures/</code>, re-run <code>npm run render</code>.`}</p>
${posts ? `<p class="sub"><b>${posts} derived social post(s)</b> — LinkedIn, Instagram and X,
planned, drafted, reviewed and finalised from these posters.
See the <a href="posts/index.html">post board</a>, or <code>out/articles.json</code>.</p>` : ''}
<div class="grid">${cards}</div>`;

  await writeFile(path.join(outDir, 'index.html'), html);
}

/** How many derived posts exist, from the manifest npm run posts writes. */
async function countPosts(outDir) {
  try {
    const rows = JSON.parse(await readFile(path.join(outDir, 'articles.json'), 'utf8'));
    return rows.filter((r) => r.kind === 'post').length;
  } catch {
    return 0;   // posters can be rendered without ever generating posts
  }
}
