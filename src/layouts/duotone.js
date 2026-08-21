/**
 * 07 — Split Duotone.
 *
 * A hard vertical seam with the car crossing it, rendered twice and clipped so
 * each half carries a different treatment. Night on the left, brass on the right.
 */
import { INK, FONT, grainLight, alpha, mix } from '../theme/tokens.js';
import { BRANDS, brandMark } from '../data/brands.js';
import { specTable, tag } from '../theme/blocks.js';
import { heroCar } from '../photo.js';

export default function duotone(car) {
  const b = BRANDS[car.brand];
  const brass = car.accent;
  const night = '#0B0C0E';
  const SEAM = 46;                                // seam position, % from left

  const carAt = (side) => `
    <div style="position:absolute;inset:0;clip-path:inset(0 ${side === 'left' ? `${100 - SEAM}% ` : '0 '}0 ${side === 'left' ? '0' : `${SEAM}%`});">
      ${heroCar(car, side === 'left'
        ? { fill: mix(night, brass, 0.2), detail: alpha(brass, 0.5), lamp: alpha(brass, 0.7),
            glass: alpha(brass, 0.13), sheen: alpha(brass, 0.09), tyre: '#050607', rim: mix(brass, night, 0.4) }
        : { fill: mix(brass, '#F6EEDF', 0.55), detail: alpha(night, 0.34), lamp: alpha(night, 0.28),
            glass: alpha(night, 0.5), sheen: 'rgba(255,255,255,.5)', tyre: '#141310', rim: mix(brass, '#FFF', 0.3) })}
    </div>`;

  return `
  <div style="position:absolute;inset:0;background:
    linear-gradient(190deg, ${mix(night, brass, 0.06)}, ${night} 70%);"></div>
  <div style="position:absolute;left:${SEAM}%;top:0;bottom:0;right:0;background:
    linear-gradient(200deg, ${mix(brass, '#F6EEDF', 0.42)}, ${mix(brass, '#6B4E24', 0.32)});"></div>
  <div style="position:absolute;left:${SEAM}%;top:0;bottom:0;width:2px;background:${brass};"></div>

  <!-- masthead spans the seam, inverting as it crosses -->
  <div style="position:absolute;top:70px;left:70px;right:70px;display:flex;
    align-items:center;justify-content:space-between;">
    <div style="display:flex;align-items:center;gap:16px;">
      ${brandMark(car.brand, 46, '#F2EDE3')}
      <span style="font-family:${FONT.archivo};font-weight:400;font-size:19px;letter-spacing:.3em;
        color:#F2EDE3;text-transform:uppercase;">${b.name}</span>
    </div>
    <span style="font-family:${FONT.mono};font-size:11px;letter-spacing:.26em;text-transform:uppercase;
      color:${alpha(INK, 0.62)};">${car.year} · ${car.trim}</span>
  </div>

  <!-- headline, left of the seam -->
  <div style="position:absolute;top:190px;left:70px;width:430px;">
    ${tag(car.kicker, { color: alpha('#F2EDE3', 0.7), accent: brass })}
    <div style="margin-top:20px;font-family:${FONT.archivo};font-weight:900;font-size:82px;
      line-height:.9;letter-spacing:-.045em;color:#F6F2EA;">${car.model.replace('AMG ', 'AMG<br>')}</div>
    <div style="margin-top:22px;font-family:${FONT.grotesk};font-size:15.5px;line-height:1.66;
      color:${alpha('#F2EDE3', 0.72)};">${car.line}</div>
    <div style="margin-top:30px;height:1px;background:${alpha(brass, 0.45)};width:120px;"></div>
    <div style="margin-top:26px;font-family:${FONT.grotesk};font-size:14px;line-height:1.72;
      color:${alpha('#F2EDE3', 0.5)};">${car.body}</div>
  </div>

  <!-- the car, crossing -->
  <div style="position:absolute;top:614px;left:24px;right:24px;height:400px;">
    ${carAt('left')}${carAt('right')}
  </div>

  <!-- specs, right of the seam -->
  <div style="position:absolute;top:206px;right:70px;width:400px;">
    ${specTable(car.specs, { color: '#17140F', accent: '#17140F', labelSize: 10.5, valueSize: 21, rowGap: 15 })}
  </div>

  <!-- foot -->
  <div style="position:absolute;left:70px;bottom:104px;width:420px;">
    <div style="font-family:${FONT.archivo};font-weight:900;font-size:96px;line-height:.84;
      letter-spacing:-.05em;color:${brass};">${car.specs[3].v}<span style="font-size:44px;">s</span></div>
    <div style="margin-top:12px;font-family:${FONT.mono};font-size:11px;letter-spacing:.26em;
      text-transform:uppercase;color:${alpha('#F2EDE3', 0.66)};">0–60 mph</div>
  </div>
  <div style="position:absolute;right:70px;bottom:112px;width:400px;text-align:right;
    font-family:${FONT.archivo};font-weight:700;font-size:13px;letter-spacing:.2em;
    text-transform:uppercase;color:${alpha(INK, 0.66)};line-height:1.9;">
    ${car.specs[4].v} mph<br>${car.specs[2].v} ${car.specs[2].u}
  </div>

  ${grainLight(0.06)}`;
}
