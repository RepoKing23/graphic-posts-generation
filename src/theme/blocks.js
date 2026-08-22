/**
 * Spec typography, shared across layouts so no two posters invent it twice.
 *
 * Legibility floor
 * ----------------
 * These posters are 1080x1350 but they are read at a few hundred pixels wide
 * in a feed. Anything under about 12px, tracked wide, at half opacity is
 * decoration rather than information — the unit strings ("hp @ 6500 rpm",
 * "L supercharged V8") were exactly that. So the floors below are enforced
 * here rather than trusted to each call site:
 *
 *   LABEL_MIN  12px   tracked caps keys — POWER, TORQUE
 *   UNIT_MIN   12.5px unit strings under a figure
 *   MUTED_MIN  0.74   alpha for anything set against its own background
 *
 * Tracking comes down as size comes down, too: 0.24em on 9.5px mono is what
 * turned "L HEMI V8" into a row of unrelated glyphs.
 */
import { FONT, alpha } from './tokens.js';

const LABEL_MIN = 12;
const UNIT_MIN = 12.5;
const MUTED_MIN = 0.74;

/** Clamp a caller's muted colour up to the legibility floor. */
const muteOf = (color, muted, floor = MUTED_MIN) => muted || alpha(color, floor);

/** Horizontal ledger — specs as columns under a hairline. The engineering
 *  footer that turns a car picture into a spec sheet. */
export function specLedger(specs, {
  color = '#0E0E0C', muted = null, accent = '#0E0E0C',
  valueSize = 40, labelSize = LABEL_MIN, unitSize = UNIT_MIN, gap = 0, rule = true,
} = {}) {
  const mut = muteOf(color, muted);
  const lab = Math.max(LABEL_MIN, labelSize);
  const uni = Math.max(UNIT_MIN, unitSize);
  const cols = specs.map((s, i) => `
    <div style="flex:1;min-width:0;padding:${rule ? '16px' : '0'} ${gap / 2}px 0;
      ${i ? `border-left:1px solid ${alpha(color, 0.2)};padding-left:18px;` : ''}">
      <div style="font-family:${FONT.mono};font-size:${lab}px;font-weight:600;
        letter-spacing:.15em;text-transform:uppercase;color:${mut};margin-bottom:9px;">${s.k}</div>
      <div style="font-family:${FONT.archivo};font-weight:800;letter-spacing:-.035em;
        line-height:.9;color:${color};white-space:nowrap;
        font-size:${String(s.v).length > 4 ? Math.round(valueSize * 0.6) : valueSize}px;">${s.v}</div>
      <div style="font-family:${FONT.mono};font-size:${uni}px;font-weight:500;letter-spacing:.02em;
        color:${mut};margin-top:8px;">${s.u}</div>
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
  labelSize = 13, valueSize = 21, rowGap = 15,
} = {}) {
  const mut = muteOf(color, muted, 0.78);
  const lab = Math.max(LABEL_MIN, labelSize);
  return `<div style="display:flex;flex-direction:column;gap:${rowGap}px;">
    ${specs.map((s) => `
      <div style="display:flex;align-items:baseline;gap:10px;">
        <span style="font-family:${FONT.mono};font-size:${lab}px;font-weight:600;
          letter-spacing:.14em;text-transform:uppercase;color:${mut};white-space:nowrap;">${s.k}</span>
        <span style="flex:1;height:1px;background:
          repeating-linear-gradient(90deg,${alpha(color, 0.38)} 0 2px,transparent 2px 7px);
          transform:translateY(-3px);"></span>
        <span style="font-family:${FONT.archivo};font-size:${valueSize}px;font-weight:700;
          letter-spacing:-.02em;color:${accent || color};white-space:nowrap;">${s.v}</span>
        <span style="font-family:${FONT.mono};font-size:${Math.max(UNIT_MIN, lab)}px;font-weight:500;
          color:${mut};white-space:nowrap;">${s.u}</span>
      </div>`).join('')}
  </div>`;
}

/** One statistic at poster scale — the hero numeral. */
export function bigNumber(spec, {
  color = '#0E0E0C', muted = null, size = 190, font = FONT.archivo, weight = 900, align = 'left',
} = {}) {
  const mut = muteOf(color, muted, 0.8);
  return `<div style="text-align:${align};">
    <div style="font-family:${font};font-weight:${weight};font-size:${size}px;
      letter-spacing:-.055em;line-height:.82;color:${color};">${spec.v}</div>
    <div style="font-family:${FONT.mono};font-size:${Math.max(13, size * 0.075)}px;font-weight:600;
      letter-spacing:.18em;text-transform:uppercase;color:${mut};margin-top:12px;">
      ${spec.k} · ${spec.u}</div>
  </div>`;
}

/** Small caps label with a leading accent tick. */
export function tag(text, { color = '#0E0E0C', accent = null, size = 12.5, track = 0.26 } = {}) {
  return `<span style="display:inline-flex;align-items:center;gap:10px;
    font-family:${FONT.mono};font-size:${Math.max(12, size)}px;font-weight:600;letter-spacing:${track}em;
    text-transform:uppercase;color:${color};">
    ${accent ? `<span style="width:20px;height:2px;background:${accent};display:block;"></span>` : ''}
    ${text}</span>`;
}

/**
 * A soft scrim behind type that sits over artwork or a busy ground. Cheaper
 * than restating a colour at every call site, and it is what keeps the ledger
 * on the halftone poster off the dot screen.
 */
export function scrim(color, { blur = 26, opacity = 0.9, inset = '-18px -22px' } = {}) {
  return `<div style="position:absolute;inset:${inset};background:${color};
    opacity:${opacity};filter:blur(${blur}px);pointer-events:none;"></div>`;
}
