/**
 * Manufacturer marks, hand-authored as SVG.
 *
 * Geometric marks (Toyota's ellipses, the BMW roundel, the Mercedes star,
 * Tesla's T) are reconstructed as paths. Marks that are script or heraldic
 * and don't reduce cleanly — the Ford script, the Porsche crest — are set as
 * typographic wordmarks instead, which suits an editorial poster anyway.
 *
 * See NOTICE.md: these are unlicensed reproductions of registered trademarks,
 * for mockup use only.
 */
import { FONT } from '../theme/tokens.js';

/** `mono` overrides every colour in a mark, for placing it on a dark field. */
const svg = (vb, body, h, style = '') =>
  `<svg viewBox="${vb}" height="${h}" style="display:block;overflow:visible;${style}"
     xmlns="http://www.w3.org/2000/svg" fill="none">${body}</svg>`;

export const BRANDS = {
  toyota: {
    name: 'Toyota', color: '#EB0A1E',
    wordmark: { font: FONT.archivo, weight: 300, track: 0.44 },
    mark: (h, c) => svg('0 0 122 84', `
      <g stroke="${c || '#111'}" stroke-width="7" fill="none">
        <ellipse cx="61" cy="42" rx="57" ry="38"/>
        <ellipse cx="61" cy="49" rx="17" ry="29"/>
        <ellipse cx="61" cy="26" rx="40" ry="12.5"/>
      </g>`, h),
  },

  jeep: {
    name: 'Jeep', color: '#E01A2B',
    wordmark: { font: FONT.archivo, weight: 900, track: -0.035 },
    mark: (h, c) => svg('0 0 172 62', `
      <rect x="1.5" y="1.5" width="169" height="59" rx="8" stroke="${c || '#111'}" stroke-width="3"/>
      ${Array.from({ length: 7 }, (_, i) =>
        `<rect x="${13 + i * 21.5}" y="12" width="12" height="38" rx="6" fill="${c || '#111'}"/>`).join('')}`, h),
  },

  bmw: {
    name: 'BMW', color: '#0066B1',
    wordmark: { font: FONT.archivo, weight: 700, track: 0.12 },
    mark: (h, c) => svg('0 0 100 100', `
      <circle cx="50" cy="50" r="49" fill="${c || '#101418'}"/>
      <path d="M50 50 L50 12 A38 38 0 0 1 88 50 Z" fill="${c ? 'none' : '#0066B1'}" opacity="${c ? 0 : 1}"/>
      <path d="M50 50 L50 88 A38 38 0 0 1 12 50 Z" fill="${c ? 'none' : '#0066B1'}" opacity="${c ? 0 : 1}"/>
      <path d="M50 50 L12 50 A38 38 0 0 1 50 12 Z" fill="${c ? '#FFF' : '#FFF'}" opacity="${c ? 0.9 : 1}"/>
      <path d="M50 50 L88 50 A38 38 0 0 1 50 88 Z" fill="#FFF" opacity="${c ? 0.9 : 1}"/>
      <circle cx="50" cy="50" r="38" stroke="${c || '#101418'}" stroke-width="3" fill="none"/>`, h),
  },

  mercedes: {
    name: 'Mercedes-Benz', color: '#111417',
    wordmark: { font: FONT.archivo, weight: 400, track: 0.3 },
    mark: (h, c) => svg('0 0 100 100', `
      <g stroke="${c || '#111417'}" stroke-width="5.5" fill="none" stroke-linecap="round">
        <circle cx="50" cy="50" r="46"/>
        <path d="M50 50 L50 5 M50 50 L11 72 M50 50 L89 72"/>
      </g>`, h),
  },

  porsche: {
    name: 'Porsche', color: '#B12B28',
    wordmark: { font: FONT.archivo, weight: 500, track: 0.3 },
    mark: (h, c) => svg('0 0 300 46', `
      <text x="150" y="35" text-anchor="middle" font-family="${FONT.archivo}" font-weight="500"
            font-size="38" letter-spacing="9" fill="${c || '#111'}">PORSCHE</text>`, h),
  },

  ford: {
    name: 'Ford', color: '#1B3D8F',
    wordmark: { font: FONT.script, weight: 400, track: 0 },
    mark: (h, c) => svg('0 0 210 88', `
      <ellipse cx="105" cy="44" rx="103" ry="42" fill="${c || '#1B3D8F'}"/>
      <ellipse cx="105" cy="44" rx="95" ry="35" stroke="${c ? '#000' : '#FFF'}"
               stroke-opacity="${c ? 0.25 : 0.85}" stroke-width="1.6" fill="none"/>
      <text x="105" y="62" text-anchor="middle" font-family="${FONT.script}"
            font-size="58" fill="${c ? '#000' : '#FFF'}" fill-opacity="${c ? 0.9 : 1}">Ford</text>`, h),
  },

  landrover: {
    name: 'Land Rover', color: '#005A2B',
    wordmark: { font: FONT.archivo, weight: 600, track: 0.24 },
    mark: (h, c) => svg('0 0 230 62', `
      <ellipse cx="115" cy="31" rx="113" ry="29" fill="${c || '#005A2B'}"/>
      <ellipse cx="115" cy="31" rx="105" ry="22.5" stroke="${c ? '#000' : '#FFF'}"
               stroke-opacity="${c ? 0.25 : 0.8}" stroke-width="1.4" fill="none"/>
      <text x="115" y="39" text-anchor="middle" font-family="${FONT.archivo}" font-weight="600"
            font-size="21" letter-spacing="3.4" fill="${c ? '#000' : '#FFF'}"
            fill-opacity="${c ? 0.9 : 1}">LAND ROVER</text>`, h),
  },

  tesla: {
    name: 'Tesla', color: '#CC0000',
    wordmark: { font: FONT.archivo, weight: 500, track: 0.34 },
    mark: (h, c) => svg('0 0 104 124', `
      <path fill="${c || '#111'}" d="M2 3 C19 14 36 20 42 21 L45 10 L59 10 L62 21
        C68 20 85 14 102 3 L102 17 C83 29 66 33 60 34 L60 122 L44 122 L44 34
        C38 33 21 29 2 17 Z"/>`, h),
  },

  honda: {
    name: 'Honda', color: '#CC0000',
    wordmark: { font: FONT.archivo, weight: 700, track: 0.1 },
    mark: (h, c) => svg('0 0 128 96', `
      <rect x="3" y="3" width="122" height="90" rx="16" stroke="${c || '#111'}" stroke-width="6.5" fill="none"/>
      <path fill="${c || '#111'}" d="M22 20 L48 20 L45 42 L83 42 L80 20 L106 20 L106 76
        L80 76 L83 54 L45 54 L48 76 L22 76 Z"/>`, h),
  },

  hyundai: {
    name: 'Hyundai', color: '#002C5F',
    wordmark: { font: FONT.archivo, weight: 500, track: 0.28 },
    mark: (h, c) => svg('0 0 148 84', `
      <ellipse cx="74" cy="42" rx="71" ry="39" stroke="${c || '#002C5F'}" stroke-width="5" fill="none"/>
      <g transform="skewX(-14) translate(11 0)">
        <path fill="${c || '#002C5F'}" d="M38 62 L52 20 L68 20 L61 40 L86 40 L93 20 L109 20
          L95 62 L79 62 L86 46 L61 46 L54 62 Z"/>
      </g>`, h),
  },
};

/** Type-set brand name, for the layouts that lead with a wordmark. */
export function wordmark(brandKey, { size = 64, color = '#111', weight, track } = {}) {
  const b = BRANDS[brandKey];
  const w = b.wordmark;
  return `<span style="font-family:${w.font};font-weight:${weight ?? w.weight};
    font-size:${size}px;letter-spacing:${track ?? w.track}em;color:${color};
    line-height:.92;display:inline-block;white-space:nowrap;">${b.name}</span>`;
}

export const brandMark = (key, h, color) => BRANDS[key].mark(h, color);
