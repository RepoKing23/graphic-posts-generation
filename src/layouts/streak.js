/**
 * 08 — Motion Streak.
 *
 * Long-exposure light bands, the car pushed hard into the right bleed, and the
 * power figure set in condensed caps at poster scale. Near-black, one orange.
 */
import { STEEL, FONT, grainLight, alpha, mix } from '../theme/tokens.js';
import { BRANDS, brandMark } from '../data/brands.js';
import { streaks } from '../theme/motifs.js';
import { specTable, tag } from '../theme/blocks.js';
import { heroCar } from '../photo.js';

export default function streak(car) {
  const b = BRANDS[car.brand];
  const amber = car.accent;
  const night = '#08090C';

  return `
  <div style="position:absolute;inset:0;background:
    radial-gradient(96% 60% at 78% 44%, ${mix(night, amber, 0.13)}, ${night} 66%, #040507 100%);"></div>
  <div style="position:absolute;inset:0;opacity:.62;">${streaks({ color: amber, count: 15, seed: 11 })}</div>
  <div style="position:absolute;inset:0;opacity:.3;">${streaks({ color: '#9FC7FF', count: 8, seed: 41 })}</div>

  <!-- car, cropped by the right edge and blurred into motion at the tail -->
  <div style="position:absolute;top:436px;left:150px;width:1220px;">
    ${heroCar(car, { fill: '#2E333B', detail: alpha(amber, 0.62), lamp: '#FFD9A8',
      glass: 'rgba(140,170,210,.26)', sheen: alpha(amber, 0.2),
      tyre: '#08090B', rim: '#A9B0B9', shadow: true })}
  </div>
  <div style="position:absolute;top:436px;left:0;width:300px;height:480px;
    background:linear-gradient(90deg, ${night}, transparent);"></div>

  <!-- masthead -->
  <div style="position:absolute;top:62px;left:66px;display:flex;align-items:center;gap:20px;">
    ${brandMark(car.brand, 44)}
    <span style="font-family:${FONT.mono};font-weight:600;font-size:12.5px;letter-spacing:0.18em;
      text-transform:uppercase;color:${alpha('#EFEFF2', 0.92)};">${car.year} · ${car.trim}</span>
  </div>

  <!-- headline -->
  <div style="position:absolute;top:180px;left:66px;width:640px;">
    ${tag(car.kicker, { color: alpha('#EFEFF2', 0.7), accent: amber })}
    <div style="margin-top:20px;font-family:${FONT.condensed};font-weight:800;font-size:96px;
      line-height:.86;letter-spacing:.005em;text-transform:uppercase;color:#F4F4F6;">
      Five litres.<br>Eight cylinders.<br><span style="color:${amber};">No apology.</span>
    </div>
  </div>

  <!-- the number, sitting under the car -->
  <div style="position:absolute;left:66px;bottom:296px;display:flex;align-items:flex-end;gap:22px;">
    <div style="font-family:${FONT.condensed};font-weight:900;font-size:260px;line-height:.7;
      letter-spacing:-.02em;color:${amber};">${car.specs[0].v}</div>
    <div style="padding-bottom:22px;">
      <div style="font-family:${FONT.condensed};font-weight:800;font-size:56px;line-height:.8;
        letter-spacing:.02em;text-transform:uppercase;color:#F4F4F6;">hp</div>
      <div style="margin-top:10px;font-family:${FONT.mono};font-weight:600;font-size:12.5px;letter-spacing:0.18em;
        text-transform:uppercase;color:${alpha('#EFEFF2', 0.92)};">${car.specs[0].u}</div>
    </div>
  </div>

  <!-- specs -->
  <div style="position:absolute;left:66px;right:66px;bottom:150px;
    border-top:1px solid ${alpha('#EFEFF2', 0.22)};padding-top:22px;
    display:grid;grid-template-columns:1fr 1fr;gap:16px 60px;">
    ${specTable(car.specs.slice(1, 4), { color: '#EFEFF2', accent: '#fff', valueSize: 19, rowGap: 13 })}
    ${specTable(car.specs.slice(4), { color: '#EFEFF2', accent: '#fff', valueSize: 19, rowGap: 13 })}
  </div>

  <div style="position:absolute;left:66px;bottom:66px;font-family:${FONT.condensed};
    font-weight:900;font-size:44px;letter-spacing:.01em;text-transform:uppercase;color:#fff;">
    ${b.name} ${car.model}</div>
  <div style="position:absolute;right:66px;bottom:78px;font-family:${FONT.mono};font-weight:600;font-size:12.5px;
    letter-spacing:0.18em;text-transform:uppercase;color:${alpha('#EFEFF2', 0.92)};">
    ${car.specs[4].v} mph</div>

  ${grainLight(0.075)}`;
}
