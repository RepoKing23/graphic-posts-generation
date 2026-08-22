/**
 * 04 — Terrain Ribbon.
 *
 * A road unspooling out of a paper massif, the car placed on it, and a script
 * word riding over a stacked sans headline. Paper whites, one red.
 */
import { PAPER, INK, FONT, grain, alpha } from '../theme/tokens.js';
import { BRANDS, brandMark } from '../data/brands.js';
import { massif } from '../theme/motifs.js';
import { specLedger } from '../theme/blocks.js';
import { heroCar } from '../photo.js';

export default function terrain(car) {
  const b = BRANDS[car.brand];
  const red = car.accent;

  return `
  <div style="position:absolute;inset:0;background:
    linear-gradient(200deg, #FFFFFF 0%, ${PAPER[0]} 52%, ${PAPER[1]} 100%);"></div>

  <!-- massif, pushed left and faded into the paper -->
  <div style="position:absolute;left:-140px;top:236px;width:900px;height:560px;opacity:.9;">
    ${massif({ color: PAPER[2], shade: PAPER[3], w: 900, h: 560 })}
    <div style="position:absolute;inset:0;background:
      linear-gradient(180deg, transparent 42%, ${PAPER[0]} 92%);"></div>
  </div>

  <!-- the road: a slab in perspective with a broken centre line -->
  <div style="position:absolute;left:0;right:0;top:742px;height:290px;">
    <svg viewBox="0 0 1080 290" width="1080" height="290" xmlns="http://www.w3.org/2000/svg">
      <path d="M 96 290 L 372 96 L 1080 78 L 1080 176 L 470 214 L 300 290 Z" fill="${PAPER[4]}"/>
      <path d="M 96 290 L 372 96 L 1080 78 L 1080 96 L 392 122 L 150 290 Z" fill="${PAPER[3]}"/>
      <path d="M 300 290 L 470 214 L 1080 176 L 1080 192 L 486 232 L 340 290 Z" fill="${alpha(INK, 0.16)}"/>
      <g fill="${PAPER[1]}">
        ${[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const t = i / 7, t2 = (i + 0.55) / 7;
          const px = (u) => 214 + u * (1080 - 214), py = (u) => 250 - u * 106;
          return `<path d="M ${px(t)} ${py(t)} L ${px(t2)} ${py(t2)}
            L ${px(t2)} ${py(t2) + 9 - i} L ${px(t)} ${py(t) + 11 - i} Z"/>`;
        }).join('')}
      </g>
    </svg>
  </div>

  <!-- masthead: badge left, wordmark right, as the reference sets it -->
  <div style="position:absolute;top:58px;left:62px;background:${red};width:74px;height:74px;
    display:flex;align-items:center;justify-content:center;">
    ${brandMark(car.brand, 40, '#FFFFFF')}
  </div>
  <div style="position:absolute;top:70px;right:62px;display:flex;align-items:center;gap:14px;">
    ${brandMark(car.brand, 34, red)}
    <div style="font-family:${FONT.archivo};font-weight:800;font-size:26px;letter-spacing:.06em;
      color:${INK};text-transform:uppercase;">${b.name}</div>
  </div>

  <!-- headline: script over a stacked sans, right-aligned -->
  <div style="position:absolute;top:196px;right:66px;text-align:right;">
    <div style="font-family:${FONT.script};font-size:104px;line-height:.7;color:${red};
      transform:rotate(-3deg) translateX(-18px);margin-bottom:6px;">${car.kicker}</div>
    <div style="font-family:${FONT.archivo};font-weight:900;font-size:70px;line-height:.94;
      letter-spacing:-.028em;color:${INK};">THE FRONT-DRIVE<br>BENCHMARK,</div>
    <div style="font-family:${FONT.archivo};font-weight:400;font-size:44px;line-height:1.06;
      letter-spacing:.03em;color:${INK};margin-top:4px;">SHARPENED AGAIN</div>
  </div>

  <!-- car, sitting on the road -->
  <div style="position:absolute;top:706px;left:250px;width:686px;transform:rotate(-1.2deg);">
    ${heroCar(car, { fill: '#FBFAF7', detail: 'rgba(0,0,0,.42)', lamp: 'rgba(0,0,0,.34)',
      glass: 'rgba(24,28,36,.86)', sheen: 'rgba(0,0,0,.05)',
      tyre: '#0E0F11', rim: '#9AA0A8', shadow: true,
      outline: 'rgba(20,22,26,.72)', outlineWidth: 3.4 })}
  </div>

  <!-- model plate -->
  <div style="position:absolute;left:66px;top:952px;">
    <div style="font-family:${FONT.mono};font-weight:600;font-size:12.5px;letter-spacing:0.18em;text-transform:uppercase;
      color:${alpha(INK, 0.92)};margin-bottom:10px;">${car.year} · ${car.trim}</div>
    <div style="font-family:${FONT.archivo};font-weight:900;font-size:52px;letter-spacing:-.03em;
      color:${INK};line-height:.92;">${car.model}</div>
  </div>

  <div style="position:absolute;left:66px;right:66px;top:1092px;">
    ${specLedger(car.specs, { color: INK, accent: red, valueSize: 32 })}
  </div>

  <div style="position:absolute;left:66px;right:66px;bottom:52px;text-align:center;
    font-family:${FONT.grotesk};font-size:14px;line-height:1.6;color:${alpha(INK, 0.84)};">
    ${car.body}
  </div>

  ${grain(0.05)}`;
}
