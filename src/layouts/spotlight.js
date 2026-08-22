/**
 * 03 — Spotlight Fleet.
 *
 * One car lit inside a field of dimmed ones. The offer sits bottom-left as a
 * hard lockup against a single blue plate; everything else is near-black.
 */
import { STEEL, FONT, grainLight, alpha, mix } from '../theme/tokens.js';
import { BRANDS, brandMark } from '../data/brands.js';
import { specTable, tag } from '../theme/blocks.js';
import { heroCar, photoOf, photoPanel } from '../photo.js';
import { carSVG } from '../theme/carart.js';

export default function spotlight(car) {
  const b = BRANDS[car.brand];
  const blue = car.accent;

  // The dimmed fleet: rows of silhouettes receding up the frame, each row
  // smaller, darker and more tightly packed than the one below it.
  const ROWS = [
    { y: 310, scale: 0.30, n: 7, dim: 0.90, x: -40 },
    { y: 402, scale: 0.40, n: 6, dim: 0.84, x: 30 },
    { y: 516, scale: 0.54, n: 5, dim: 0.76, x: -70 },
    { y: 682, scale: 0.74, n: 4, dim: 0.66, x: 40 },
  ];
  const fleet = ROWS.map((r) => {
    const w = 1080 * r.scale * 0.62;
    const cars = Array.from({ length: r.n }, (_, i) => `
      <div style="width:${w}px;flex:0 0 auto;filter:brightness(${1 - r.dim}) saturate(.25) blur(${r.dim > 0.8 ? 1.6 : 0.7}px);">
        ${carSVG(i % 2 ? 'sedan' : (i % 3 ? 'suv' : 'coupe'), {
          fill: mix(STEEL[4], blue, 0.18), glass: alpha(STEEL[2], 0.3),
          tyre: STEEL[7], rim: STEEL[5], shadow: false, style: 'width:100%' })}
      </div>`).join('');
    return `<div style="position:absolute;left:${r.x}px;right:${-r.x}px;top:${r.y}px;
      display:flex;gap:${18 * r.scale}px;justify-content:center;">${cars}</div>`;
  }).join('');

  return `
  <div style="position:absolute;inset:0;background:
    radial-gradient(80% 46% at 50% 52%, ${mix(STEEL[6], blue, 0.16)} 0%, ${STEEL[7]} 62%, #05070A 100%);"></div>

  ${fleet}

  <!-- the light cone that picks out one car -->
  <div style="position:absolute;left:50%;top:0;width:900px;height:880px;
    transform:translateX(-50%);
    clip-path:polygon(43% 0, 57% 0, 92% 100%, 8% 100%);
    background:linear-gradient(180deg, ${alpha('#DCE8FF', 0.16)}, ${alpha('#DCE8FF', 0.02)} 78%, transparent);
    filter:blur(14px);"></div>
  <div style="position:absolute;left:50%;top:640px;width:1000px;height:420px;
    transform:translateX(-50%);
    background:radial-gradient(52% 50% at 50% 46%, ${alpha('#CFE0FF', 0.30)}, transparent 72%);"></div>

  <!-- hero, lit -->
  <div style="position:absolute;top:600px;left:214px;right:214px;">
    ${heroCar(car, { fill: '#EDF0F4', detail: 'rgba(0,0,0,.34)', lamp: '#FFF7DC',
      glass: 'rgba(24,32,44,.72)', sheen: 'rgba(255,255,255,.7)',
      tyre: '#0A0C0F', rim: '#D6DBE2', shadow: true })}
  </div>

  <!-- masthead -->
  <div style="position:absolute;top:58px;right:64px;display:flex;align-items:center;gap:18px;">
    ${brandMark(car.brand, 42, '#EDF0F4')}
    <div style="font-family:${FONT.archivo};font-weight:500;font-size:23px;letter-spacing:.3em;
      color:#EDF0F4;text-transform:uppercase;">${b.name}</div>
  </div>

  <!-- headline -->
  <div style="position:absolute;top:64px;left:64px;max-width:640px;">
    ${tag(car.kicker, { color: alpha('#EDF0F4', 0.66), accent: blue })}
    <div style="margin-top:18px;font-family:${FONT.tight};font-weight:300;font-size:42px;
      line-height:1.08;letter-spacing:-.03em;color:#EDF0F4;">
      <b style="font-weight:800;">641 horsepower,</b><br>and a simulated eight-speed<br>shift you do not need.
    </div>
  </div>

  <!-- offer lockup -->
  <div style="position:absolute;left:64px;bottom:212px;display:flex;align-items:stretch;gap:0;">
    <div style="padding-right:34px;">
      <div style="font-family:${FONT.archivo};font-weight:900;font-size:104px;line-height:.82;
        letter-spacing:-.05em;color:#fff;">${car.specs[2].v}<span style="font-size:52px;">s</span></div>
      <div style="margin-top:14px;font-family:${FONT.archivo};font-weight:700;font-size:17px;
        letter-spacing:.16em;text-transform:uppercase;color:${alpha('#EDF0F4', 0.82)};">
        0&ndash;60 mph, standing start</div>
    </div>
    <div style="width:1px;background:${alpha('#EDF0F4', 0.28)};"></div>
    <div style="background:linear-gradient(150deg, ${blue}, ${mix(blue, '#06102A', 0.42)});
      padding:22px 30px 20px;margin-left:34px;border-radius:14px;display:flex;
      flex-direction:column;justify-content:center;">
      <div style="font-family:${FONT.archivo};font-weight:900;font-size:40px;line-height:.98;
        letter-spacing:-.02em;color:#fff;">${car.specs[0].v}<span style="font-size:22px;"> HP</span><br>
        <span style="font-size:40px;">${car.specs[4].v}<span style="font-size:22px;"> MI</span></span></div>
    </div>
  </div>

  <!-- spec table -->
  <div style="position:absolute;right:64px;bottom:212px;width:352px;">
    ${specTable(car.specs.slice(0, 4), { color: '#EDF0F4', accent: '#fff', valueSize: 19, rowGap: 13 })}
  </div>

  <!-- footer -->
  <div style="position:absolute;left:64px;right:64px;bottom:92px;height:1px;
    background:${alpha('#EDF0F4', 0.22)};"></div>
  <div style="position:absolute;left:64px;bottom:52px;font-family:${FONT.archivo};
    font-weight:800;font-size:22px;letter-spacing:.02em;color:#fff;">
    ${car.model} <span style="color:${blue};">${car.trim}</span></div>
  <div style="position:absolute;right:64px;bottom:54px;font-family:${FONT.mono};font-weight:600;font-size:12px;
    letter-spacing:0.18em;text-transform:uppercase;color:${alpha('#EDF0F4', 0.92)};">
    ${car.year} · book a test drive</div>

  ${grainLight(0.07)}`;
}
