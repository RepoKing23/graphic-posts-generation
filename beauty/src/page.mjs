/**
 * Google Business Profile post, 1200x900 (4:3 — the ratio GBP crops post
 * images to). Palette and type follow the brand: black ground, white serif,
 * rose-gold accent, the LB monogram as watermark on every photo.
 */
import { BRAND } from './posts.js';

export const CANVAS = { w: 1200, h: 900 };

const C = {
  ground: '#0f0d0c',
  ink: '#f6f1ee',
  muted: '#a99c95',
  rose: '#c9907a',
  roseLine: 'rgba(201,144,122,.32)',
};

const panel = (n, side) => `
  <figure class="panel">
    <div class="frame"><img class="photo" src="/beauty/assets/${n}-${side}.jpg" alt=""></div>
    <figcaption>${side}</figcaption>
    <img class="wm" src="/beauty/assets/logo-mark.png" alt="">
  </figure>`;

export function page(post, i, total) {
  const pad = String(i + 1).padStart(2, '0');
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${CANVAS.w}px;height:${CANVAS.h}px;background:${C.ground};overflow:hidden}
  .stage{position:relative;width:100%;height:100%;color:${C.ink};
    background:
      radial-gradient(900px 520px at 50% 52%, rgba(201,144,122,.10), transparent 70%),
      ${C.ground};
    font-family:'Inter Tight',sans-serif}
  .eyebrow{font-weight:600;font-size:14px;letter-spacing:.3em;text-transform:uppercase;color:${C.rose}}
  header{position:absolute;left:56px;right:56px;top:46px;display:flex;justify-content:space-between;align-items:flex-start}
  h1{font-family:'Instrument Serif',serif;font-weight:400;font-size:62px;line-height:1;margin-top:14px;letter-spacing:-.005em}
  h1 em{font-style:italic;color:${C.rose}}
  .lockup{height:104px;margin-top:-6px}
  .panels{position:absolute;left:56px;right:56px;top:196px;height:540px;display:flex;gap:28px}
  .panel{position:relative;flex:1;background:#000;border:1px solid ${C.roseLine};border-radius:22px;overflow:hidden}
  .frame{position:absolute;inset:18px;display:grid;place-items:center}
  /* Feather to an oval so a hard crop edge in the source never shows. */
  .photo{max-width:100%;max-height:100%;display:block;
    -webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 86%,transparent 100%);
            mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 86%,transparent 100%)}
  figcaption{position:absolute;left:20px;top:20px;padding:9px 16px 8px;border:1px solid ${C.roseLine};border-radius:999px;
    background:rgba(0,0,0,.55);font-weight:600;font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:${C.ink}}
  .wm{position:absolute;right:20px;bottom:20px;width:68px;opacity:.55}
  .seam{position:absolute;left:50%;top:${196 + 270}px;transform:translate(-50%,-50%);width:54px;height:54px;border-radius:50%;
    background:${C.ground};border:1px solid ${C.rose};display:grid;place-items:center}
  .seam svg{width:22px;height:22px}
  footer{position:absolute;left:56px;right:56px;top:766px;bottom:46px;display:flex;justify-content:space-between;align-items:center}
  .line{font-family:'Instrument Serif',serif;font-style:italic;font-size:36px;line-height:1.05}
  .meta{margin-top:10px;font-size:15px;color:${C.muted};letter-spacing:.02em}
  .meta b{font-weight:500;color:${C.ink}}
  .cta{padding:19px 30px 18px;border-radius:999px;background:${C.rose};color:#16110f;font-weight:600;font-size:14px;letter-spacing:.24em;text-transform:uppercase;white-space:nowrap}
</style></head><body><div class="stage">
  <header>
    <div>
      <div class="eyebrow">Real client results &nbsp;·&nbsp; ${pad} / ${String(total).padStart(2, '0')}</div>
      <h1>${BRAND.treatment}, <em>before &amp; after.</em></h1>
    </div>
    <img class="lockup" src="/beauty/assets/logo-lockup.png" alt="${BRAND.name}">
  </header>
  <div class="panels">${panel(post.n, 'before')}${panel(post.n, 'after')}</div>
  <div class="seam"><svg viewBox="0 0 24 24" fill="none" stroke="${C.rose}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg></div>
  <footer>
    <div>
      <div class="line">${post.line}</div>
      <div class="meta"><b>${BRAND.name}</b> &nbsp;·&nbsp; Results vary from person to person.</div>
    </div>
    <div class="cta">${BRAND.cta}</div>
  </footer>
</div></body></html>`;
}
