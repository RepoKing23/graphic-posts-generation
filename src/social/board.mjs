/**
 * Contact sheet for the derived posts — every card, every carousel and the
 * copy that goes with them, on one page.
 *
 * The poster contact sheet answers "does the set hold together as a set". This
 * one answers the question the skill's review phase cannot: does the LinkedIn
 * card, the carousel and the tweet still read as the same account.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { CARS } from '../data/cars.js';
import { BRANDS } from '../data/brands.js';
import { PLATFORMS } from '../data/platforms.js';
import { AUTHOR } from '../data/author.js';
import { authorLine } from './markdown.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Post folders are addressed relative to out/posts/index.html. */
const here = (row) => row.output_folder.replace(/^out\/posts\//, '');

function postBlock(row) {
  const p = PLATFORMS[row.platform];
  const dir = here(row);
  const files = row.output_files[row.language] || [];
  const links = files.map((f) => `<a href="${dir}/${f}">${f.split('.').slice(1, -1).join('.')}</a>`).join(' ');
  const tone = `formality ${row.effective_tone.formality} · opinionated ${row.effective_tone.opinionated}`;

  const images = row.platform === 'instagram'
    ? `<div class="strip">${row.output_files.images
        .map((f) => `<a href="${dir}/${f}" target="_blank"><img src="${dir}/${f}" alt=""></a>`).join('')}</div>`
    : `<a href="${dir}/${row.output_files.images[0]}" target="_blank">
         <img class="card" src="${dir}/${row.output_files.images[0]}" alt=""></a>`;

  const preview = row.platform === 'linkedin' ? row.platform_data.hook
    : row.platform === 'instagram' ? row.platform_data.caption.visible_preview
      : row.platform_data.tweet.text;

  return `<section class="post">
    <header><b>${p.name}</b><span>${tone}</span></header>
    ${images}
    <pre>${esc(preview)}${row.platform === 'instagram' ? '…' : ''}</pre>
    <nav>${links} · <a href="${dir}/platform_data.json">platform_data.json</a></nav>
  </section>`;
}

export async function buildBoard(rows, outDir) {
  const posts = rows.filter((r) => r.kind === 'post');
  const groups = CARS
    .map((car) => ({ car, posts: posts.filter((r) => r.derived_from === car.id) }))
    .filter((g) => g.posts.length);

  const body = groups.map(({ car, posts: ps }) => `
    <article>
      <h2><span class="id">${car.id}</span> ${BRANDS[car.brand].name} ${car.model}
        <em>${car.trim} · ${car.year}</em></h2>
      <p class="src">Derived from <a href="../${car.id}-${car.slug}.png">the ${car.id} poster</a>
        · accent <code style="--c:${car.accent}">${car.accent}</code></p>
      <div class="posts">${ps.map(postBlock).join('')}</div>
    </article>`).join('');

  const html = `<!doctype html><meta charset="utf-8"><title>Derived social posts</title>
<style>
:root{color-scheme:light dark;--bg:#F3F1EC;--fg:#1A1A18;--mut:#6B6656;--line:#D6D2C7;--panel:#FBFAF7;}
@media (prefers-color-scheme:dark){:root{--bg:#121214;--fg:#EDEBE6;--mut:#8B8578;--line:#2A2A2E;--panel:#191A1D;}}
body{margin:0;padding:48px clamp(20px,4vw,64px);background:var(--bg);color:var(--fg);
  font:400 15px/1.5 ui-sans-serif,system-ui,sans-serif;}
h1{font-size:clamp(24px,3vw,34px);letter-spacing:-.02em;margin:0 0 6px;}
p.sub{color:var(--mut);margin:0 0 44px;max-width:70ch;}
article{border-top:1px solid var(--line);padding:34px 0 10px;}
h2{font-size:22px;letter-spacing:-.015em;margin:0 0 4px;display:flex;align-items:baseline;gap:10px;}
h2 em{font-style:normal;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--mut);}
.id{font:600 12px/1 ui-monospace,monospace;letter-spacing:.16em;color:var(--mut);}
.src{margin:0 0 22px;font-size:13px;color:var(--mut);}
.src code{position:relative;padding-left:16px;}
.src code::before{content:"";position:absolute;left:0;top:.15em;width:11px;height:11px;background:var(--c);}
.posts{display:grid;gap:26px;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));}
.post{background:var(--panel);border:1px solid var(--line);padding:16px;}
.post header{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:12px;}
.post header span{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--mut);}
img.card{width:100%;height:auto;display:block;border:1px solid var(--line);}
.strip{display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;}
.strip img{height:190px;width:auto;border:1px solid var(--line);}
pre{white-space:pre-wrap;font:400 12.5px/1.5 ui-monospace,monospace;color:var(--mut);
  margin:12px 0 10px;max-height:8.4em;overflow:hidden;}
nav{font-size:11.5px;letter-spacing:.04em;color:var(--mut);}
a{color:inherit;}
</style>
<h1>Derived social posts</h1>
<p class="sub">Every poster in this set is a source article; each platform post below was planned,
drafted, reviewed and finalised from it by <code>npm run posts</code>. Tone is the author's base
voice (formality ${AUTHOR.formality}, opinionated ${AUTHOR.opinionated}) after each platform's
offset — which is why the same car argues its case three different ways.<br>
<small>${esc(authorLine())}</small></p>
${body}`;

  await writeFile(path.join(outDir, 'posts', 'index.html'), html);
}
