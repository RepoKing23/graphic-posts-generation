/**
 * 05 — Blueprint Cutaway.
 *
 * The car as a technical drawing: line-work only, dimension lines with real
 * arrowheads, leader callouts to each figure, and a drawing-sheet title block.
 */
import { STEEL, FONT, grainLight, alpha, mix } from '../theme/tokens.js';
import { BRANDS } from '../data/brands.js';
import { graphPaper, dimension, leader } from '../theme/motifs.js';
import { carSVG } from '../theme/carart.js';

export default function blueprint(car) {
  const b = BRANDS[car.brand];
  const cy = car.accent;                       // drawing cyan
  const ink = '#050A14';
  const dim = alpha(cy, 0.95);

  // Four callouts, one per corner of the drawing, each with a leader that
  // lands on the part of the car it describes.
  const CALLOUTS = [
    { s: car.specs[0], side: 'l', y: 372, from: [300, 450], to: [392, 566] },  // bonnet
    { s: car.specs[1], side: 'r', y: 372, from: [790, 450], to: [706, 548] },  // roof
    { s: car.specs[3], side: 'l', y: 902, from: [300, 900], to: [352, 792] },  // front wheel
    { s: car.specs[4], side: 'r', y: 902, from: [790, 900], to: [828, 782] },  // tail
  ];

  return `
  <div style="position:absolute;inset:0;background:
    radial-gradient(120% 80% at 50% 40%, ${mix(ink, cy, 0.09)}, ${ink} 70%);"></div>
  <div style="position:absolute;inset:0;${graphPaper({ color: cy, opacity: 0.15 })}"></div>

  <!-- sheet border -->
  <div style="position:absolute;inset:38px;border:1px solid ${alpha(cy, 0.34)};"></div>
  <div style="position:absolute;inset:47px;border:1px solid ${alpha(cy, 0.16)};"></div>

  <!-- header row -->
  <div style="position:absolute;top:70px;left:70px;right:70px;display:flex;
    justify-content:space-between;align-items:flex-end;
    border-bottom:1px solid ${alpha(cy, 0.34)};padding-bottom:16px;">
    <div>
      <div style="font-family:${FONT.archivo};font-weight:500;font-size:30px;letter-spacing:.3em;
        color:${cy};">${b.name.toUpperCase()}</div>
      <div style="margin-top:9px;font-family:${FONT.mono};font-weight:600;font-size:12.5px;letter-spacing:0.18em;
        text-transform:uppercase;color:${alpha(cy, 0.92)};">${car.kicker}</div>
    </div>
    <div style="text-align:right;font-family:${FONT.mono};font-weight:600;font-size:12.5px;letter-spacing:0.18em;
      text-transform:uppercase;color:${alpha(cy, 0.92)};line-height:1.9;">
      Type ${car.trim}<br>Sheet 01 of 01
    </div>
  </div>

  <!-- title -->
  <div style="position:absolute;top:196px;left:70px;">
    <div style="font-family:${FONT.archivo};font-weight:900;font-size:88px;line-height:.88;
      letter-spacing:-.04em;color:#EAF6FF;">${car.model.replace(' ', '<br>')}</div>
  </div>
  <div style="position:absolute;top:210px;right:70px;width:330px;text-align:right;
    font-family:${FONT.grotesk};font-size:14.5px;line-height:1.66;color:${alpha('#EAF6FF', 0.84)};">
    ${car.body}
  </div>

  <!-- the drawing -->
  <div style="position:absolute;top:500px;left:96px;width:888px;">
    ${carSVG(car.slug, { fallback: car.profile, fill: 'none', stroke: cy, width: 2.4, tyre: 'none', rim: 'none',
      glass: 'none', lamp: 'none', style: 'width:100%' })}
  </div>

  <svg style="position:absolute;inset:0;width:1080px;height:1350px" viewBox="0 0 1080 1350"
       xmlns="http://www.w3.org/2000/svg">
    <!-- extension lines -->
    <g stroke="${alpha(cy, 0.30)}" stroke-width="1" stroke-dasharray="4 5">
      <path d="M 110 514 V 878  M 970 514 V 878  M 88 520 H 998  M 88 801 H 998"/>
    </g>
    ${dimension({ x1: 110, y1: 856, x2: 970, y2: 856, label: 'LENGTH 4572', color: dim })}
    ${dimension({ x1: 74, y1: 520, x2: 74, y2: 801, label: '1322', color: dim })}
    ${CALLOUTS.map((c) => leader({ x1: c.from[0], y1: c.from[1], x2: c.to[0], y2: c.to[1], color: cy })).join('')}
  </svg>

  <!-- callout labels -->
  ${CALLOUTS.map((c) => `
    <div style="position:absolute;top:${c.y}px;
      ${c.side === 'l' ? 'left:96px' : 'right:96px;text-align:right'};width:250px;">
      <div style="font-family:${FONT.mono};font-weight:600;font-size:12.5px;letter-spacing:0.18em;text-transform:uppercase;
        color:${alpha(cy, 0.92)};margin-bottom:6px;">${c.s.k}</div>
      <div style="font-family:${FONT.archivo};font-weight:800;font-size:32px;letter-spacing:-.02em;
        color:#EAF6FF;line-height:1;">${c.s.v}
        <span style="font-family:${FONT.mono};font-size:12.5px;font-weight:400;letter-spacing:0.08em;
          color:${alpha(cy, 0.92)};">${c.s.u}</span></div>
    </div>`).join('')}

  <!-- title block, bottom-right, as on a real sheet -->
  <div style="position:absolute;right:70px;bottom:76px;width:420px;
    border:1px solid ${alpha(cy, 0.42)};font-family:${FONT.mono};font-weight:600;font-size:12.5px;
    letter-spacing:0.14em;text-transform:uppercase;color:${alpha(cy, 0.92)};">
    ${[['Scale', '1 : 18'], ['Projection', 'First angle'], ['Redline', car.specs[3].v + ' rpm'],
       ['0–60 mph', car.specs[4].v + ' s'], ['Drawn', car.year]]
      .map(([k, v], i) => `
      <div style="display:flex;justify-content:space-between;padding:9px 14px;
        ${i ? `border-top:1px solid ${alpha(cy, 0.24)};` : ''}">
        <span>${k}</span><span style="color:#EAF6FF;">${v}</span></div>`).join('')}
  </div>

  <div style="position:absolute;left:70px;bottom:80px;width:420px;">
    <div style="font-family:${FONT.archivo};font-weight:900;font-size:84px;line-height:.86;
      letter-spacing:-.05em;color:${cy};">${car.specs[5].v}</div>
    <div style="margin-top:12px;font-family:${FONT.mono};font-weight:600;font-size:12.5px;letter-spacing:0.18em;
      text-transform:uppercase;color:${alpha('#EAF6FF', 0.92)};">
      ${car.specs[5].k} · ${car.specs[5].u}</div>
  </div>

  ${grainLight(0.06)}`;
}
