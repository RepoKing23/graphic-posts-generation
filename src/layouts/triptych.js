/**
 * 01 — Triptych Spec Sheet.
 *
 * Three detail crops in a row over a hero car, name set enormous and tracked
 * open, spec ledger along the base. Warm paper, one red accent.
 */
import { PAPER, INK, FONT, grain, alpha } from '../theme/tokens.js';
import { BRANDS, brandMark } from '../data/brands.js';
import { specLedger, tag } from '../theme/blocks.js';
import { photoPanel, heroCar } from '../photo.js';
import { textureOr, texture, hasTexture } from '../texture.js';

export default function triptych(car) {
  const b = BRANDS[car.brand];
  // Each panel is a different crop — nose, flank, rear quarter — so the
  // triptych reads as three details of one car rather than three copies of it.
  const CROPS = [
    { position: '22% 56%', crop: { scale: 3.0, x: 20, y: 5 } },
    { position: '50% 46%', crop: { scale: 2.7, x: -1, y: 1 } },
    { position: '80% 56%', crop: { scale: 3.0, x: -21, y: 5 } },
  ];
  // Photographic macro if one is present, otherwise a crop of the vector car.
  const DETAILS = ['detail-headlight', 'detail-wheel', 'detail-grille'];
  const panel = (i) => `
    <div style="flex:1;position:relative;overflow:hidden;background:${PAPER[2]};">
      ${textureOr(DETAILS[i], photoPanel(car, {
        ...CROPS[i],
        plate: `linear-gradient(${168 + i * 8}deg, ${PAPER[1]}, ${PAPER[3]})`,
        body: '#1C1E22',
      }), {
        // Pulled well down in saturation so the macros read as one warm set
        // and never introduce a second hue against the single red accent.
        grade: { contrast: 1.08, saturate: 0.22, brightness: 1.03 },
        tint: { colour: PAPER[1], mode: 'soft-light', opacity: 0.55 },
      })}
      <div style="position:absolute;inset:0;
        background:linear-gradient(${PAPER[0]}00 62%, ${alpha(PAPER[0], 0.55)});"></div>
      <div style="position:absolute;left:14px;bottom:12px;font-family:${FONT.mono};
        font-size:10px;letter-spacing:.26em;color:${alpha(INK, 0.5)};">0${i + 1}</div>
    </div>`;

  return `
  <div style="position:absolute;inset:0;background:
    radial-gradient(120% 74% at 50% 8%, ${PAPER[0]}, ${PAPER[1]} 48%, ${PAPER[2]} 100%);"></div>

  <!-- masthead -->
  <div style="position:absolute;top:62px;left:0;right:0;display:flex;
    flex-direction:column;align-items:center;gap:18px;">
    ${brandMark(car.brand, 46, INK)}
    <div style="font-family:${FONT.archivo};font-weight:300;font-size:34px;
      letter-spacing:.52em;text-indent:.52em;color:${INK};text-transform:uppercase;">${b.name}</div>
  </div>

  <!-- triptych -->
  <div style="position:absolute;top:222px;left:74px;right:74px;height:414px;
    display:flex;gap:9px;">${[0, 1, 2].map(panel).join('')}</div>

  <!-- hero, on a photographic sweep when one is available -->
  ${hasTexture('studio-sweep') ? `<div style="position:absolute;top:640px;left:0;right:0;height:392px;
    -webkit-mask-image:linear-gradient(180deg, transparent 0%, #000 18%, #000 66%, transparent 100%);
    mask-image:linear-gradient(180deg, transparent 0%, #000 18%, #000 66%, transparent 100%);">
    ${texture('studio-sweep', { grade: { saturate: 0.16, contrast: 1.04, brightness: 1.06 },
      tint: { colour: PAPER[1], mode: 'soft-light', opacity: 0.6 }, opacity: 0.8 })}
  </div>` : ''}
  <div style="position:absolute;top:604px;left:60px;right:60px;">
    ${heroCar(car, { fill: '#1B1D21', detail: 'rgba(255,255,255,.22)',
      lamp: 'rgba(255,255,255,.34)', glass: 'rgba(160,178,200,.20)',
      sheen: 'rgba(255,255,255,.07)', tyre: '#0D0E10', rim: '#B9BEC6', shadow: true })}
  </div>

  <!-- name -->
  <div style="position:absolute;top:986px;left:0;right:0;text-align:center;">
    <div style="font-family:${FONT.archivo};font-weight:900;font-size:104px;
      letter-spacing:.02em;line-height:.86;color:${INK};">${car.model.toUpperCase()}</div>
    <div style="margin-top:18px;display:flex;justify-content:center;">
      ${tag(`${car.year} · ${car.trim}`, { color: alpha(INK, 0.62), accent: car.accent })}
    </div>
  </div>

  <!-- copy -->
  <div style="position:absolute;top:1122px;left:176px;right:176px;text-align:center;
    font-family:${FONT.grotesk};font-size:15.5px;line-height:1.62;color:${alpha(INK, 0.68)};">
    ${car.body}
  </div>

  <!-- ledger -->
  <div style="position:absolute;left:74px;right:74px;bottom:60px;">
    ${specLedger(car.specs, { color: INK, accent: car.accent, valueSize: 34, labelSize: 9.5, unitSize: 9.5 })}
  </div>

  ${grain(0.05)}`;
}
