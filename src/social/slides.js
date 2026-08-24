/**
 * Carousel slides — 1080×1350, one module for all four slide kinds.
 *
 * A carousel is not ten posters in a row: it has to hold still while the
 * reader swipes, so the furniture (rule, brand, index, handle) is identical on
 * every slide and only the field beneath it changes. The house rules from the
 * posters still apply — one accent, neutral ramp, hairlines, grain over
 * everything, and no rounded corners anywhere.
 *
 *   cover   accent kicker, model at slide scale, silhouette bleeding right
 *   point   one key point, its heading at display scale on paper
 *   specs   the full sheet, dotted leaders, values in the accent
 *   closer  flat accent field, the question, the handle
 */
import { PAPER, STEEL, INK, FONT, grain, grainLight, alpha, onColor, mix } from '../theme/tokens.js';
import { BRANDS, brandMark } from '../data/brands.js';
import { specTable } from '../theme/blocks.js';
import { heroCar } from '../photo.js';
import { AUTHOR } from '../data/author.js';

const M = 92;                       // page margin
const W = 1080, H = 1350;

/** Header and footer, identical on every slide — the thing that makes the
 *  set read as one carousel rather than seven unrelated graphics. */
function furniture(car, slide, total, { ink, faint, accent }) {
  const b = BRANDS[car.brand];
  return `
  <div style="position:absolute;top:${M}px;left:${M}px;right:${M}px;display:flex;
    align-items:center;justify-content:space-between;padding-bottom:20px;
    border-bottom:1px solid ${faint};">
    <div style="display:flex;align-items:center;gap:14px;">
      ${brandMark(car.brand, 26, ink)}
      <span style="font-family:${FONT.mono};font-size:11px;font-weight:600;letter-spacing:.28em;
        text-transform:uppercase;color:${ink};">${b.lettered ? '' : `${b.name} `}${car.model}</span>
    </div>
    <span style="font-family:${FONT.mono};font-size:11px;font-weight:600;letter-spacing:.22em;
      color:${ink};">${String(slide).padStart(2, '0')}<span style="opacity:.45">/${String(total).padStart(2, '0')}</span></span>
  </div>

  <div style="position:absolute;bottom:${M}px;left:${M}px;right:${M}px;padding-top:18px;
    border-top:1px solid ${faint};display:flex;justify-content:space-between;align-items:baseline;
    font-family:${FONT.mono};font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;">
    <span style="color:${alpha(ink === '#FFFFFF' ? '#FFFFFF' : INK, 0.55)};">${AUTHOR.handles.instagram}</span>
    <span style="display:flex;align-items:center;gap:10px;color:${alpha(ink === '#FFFFFF' ? '#FFFFFF' : INK, 0.55)};">
      <span style="width:18px;height:2px;background:${accent};display:block;"></span>
      ${car.year} · ${car.trim}</span>
  </div>`;
}

/* -------------------------------------------------------------------- cover */

function cover(car, slide, total) {
  const a = car.accent;
  const b = BRANDS[car.brand];
  const ink = '#FFFFFF';
  return `
  <div style="position:absolute;inset:0;background:${STEEL[7]};"></div>
  <div style="position:absolute;inset:0;background:
    radial-gradient(78% 52% at 22% 34%, ${alpha(a, 0.22)}, transparent 68%);"></div>
  <div style="position:absolute;left:0;top:${M + 74}px;width:${M}px;height:6px;background:${a};"></div>

  <div style="position:absolute;left:${M}px;right:${M}px;top:${M + 150}px;">
    <div style="font-family:${FONT.mono};font-size:12.5px;font-weight:600;letter-spacing:.34em;
      text-transform:uppercase;color:${a};">${car.kicker}</div>
    <div style="margin-top:26px;font-family:${FONT.archivo};font-weight:900;font-size:118px;
      line-height:.86;letter-spacing:-.045em;color:${ink};">${b.name}<br>
      <span style="color:${a};">${car.model}</span></div>
    <div style="margin-top:34px;max-width:700px;font-family:${FONT.tight};font-weight:300;
      font-size:29px;line-height:1.34;letter-spacing:-.017em;color:${alpha('#FFFFFF', 0.82)};">
      ${slide.body}</div>
  </div>

  <div style="position:absolute;left:6%;right:-16%;bottom:${M + 96}px;opacity:.95;">
    ${heroCar(car, { fill: mix(STEEL[6], a, 0.35), detail: alpha('#FFFFFF', 0.22),
      lamp: alpha(a, 0.8), glass: alpha('#FFFFFF', 0.1), sheen: alpha('#FFFFFF', 0.06),
      tyre: '#08090B', rim: STEEL[4], shadow: false })}
  </div>

  ${furniture(car, slide.number, total, { ink, faint: alpha('#FFFFFF', 0.22), accent: a })}
  ${grainLight(0.09)}`;
}

/* -------------------------------------------------------------------- point */

function point(car, slide, total) {
  const a = car.accent;
  return `
  <div style="position:absolute;inset:0;background:${PAPER[1]};"></div>
  <div style="position:absolute;right:${M - 8}px;top:${M + 96}px;font-family:${FONT.archivo};
    font-weight:900;font-size:300px;line-height:.8;letter-spacing:-.06em;color:${PAPER[2]};">
    ${String(slide.number - 1).padStart(2, '0')}</div>

  <!-- Anchored to the foot, not the head: the ghost numeral holds the top of
       the page, and a point slide that starts halfway down leaves the bottom
       third of the frame empty. -->
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:${M + 190}px;">
    <div style="width:132px;height:5px;background:${a};"></div>
    <h2 style="margin-top:40px;max-width:830px;font-family:${FONT.archivo};font-weight:800;
      font-size:70px;line-height:1.0;letter-spacing:-.035em;color:${INK};">${slide.title}</h2>
    <p style="margin-top:44px;max-width:780px;font-family:${FONT.grotesk};font-weight:400;
      font-size:27px;line-height:1.56;color:${alpha(INK, 0.74)};">${slide.body}</p>
  </div>

  ${furniture(car, slide.number, total, { ink: INK, faint: alpha(INK, 0.2), accent: a })}
  ${grain(0.05)}`;
}

/* -------------------------------------------------------------------- specs */

function specs(car, slide, total) {
  const a = car.accent;
  return `
  <div style="position:absolute;inset:0;background:${PAPER[0]};"></div>
  <div style="position:absolute;left:${M}px;right:${M}px;top:${M + 190}px;">
    <div style="font-family:${FONT.mono};font-size:11.5px;font-weight:600;letter-spacing:.3em;
      text-transform:uppercase;color:${alpha(INK, 0.5)};">${slide.title}</div>
    <div style="margin-top:14px;height:3px;background:${INK};"></div>
    <div style="margin-top:44px;">
      ${specTable(car.specs, { color: INK, accent: a, labelSize: 13, valueSize: 34, rowGap: 30 })}
    </div>
    ${car.footnote ? `<div style="margin-top:30px;font-family:${FONT.mono};font-size:12px;
      letter-spacing:.06em;color:${alpha(INK, 0.5)};">${car.footnote}</div>` : ''}
  </div>

  <div style="position:absolute;left:14%;right:14%;bottom:${M + 108}px;">
    ${heroCar(car, { fill: STEEL[6], detail: alpha('#FFFFFF', 0.2), lamp: alpha(a, 0.85),
      glass: alpha(STEEL[2], 0.35), tyre: '#0B0C0E', rim: STEEL[3], shadow: true })}
  </div>

  ${furniture(car, slide.number, total, { ink: INK, faint: alpha(INK, 0.2), accent: a })}
  ${grain(0.05)}`;
}

/* ------------------------------------------------------------------- closer */

function closer(car, slide, total) {
  const a = car.accent;
  const ink = onColor(a);
  // The composed body is "<verdict> <question>" — split at the final question
  // so the two can be set at different weights rather than as one paragraph.
  const q = slide.body.match(/[^.!?]*\?\s*$/);
  const lead = q ? slide.body.slice(0, slide.body.length - q[0].length).trim() : slide.body;
  const ask = q ? q[0].trim() : '';

  return `
  <div style="position:absolute;inset:0;background:${a};"></div>
  <div style="position:absolute;inset:0;background:
    linear-gradient(158deg, ${alpha(ink, 0.14)}, transparent 46%);"></div>

  <!-- Bottom-anchored, like the point slides: the closer is the last thing a
       reader swipes to, and it should land at the foot of the frame. -->
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:${M + 168}px;">
    <div style="width:210px;height:5px;background:${alpha(ink, 0.85)};"></div>
    <div style="margin-top:34px;font-family:${FONT.mono};font-size:11.5px;font-weight:600;
      letter-spacing:.32em;text-transform:uppercase;color:${alpha(ink, 0.72)};">${slide.title}</div>
    <p style="margin-top:34px;max-width:800px;font-family:${FONT.tight};font-weight:300;
      font-size:33px;line-height:1.36;letter-spacing:-.018em;color:${alpha(ink, 0.9)};">${lead}</p>
    ${ask ? `<p style="margin-top:44px;max-width:850px;font-family:${FONT.archivo};font-weight:800;
      font-size:60px;line-height:1.05;letter-spacing:-.035em;color:${ink};">${ask}</p>` : ''}
  </div>

  ${furniture(car, slide.number, total, { ink, faint: alpha(ink, 0.3), accent: alpha(ink, 0.85) })}
  ${grainLight(0.07)}`;
}

const KIND = { cover, point, specs, closer };

/** One slide of a carousel as stage HTML. */
export function slideHTML(car, slide, total) {
  return (KIND[slide.kind] || point)(car, slide, total);
}

export const SLIDE_CANVAS = { w: W, h: H };
