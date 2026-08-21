/** Spec typography, shared across layouts so no two posters invent it twice. */
import { FONT, alpha } from './tokens.js';

/** Horizontal ledger — specs as columns under a hairline. The engineering
 *  footer that turns a car picture into a spec sheet. */
export function specLedger(specs, {
  color = '#0E0E0C', muted = null, accent = '#0E0E0C',
  valueSize = 40, labelSize = 10, unitSize = 10.5, gap = 0, rule = true,
} = {}) {
  const mut = muted || alpha(color, 0.52);
  const cols = specs.map((s, i) => `
    <div style="flex:1;min-width:0;padding:${rule ? '16px' : '0'} ${gap / 2}px 0;
      ${i ? `border-left:1px solid ${alpha(color, 0.16)};padding-left:18px;` : ''}">
      <div style="font-family:${FONT.mono};font-size:${labelSize}px;font-weight:500;
        letter-spacing:.24em;text-transform:uppercase;color:${mut};margin-bottom:9px;">${s.k}</div>
      <div style="font-family:${FONT.archivo};font-weight:800;letter-spacing:-.035em;
        line-height:.9;color:${color};white-space:nowrap;
        font-size:${String(s.v).length > 4 ? Math.round(valueSize * 0.6) : valueSize}px;">${s.v}</div>
      <div style="font-family:${FONT.mono};font-size:${unitSize}px;letter-spacing:.06em;
        color:${mut};margin-top:7px;">${s.u}</div>
    </div>`).join('');
  return `<div>
    ${rule ? `<div style="height:2px;background:${accent};"></div>` : ''}
    <div style="display:flex;align-items:flex-start;">${cols}</div>
  </div>`;
}

/** Vertical table — label left, dotted leader, value right. Reads as a
 *  data sheet rather than a feature list. */
export function specTable(specs, {
  color = '#0E0E0C', muted = null, accent = null,
  labelSize = 12, valueSize = 21, rowGap = 15,
} = {}) {
  const mut = muted || alpha(color, 0.55);
  return `<div style="display:flex;flex-direction:column;gap:${rowGap}px;">
    ${specs.map((s) => `
      <div style="display:flex;align-items:baseline;gap:10px;">
        <span style="font-family:${FONT.mono};font-size:${labelSize}px;font-weight:500;
          letter-spacing:.2em;text-transform:uppercase;color:${mut};white-space:nowrap;">${s.k}</span>
        <span style="flex:1;height:1px;background:
          repeating-linear-gradient(90deg,${alpha(color, 0.34)} 0 2px,transparent 2px 7px);
          transform:translateY(-3px);"></span>
        <span style="font-family:${FONT.archivo};font-size:${valueSize}px;font-weight:700;
          letter-spacing:-.02em;color:${accent || color};white-space:nowrap;">${s.v}</span>
        <span style="font-family:${FONT.mono};font-size:${labelSize}px;color:${mut};
          white-space:nowrap;">${s.u}</span>
      </div>`).join('')}
  </div>`;
}

/** One statistic at poster scale — the hero numeral. */
export function bigNumber(spec, {
  color = '#0E0E0C', muted = null, size = 190, font = FONT.archivo, weight = 900, align = 'left',
} = {}) {
  const mut = muted || alpha(color, 0.5);
  return `<div style="text-align:${align};">
    <div style="font-family:${font};font-weight:${weight};font-size:${size}px;
      letter-spacing:-.055em;line-height:.82;color:${color};">${spec.v}</div>
    <div style="font-family:${FONT.mono};font-size:${Math.max(11, size * 0.075)}px;
      letter-spacing:.22em;text-transform:uppercase;color:${mut};margin-top:12px;">
      ${spec.k} · ${spec.u}</div>
  </div>`;
}

/** Small caps label with a leading accent tick. */
export function tag(text, { color = '#0E0E0C', accent = null, size = 11.5, track = 0.3 } = {}) {
  return `<span style="display:inline-flex;align-items:center;gap:10px;
    font-family:${FONT.mono};font-size:${size}px;font-weight:600;letter-spacing:${track}em;
    text-transform:uppercase;color:${color};">
    ${accent ? `<span style="width:20px;height:2px;background:${accent};display:block;"></span>` : ''}
    ${text}</span>`;
}
