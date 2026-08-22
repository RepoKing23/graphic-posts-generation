/**
 * 02 — Concentric Field.
 *
 * Moiré ring fields bleeding out of opposite corners, a column of x-marks down
 * each flank, three red slats behind the car, and a strapline whose colour
 * changes mid-word. Red is the only saturated colour on the page.
 */
import { PAPER, INK, FONT, grain, alpha, mix } from '../theme/tokens.js';
import { wordmark } from '../data/brands.js';
import { xColumn } from '../theme/motifs.js';
import { specLedger } from '../theme/blocks.js';
import { photoPanel, heroCar, photoOf } from '../photo.js';

/** Ring field sized to its own box rather than the whole stage. */
const ringBox = (w, h, { cx, cy, from, to, step, color, width, opacity = 1 }) => {
  const c = [];
  for (let r = from; r <= to; r += step) {
    c.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${width}"/>`);
  }
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"
    style="position:absolute;left:0;top:0;opacity:${opacity}"
    xmlns="http://www.w3.org/2000/svg">${c.join('')}</svg>`;
};

export default function concentric(car) {
  const red = car.accent;
  const hasPhoto = Boolean(photoOf(car.slug));

  const strap = `THERE'S <span style="color:${red}">O</span>NLY `
              + `<span style="color:${red}">O</span>NE`;

  // Slats: a red field with a ring moiré. With a photograph present it shows
  // through, tinted; without one the moiré carries the panel on its own.
  const slat = (i) => `
    <div style="flex:1;position:relative;overflow:hidden;border-radius:16px 16px 3px 3px;
      background:linear-gradient(${152 + i * 12}deg, ${red}, ${mix(red, '#2A0206', 0.62)});">
      ${hasPhoto ? `<div style="position:absolute;inset:0;opacity:.55;">
        ${photoPanel(car, { position: ['30% 45%', '50% 50%', '72% 45%'][i],
          filter: 'grayscale(1) contrast(1.25)' })}
      </div>` : ''}
      ${ringBox(260, 384, { cx: 130 + (i - 1) * 46, cy: 168, from: 10, to: 400,
        step: 7.5, color: alpha('#1A0003', 0.42), width: 1.7 })}
      <div style="position:absolute;inset:0;
        background:linear-gradient(180deg, transparent 52%, ${alpha('#2A0206', 0.5)});"></div>
    </div>`;

  return `
  <div style="position:absolute;inset:0;background:
    linear-gradient(158deg, ${PAPER[0]} 0%, ${PAPER[1]} 44%, ${PAPER[2]} 100%);"></div>

  <!-- corner moiré, bleeding off opposite corners -->
  <div style="position:absolute;left:-300px;top:-260px;">
    ${ringBox(760, 760, { cx: 300, cy: 300, from: 24, to: 520, step: 7, color: red, width: 2.2, opacity: 0.9 })}
  </div>
  <div style="position:absolute;left:666px;top:790px;">
    ${ringBox(700, 700, { cx: 430, cy: 300, from: 26, to: 480, step: 7.5, color: red, width: 2.1, opacity: 0.62 })}
  </div>

  <!-- masthead -->
  <div style="position:absolute;top:96px;left:0;right:0;text-align:center;">
    ${wordmark(car.brand, { size: 124, color: INK })}
    <div style="margin-top:12px;font-family:${FONT.archivo};font-weight:800;font-size:31px;
      letter-spacing:.135em;color:${INK};">${strap}</div>
  </div>

  <!-- red slats -->
  <div style="position:absolute;top:312px;left:132px;right:132px;height:384px;
    display:flex;gap:15px;">${[0, 1, 2].map(slat).join('')}</div>

  <!-- x-mark flanks -->
  ${xColumn({ x: 76, y: 486, count: 6, gap: 46, color: red })}
  ${xColumn({ x: 1004, y: 486, count: 6, gap: 46, color: red })}

  <!-- hero, breaking out of the slats -->
  <div style="position:absolute;top:540px;left:66px;right:66px;">
    ${heroCar(car, { fill: '#23262B', detail: 'rgba(255,255,255,.26)', lamp: 'rgba(255,255,255,.32)',
      glass: 'rgba(150,168,190,.24)', sheen: 'rgba(255,255,255,.08)',
      tyre: '#0C0D0F', rim: '#AEB4BC', shadow: true })}
  </div>

  <!-- footer plate: keeps the moiré off the type without hiding it entirely -->
  <div style="position:absolute;left:0;right:0;bottom:0;height:340px;
    background:linear-gradient(180deg, ${alpha(PAPER[1], 0)} 0%, ${PAPER[1]} 26%, ${PAPER[1]} 100%);"></div>

  <div style="position:absolute;top:1006px;left:0;right:0;display:flex;justify-content:center;">
    <div style="background:${red};padding:16px 54px 14px;border-radius:6px;
      font-family:${FONT.archivo};font-weight:900;font-size:32px;letter-spacing:.05em;
      color:#fff;">JEEP.COM</div>
  </div>

  <div style="position:absolute;left:92px;right:92px;bottom:122px;">
    ${specLedger(car.specs, { color: INK, accent: INK, valueSize: 33 })}
  </div>

  <div style="position:absolute;left:132px;right:132px;bottom:50px;text-align:center;
    font-family:${FONT.archivo};font-weight:600;font-size:11.5px;line-height:1.66;
    letter-spacing:.055em;text-transform:uppercase;color:${alpha(INK, 0.84)};">
    ${car.body}
  </div>

  ${grain(0.055)}`;
}
