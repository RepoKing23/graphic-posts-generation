/**
 * Reusable graphic devices.
 *
 * These are the structural motifs the posters are built from — the things
 * that give each layout a spine. Kept here so no layout reinvents a halftone.
 */
import { alpha } from './tokens.js';

/** Concentric ring field. The Jeep poster's engine, and a good corner-filler. */
export function rings({ cx = 0, cy = 0, from = 60, to = 620, step = 9, color = '#fff',
                        width = 1.4, opacity = 0.9, arc = null } = {}) {
  const r = [];
  for (let x = from; x <= to; x += step) r.push(x);
  const shape = (rad) => arc
    ? `<path d="M ${cx + rad} ${cy} A ${rad} ${rad} 0 0 ${arc.sweep ?? 1} ${cx + rad * Math.cos(arc.end)} ${cy + rad * Math.sin(arc.end)}"
         fill="none" stroke="${color}" stroke-width="${width}"/>`
    : `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
  return `<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:${opacity};overflow:visible"
    viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">${r.map(shape).join('')}</svg>`;
}

/** Column of small x marks — the Jeep reference's side rhythm. */
export function xColumn({ x = 60, y = 400, count = 8, gap = 46, size = 9, color = '#E01A2B', width = 2.6 } = {}) {
  const marks = Array.from({ length: count }, (_, i) => {
    const cy = y + i * gap;
    return `<path d="M ${x - size} ${cy - size} L ${x + size} ${cy + size} M ${x + size} ${cy - size} L ${x - size} ${cy + size}"
      stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
  }).join('');
  return `<svg style="position:absolute;inset:0;width:100%;height:100%;overflow:visible"
    viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">${marks}</svg>`;
}

/** Halftone dot screen, rotated like a real separation. Coarse on purpose. */
export function halftone({ color = '#111', pitch = 13, dot = 4.4, angle = 15, opacity = 1 } = {}) {
  const tile =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${pitch}" height="${pitch}">
      <circle cx="${pitch / 2}" cy="${pitch / 2}" r="${dot}" fill="${color}"/></svg>`;
  return `background-image:url('data:image/svg+xml;utf8,${encodeURIComponent(tile)}');
          background-size:${pitch}px ${pitch}px;opacity:${opacity};
          transform:rotate(${angle}deg) scale(1.6);transform-origin:center;`;
}

/** Engineering dimension line with arrowheads and a gap for the label. */
export function dimension({ x1, y1, x2, y2, label, color = '#7FD4FF', size = 13, font = "'IBM Plex Mono',monospace" }) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const vertical = Math.abs(y2 - y1) > Math.abs(x2 - x1);
  const gap = vertical ? 26 : (String(label).length * size * 0.34);
  const head = (x, y, dir) => vertical
    ? `<path d="M ${x} ${y} l -5 ${dir * 11} M ${x} ${y} l 5 ${dir * 11}" stroke="${color}" stroke-width="1.6" fill="none"/>`
    : `<path d="M ${x} ${y} l ${dir * 11} -5 M ${x} ${y} l ${dir * 11} 5" stroke="${color}" stroke-width="1.6" fill="none"/>`;
  const seg = vertical
    ? `<path d="M ${x1} ${y1} L ${mx} ${my - gap} M ${mx} ${my + gap} L ${x2} ${y2}" stroke="${color}" stroke-width="1.2"/>`
    : `<path d="M ${x1} ${y1} L ${mx - gap} ${my} M ${mx + gap} ${my} L ${x2} ${y2}" stroke="${color}" stroke-width="1.2"/>`;
  return `${seg}${head(x1, y1, 1)}${head(x2, y2, -1)}
    <text x="${mx}" y="${my + (vertical ? 5 : 4.5)}" text-anchor="middle" font-family="${font}"
      font-size="${size}" letter-spacing="1.2" fill="${color}">${label}</text>`;
}

/** Leader line from a callout to a point on the drawing. */
export function leader({ x1, y1, x2, y2, color = '#7FD4FF' }) {
  return `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="${color}" stroke-width="1.1" fill="none"/>
          <circle cx="${x2}" cy="${y2}" r="3.2" fill="${color}"/>`;
}

/** Graph-paper grid for the blueprint poster. */
export function graphPaper({ minor = 26, major = 130, color = '#7FD4FF', opacity = 0.16 } = {}) {
  const tile =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${major}" height="${major}">
      <g stroke="${color}" fill="none">
        ${Array.from({ length: major / minor }, (_, i) => `
          <path d="M ${i * minor} 0 V ${major} M 0 ${i * minor} H ${major}" stroke-width=".5" opacity=".55"/>`).join('')}
        <path d="M 0 0 V ${major} M 0 0 H ${major}" stroke-width="1"/>
      </g></svg>`;
  return `background-image:url('data:image/svg+xml;utf8,${encodeURIComponent(tile)}');
          background-size:${major}px ${major}px;opacity:${opacity};`;
}

/** Long-exposure light bands sweeping across the frame. */
export function streaks({ color = '#E8552D', count = 14, seed = 7 } = {}) {
  // Deterministic pseudo-random so renders stay byte-stable between runs.
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const bands = Array.from({ length: count }, () => {
    const y = rnd() * 1350, h = 2 + rnd() * 9, w = 260 + rnd() * 820, x = rnd() * 400 - 180;
    const o = 0.10 + rnd() * 0.5;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="url(#sk)" opacity="${o}"/>`;
  }).join('');
  return `<svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 1080 1350"
    xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="sk" x1="0" x2="1">
      <stop offset="0" stop-color="${color}" stop-opacity="0"/>
      <stop offset=".45" stop-color="${color}"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>${bands}</svg>`;
}

/** Studio sweep: the cyclorama gradient a car gets photographed against. */
export function sweep({ top = '#F3F1EC', bottom = '#D6D2C7', floor = 0.62, glow = null } = {}) {
  return `<div style="position:absolute;inset:0;
    background:linear-gradient(${top} 0%, ${top} ${floor * 60}%, ${bottom} 100%);"></div>
    ${glow ? `<div style="position:absolute;inset:0;
      background:radial-gradient(58% 42% at 50% ${floor * 100}%, ${glow} 0%, transparent 70%);"></div>` : ''}`;
}

/** Barcode for the ticket poster. Deterministic widths. */
export function barcode({ width = 300, height = 64, color = '#111', seed = 3 } = {}) {
  let s = seed, x = 0;
  const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const bars = [];
  while (x < width - 4) {
    const w = 1.5 + Math.round(rnd() * 3) * 1.6;
    if (rnd() > 0.34) bars.push(`<rect x="${x}" y="0" width="${w}" height="${height}" fill="${color}"/>`);
    x += w + 1.6 + Math.round(rnd() * 2) * 1.2;
  }
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
    xmlns="http://www.w3.org/2000/svg" style="display:block">${bars.join('')}</svg>`;
}

/** Perforated edge — a row of punched holes for the ticket poster. */
export function perforation({ vertical = false, length = 1080, pitch = 22, r = 5, color = '#0E0E0C' } = {}) {
  const n = Math.floor(length / pitch);
  const holes = Array.from({ length: n }, (_, i) => {
    const p = pitch / 2 + i * pitch;
    return `<circle cx="${vertical ? r : p}" cy="${vertical ? p : r}" r="${r}" fill="${color}"/>`;
  }).join('');
  return `<svg width="${vertical ? r * 2 : length}" height="${vertical ? length : r * 2}"
    xmlns="http://www.w3.org/2000/svg" style="display:block">${holes}</svg>`;
}

/** Layered paper massif — the sculpted mountain in the Corolla reference. */
export function massif({ color = '#D6D2C7', shade = '#B8B2A4', x = 0, y = 0, w = 1080, h = 620 } = {}) {
  return `<svg style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px"
    viewBox="0 0 1080 620" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 0 620 L 250 214 L 372 342 L 470 168 L 596 620 Z" fill="${shade}"/>
    <path d="M 250 214 L 372 342 L 300 620 L 148 620 Z" fill="${color}"/>
    <path d="M 470 168 L 596 620 L 470 620 L 420 300 Z" fill="${alpha('#000', 0.06)}"/>
    <path d="M 470 168 L 540 262 L 500 300 L 452 236 Z" fill="#FBFAF7" opacity=".85"/>
    <path d="M 250 214 L 296 278 L 262 306 L 224 250 Z" fill="#FBFAF7" opacity=".7"/>
    <path d="M 560 620 L 760 380 L 880 500 L 980 420 L 1080 620 Z" fill="${shade}" opacity=".55"/>
  </svg>`;
}
