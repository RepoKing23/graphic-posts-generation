/**
 * 10 — Service Ticket.
 *
 * The spec sheet as a printed docket: perforated tear line, monospace field
 * rows, barcode, and a struck rubber stamp. Card stock on a dark deck.
 */
import { STEEL, INK, FONT, grain, alpha, mix } from '../theme/tokens.js';
import { BRANDS, brandMark } from '../data/brands.js';
import { barcode, perforation } from '../theme/motifs.js';
import { heroCar } from '../photo.js';
import { texture } from '../texture.js';

export default function ticket(car) {
  const b = BRANDS[car.brand];
  const red = car.accent;
  const card = '#F7F5F0';
  const M = 58;

  const row = (k, v, i) => `
    <div style="display:flex;justify-content:space-between;align-items:baseline;
      padding:11px 0;${i ? `border-top:1px dashed ${alpha(INK, 0.28)};` : ''}">
      <span style="font-family:${FONT.mono};font-size:11px;letter-spacing:.22em;
        text-transform:uppercase;color:${alpha(INK, 0.55)};">${k}</span>
      <span style="font-family:${FONT.mono};font-size:15px;font-weight:600;letter-spacing:.04em;
        color:${INK};">${v}</span>
    </div>`;

  return `
  <div style="position:absolute;inset:0;background:
    radial-gradient(90% 60% at 50% 30%, ${STEEL[5]}, ${STEEL[7]} 72%, #05070A 100%);"></div>
  ${texture('asphalt', { grade: { contrast: 1.15, saturate: 0.1, brightness: 0.38 },
    opacity: 0.55, blend: 'overlay' })}

  <!-- the card -->
  <div style="position:absolute;left:${M}px;right:${M}px;top:${M}px;bottom:${M}px;
    background:${card};box-shadow:0 40px 90px rgba(0,0,0,.5);overflow:hidden;">
    ${texture('paper-fibre', { grade: { saturate: 0, contrast: 1.08, brightness: 1.03 },
      opacity: 0.45, blend: 'multiply' })}

    <!-- header strip -->
    <div style="display:flex;align-items:center;justify-content:space-between;
      padding:26px 34px;border-bottom:2px solid ${INK};">
      <div style="display:flex;align-items:center;gap:16px;">
        ${brandMark(car.brand, 36, INK)}
        <span style="font-family:${FONT.archivo};font-weight:500;font-size:17px;
          letter-spacing:.34em;text-transform:uppercase;color:${INK};">${b.name}</span>
      </div>
      <span style="font-family:${FONT.mono};font-size:11px;letter-spacing:.24em;
        text-transform:uppercase;color:${alpha(INK, 0.6)};">${car.kicker}</span>
    </div>

    <!-- title -->
    <div style="padding:34px 34px 0;">
      <div style="font-family:${FONT.archivo};font-weight:900;font-size:82px;line-height:.86;
        letter-spacing:-.045em;color:${INK};">${car.model}<br>
        <span style="color:${red};">${car.trim}</span></div>
      <div style="margin-top:20px;font-family:${FONT.grotesk};font-size:15px;line-height:1.62;
        color:${alpha(INK, 0.68)};max-width:560px;">${car.body}</div>
    </div>

    <!-- car -->
    <div style="margin:6px 22px 0;">
      ${heroCar(car, { fill: '#1C1F24', detail: 'rgba(255,255,255,.24)', lamp: 'rgba(255,255,255,.3)',
        glass: 'rgba(150,170,196,.22)', sheen: 'rgba(255,255,255,.07)',
        tyre: '#0A0B0D', rim: '#B4BAC2', shadow: true })}
    </div>

    <!-- tear line -->
    <div style="position:relative;height:26px;margin-top:2px;">
      <div style="position:absolute;left:0;right:0;top:12px;height:1px;
        background:repeating-linear-gradient(90deg, ${alpha(INK, 0.45)} 0 7px, transparent 7px 15px);"></div>
      <div style="position:absolute;left:-13px;top:0;">${perforation({ vertical: true, length: 26, pitch: 26, r: 13, color: STEEL[6] })}</div>
      <div style="position:absolute;right:-13px;top:0;">${perforation({ vertical: true, length: 26, pitch: 26, r: 13, color: STEEL[6] })}</div>
    </div>

    <!-- field rows -->
    <div style="padding:14px 34px 0;display:grid;grid-template-columns:1fr 1fr;gap:0 44px;">
      <div>${car.specs.slice(0, 3).map((s, i) => row(s.k, `${s.v} ${s.u}`, i)).join('')}</div>
      <div>${car.specs.slice(3).map((s, i) => row(s.k, `${s.v} ${s.u}`, i)).join('')}</div>
    </div>

    <!-- headline figure and notes, filling the lower stub -->
    <div style="margin:26px 34px 0;padding-top:22px;border-top:2px solid ${INK};
      display:flex;align-items:flex-start;justify-content:space-between;gap:36px;">
      <div>
        <div style="font-family:${FONT.archivo};font-weight:900;font-size:104px;line-height:.8;
          letter-spacing:-.055em;color:${INK};">${car.specs[0].v}</div>
        <div style="margin-top:12px;font-family:${FONT.mono};font-size:10.5px;letter-spacing:.26em;
          text-transform:uppercase;color:${alpha(INK, 0.6)};">horsepower · ${car.specs[5].u}</div>
      </div>
      <div style="max-width:330px;text-align:right;">
        <div style="font-family:${FONT.mono};font-size:10px;letter-spacing:.26em;
          text-transform:uppercase;color:${alpha(INK, 0.5)};margin-bottom:10px;">Notes</div>
        <div style="font-family:${FONT.grotesk};font-size:14px;line-height:1.6;
          color:${alpha(INK, 0.72)};">${car.line}</div>
        <div style="margin-top:24px;height:1px;background:${alpha(INK, 0.35)};"></div>
        <div style="margin-top:8px;font-family:${FONT.mono};font-size:9.5px;letter-spacing:.24em;
          text-transform:uppercase;color:${alpha(INK, 0.45)};">Authorised</div>
      </div>
    </div>

    <!-- foot: barcode left, stamp right -->
    <div style="position:absolute;left:34px;bottom:30px;">
      ${barcode({ width: 320, height: 58, color: INK, seed: 9 })}
      <div style="margin-top:9px;font-family:${FONT.mono};font-size:10.5px;letter-spacing:.3em;
        color:${alpha(INK, 0.6)};">TSLA-${car.year}-${car.slug.slice(-5).toUpperCase()}</div>
    </div>
    <div style="position:absolute;right:34px;bottom:38px;transform:rotate(-8deg);
      border:3px solid ${red};border-radius:6px;padding:12px 20px 10px;opacity:.88;">
      <div style="font-family:${FONT.archivo};font-weight:900;font-size:34px;line-height:.9;
        letter-spacing:.02em;color:${red};">${car.specs[1].v} s</div>
      <div style="margin-top:6px;font-family:${FONT.mono};font-size:9.5px;letter-spacing:.24em;
        text-transform:uppercase;color:${red};">0–60 mph ${car.footnote || ''}</div>
    </div>
  </div>

  ${grain(0.05)}`;
}
