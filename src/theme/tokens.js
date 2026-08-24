/**
 * Design tokens shared by every layout.
 *
 * House rules, encoded here so they hold across all ten posters:
 *   - ONE accent colour per poster. Everything else lives on a neutral ramp.
 *   - Neutrals are warm or cool *greys with a cast*, never #888. Flat neutral
 *     grey plus a saturated gradient is the tell of a generated design.
 *   - No purple->cyan gradients, no glassmorphism, no uniform border-radius.
 *   - Hairline rules instead of boxes; grain over everything.
 */

export const CANVAS = { w: 1080, h: 1350 };

/** Warm paper / concrete ramp — the "daylight studio" family. */
export const PAPER = {
  0: '#FBFAF7',
  1: '#F3F1EC',
  2: '#E7E4DC',
  3: '#D6D2C7',
  4: '#B8B2A4',
  5: '#8E8878',
  6: '#5C5749',
  7: '#33302A',
};

/** Cool gunmetal ramp — the "night studio" family. */
export const STEEL = {
  0: '#F2F4F6',
  1: '#D8DDE2',
  2: '#A6AEB7',
  3: '#6E7883',
  4: '#454E58',
  5: '#2A313A',
  6: '#171C22',
  7: '#0B0E12',
};

export const INK = '#0E0E0C';

/** Type stacks. Display face + a technical face for spec data — the pairing
 *  that makes a spec sheet read as engineering rather than marketing. */
export const FONT = {
  archivo: "'Archivo', sans-serif",
  anton: "'Anton', sans-serif",
  bebas: "'Bebas Neue', sans-serif",
  grotesk: "'Space Grotesk', sans-serif",
  mono: "'IBM Plex Mono', monospace",
  condensed: "'Barlow Condensed', sans-serif",
  serif: "'Instrument Serif', serif",
  syne: "'Syne', sans-serif",
  oswald: "'Oswald', sans-serif",
  script: "'Allura', cursive",
  tight: "'Inter Tight', sans-serif",
};

/** Print grain. A single turbulence tile at low opacity over the whole stage —
 *  cheap, and it does more to kill the "flat vector" look than anything else. */
export function grain(opacity = 0.055, scale = 0.9) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">` +
    `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="${scale}" numOctaves="4" stitchTiles="stitch"/>` +
    `<feColorMatrix type="saturate" values="0"/></filter>` +
    `<rect width="200" height="200" filter="url(#n)"/></svg>`;
  return `<div class="grain" style="
    position:absolute;inset:0;pointer-events:none;z-index:900;
    background-image:url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}');
    background-size:200px 200px;opacity:${opacity};mix-blend-mode:multiply;"></div>`;
}

/** Same idea but additive, for dark posters where multiply would vanish. */
export function grainLight(opacity = 0.07, scale = 0.9) {
  return grain(opacity, scale).replace('mix-blend-mode:multiply', 'mix-blend-mode:overlay');
}

/** Small tracked caps — the workhorse label style across the set. */
export function eyebrow(text, { color = INK, size = 13, track = 0.42, weight = 600, font = FONT.mono } = {}) {
  return `<span style="font-family:${font};font-size:${size}px;font-weight:${weight};
    letter-spacing:${track}em;text-transform:uppercase;color:${color};display:inline-block;">${text}</span>`;
}

/** Hairline. Never a 1px #ddd box — a real rule at a real weight. */
export function rule(color, { w = '100%', h = 1, opacity = 1 } = {}) {
  return `<div style="width:${w};height:${h}px;background:${color};opacity:${opacity};"></div>`;
}

/** Mix a hex toward another hex. Used to derive tints from a brand colour
 *  instead of reaching for a second saturated hue. */
/** Accepts #rgb or #rrggbb — shorthand silently produced NaN channels before. */
function channels(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) throw new Error(`bad hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

export function mix(a, b, t) {
  const [r1, g1, b1] = channels(a), [r2, g2, b2] = channels(b);
  const c = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

/** Perceived lightness of a colour, 0..1 — sRGB coefficients, no gamma step,
 *  which is accurate enough to decide black type or white on an accent. */
export function luminance(hex) {
  const [r, g, b] = channels(hex).map((c) => c / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Type colour for a field of `hex`. The set's accents run from #7FD4FF to
 *  #005A2B, so no single answer works and every layout that fills with an
 *  accent asks this instead of guessing. */
export const onColor = (hex, dark = INK, light = '#FFFFFF') =>
  (luminance(hex) > 0.55 ? dark : light);

export const alpha = (hex, a) => {
  const [r, g, b] = channels(hex);
  return `rgba(${r},${g},${b},${a})`;
};
