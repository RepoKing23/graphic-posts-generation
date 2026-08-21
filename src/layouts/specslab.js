/**
 * 06 — Spec Slab.
 *
 * A Swiss data poster: strict column grid, hairline rules, the headline figure
 * at poster scale, and the car reduced to a small object low on the page.
 */
import { PAPER, INK, FONT, grain, alpha } from '../theme/tokens.js';
import { BRANDS, brandMark } from '../data/brands.js';
import { heroCar } from '../photo.js';

export default function specslab(car) {
  const b = BRANDS[car.brand];
  const blue = car.accent;
  const M = 78;                                  // margin rules
  const G = 100;                                 // type gutter, inside the rules
  const hair = `1px solid ${alpha(INK, 0.22)}`;

  const cell = (s, i) => `
    <div style="padding:16px 18px 20px;${i % 3 ? `border-left:${hair};` : ''}
      ${i > 2 ? `border-top:${hair};` : ''}">
      <div style="font-family:${FONT.mono};font-size:10px;letter-spacing:.26em;
        text-transform:uppercase;color:${alpha(INK, 0.5)};">${s.k}</div>
      <div style="margin-top:12px;font-family:${FONT.archivo};font-weight:800;
        font-size:${String(s.v).length > 4 ? 30 : 44}px;letter-spacing:-.04em;
        line-height:.9;color:${INK};white-space:nowrap;">${s.v}</div>
      <div style="margin-top:8px;font-family:${FONT.mono};font-size:10.5px;
        letter-spacing:.05em;color:${alpha(INK, 0.55)};">${s.u}</div>
    </div>`;

  return `
  <div style="position:absolute;inset:0;background:${PAPER[0]};"></div>
  <div style="position:absolute;left:${M}px;right:${M}px;top:0;bottom:0;
    border-left:${hair};border-right:${hair};"></div>

  <!-- header -->
  <div style="position:absolute;top:${M}px;left:${G}px;right:${G}px;display:flex;
    align-items:center;justify-content:space-between;padding-bottom:22px;border-bottom:2px solid ${INK};">
    <div style="display:flex;align-items:center;gap:16px;">
      ${brandMark(car.brand, 44)}
      <span style="font-family:${FONT.archivo};font-weight:700;font-size:22px;
        letter-spacing:.14em;color:${INK};">${b.name}</span>
    </div>
    <span style="font-family:${FONT.mono};font-size:11px;letter-spacing:.28em;
      text-transform:uppercase;color:${alpha(INK, 0.55)};">${car.model} · ${car.trim} · ${car.year}</span>
  </div>

  <!-- the headline figure -->
  <div style="position:absolute;top:${M + 96}px;left:${G}px;right:${G}px;">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:30px;">
      <div style="font-family:${FONT.archivo};font-weight:900;font-size:300px;line-height:.72;
        letter-spacing:-.062em;color:${INK};">${car.specs[0].v}</div>
      <div style="padding-top:22px;text-align:right;">
        <div style="font-family:${FONT.archivo};font-weight:900;font-size:64px;line-height:.9;
          letter-spacing:-.03em;color:${blue};">HP</div>
        <div style="margin-top:10px;font-family:${FONT.mono};font-size:11px;letter-spacing:.24em;
          text-transform:uppercase;color:${alpha(INK, 0.55)};">combined<br>output</div>
      </div>
    </div>
    <div style="margin-top:26px;font-family:${FONT.tight};font-weight:300;font-size:34px;
      line-height:1.14;letter-spacing:-.026em;color:${INK};max-width:760px;">
      Seven hundred and seventeen horsepower,
      <b style="font-weight:700;">in a saloon with a boot.</b>
    </div>
    <div style="margin-top:40px;display:grid;grid-template-columns:1fr 1fr;gap:44px;
      padding-top:22px;border-top:${hair};">
      <p style="font-family:${FONT.grotesk};font-size:15px;line-height:1.66;color:${alpha(INK, 0.7)};">
        ${car.body}</p>
      <p style="font-family:${FONT.grotesk};font-size:15px;line-height:1.66;color:${alpha(INK, 0.7)};">
        The V8 keeps a flat-plane bark under load; the motor fills the gap below it.
        Two characters, one gearbox, and no perceptible seam between them.</p>
    </div>
  </div>

  <!-- spec grid -->
  <div style="position:absolute;top:700px;left:${G}px;right:${G}px;
    border-top:2px solid ${INK};display:grid;grid-template-columns:repeat(3,1fr);">
    ${car.specs.map(cell).join('')}
  </div>

  <!-- car, small and low -->
  <div style="position:absolute;left:${G + 128}px;right:${G + 128}px;bottom:136px;">
    ${heroCar(car, { fill: '#1A1D22', detail: 'rgba(255,255,255,.24)', lamp: 'rgba(255,255,255,.3)',
      glass: 'rgba(150,170,196,.22)', sheen: 'rgba(255,255,255,.07)',
      tyre: '#0B0C0E', rim: '#B4BAC2', shadow: true })}
  </div>

  <!-- footer -->
  <div style="position:absolute;left:${G}px;right:${G}px;bottom:${M}px;
    border-top:${hair};padding-top:18px;display:flex;justify-content:space-between;
    align-items:baseline;font-family:${FONT.mono};font-size:11px;letter-spacing:.2em;
    text-transform:uppercase;color:${alpha(INK, 0.55)};">
    <span>${car.kicker}</span>
    <span style="color:${INK};font-family:${FONT.archivo};font-weight:800;font-size:15px;
      letter-spacing:.06em;">0–60 in ${car.specs[2].v} s</span>
  </div>

  ${grain(0.045)}`;
}
