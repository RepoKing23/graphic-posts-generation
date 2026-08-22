/**
 * 09 — Halftone Riso.
 *
 * Screen-printed two-colour poster: the car laid down twice, deliberately out
 * of register, over a coarse dot screen. Stencil caps, cream stock.
 */
import { PAPER, FONT, alpha, mix } from '../theme/tokens.js';
import { BRANDS } from '../data/brands.js';
import { halftone } from '../theme/motifs.js';
import { specLedger, tag } from '../theme/blocks.js';
import { carSVG } from '../theme/carart.js';

export default function halftonePoster(car) {
  const b = BRANDS[car.brand];
  const green = car.accent;                    // plate 1
  const ochre = '#C8641E';                     // plate 2
  const stock = '#F2EADA';
  const ink = '#1B2019';

  // Each plate is the same drawing, offset — the misregistration is the point.
  const plate = (color, dx, dy) => `
    <div style="position:absolute;left:${dx}px;top:${dy}px;right:${-dx}px;
      mix-blend-mode:multiply;">
      ${carSVG(car.slug, { fallback: car.profile, fill: color, glass: alpha('#FFFFFF', 0.42), detail: alpha('#FFFFFF', 0.4),
        lamp: alpha('#FFFFFF', 0.5), tyre: mix(color, ink, 0.55), rim: alpha('#FFFFFF', 0.5),
        style: 'width:100%' })}
    </div>`;

  return `
  <div style="position:absolute;inset:0;background:${stock};"></div>
  <div style="position:absolute;inset:0;${halftone({ color: alpha(ochre, 0.42), pitch: 6.5, dot: 1.85, angle: 15, opacity: 0.42 })}"></div>
  <div style="position:absolute;inset:0;${halftone({ color: alpha(green, 0.34), pitch: 6.5, dot: 1.6, angle: 75, opacity: 0.34 })}"></div>

  <!-- a solid ink band the type sits inside -->
  <div style="position:absolute;left:0;right:0;top:0;height:322px;background:${green};"></div>
  <div style="position:absolute;left:0;right:0;top:314px;height:16px;background:${ochre};
    mix-blend-mode:multiply;opacity:.85;"></div>

  <div style="position:absolute;top:64px;left:64px;right:64px;">
    ${tag(b.name.toUpperCase(), { color: alpha(stock, 0.82), accent: ochre, track: 0.36 })}
    <div style="margin-top:18px;font-family:${FONT.anton};font-size:100px;line-height:.98;
      letter-spacing:.005em;text-transform:uppercase;color:${stock};">
      Wade,<br>then arrive.</div>
  </div>

  <!-- the two plates -->
  <div style="position:absolute;top:392px;left:52px;right:52px;height:400px;">
    ${plate(ochre, 9, 7)}
    ${plate(green, 0, 0)}
  </div>

  <!-- pull quote -->
  <div style="position:absolute;top:812px;left:64px;right:64px;
    font-family:${FONT.anton};font-size:60px;line-height:1.08;letter-spacing:.004em;
    text-transform:uppercase;color:${ink};">
    Thirty-five inches<br>of water is a<br><span style="color:${ochre};">road surface.</span>
  </div>

  <!-- registration marks, because it is that kind of poster -->
  ${[[36, 36], [1044, 36], [36, 1314], [1044, 1314]].map(([x, y]) => `
    <svg style="position:absolute;left:${x - 11}px;top:${y - 11}px" width="22" height="22"
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7.5" fill="none" stroke="${ink}" stroke-width="1"/>
      <path d="M11 0 V22 M0 11 H22" stroke="${ink}" stroke-width="1"/>
    </svg>`).join('')}

  <!-- the screen is knocked out under the data, or the dots eat the units -->
  <div style="position:absolute;left:40px;right:40px;bottom:36px;top:1090px;
    background:${stock};"></div>

  <div style="position:absolute;left:64px;right:64px;bottom:112px;">
    ${specLedger(car.specs, { color: ink, accent: ochre, valueSize: 32 })}
  </div>

  <div style="position:absolute;left:64px;right:64px;bottom:56px;display:flex;
    justify-content:space-between;font-family:${FONT.mono};font-weight:600;font-size:12.5px;letter-spacing:0.18em;
    text-transform:uppercase;color:${alpha(ink, 0.92)};">
    <span>${car.model} · ${car.trim}</span><span>${car.year} · two-colour</span>
  </div>`;
}
