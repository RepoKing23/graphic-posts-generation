/**
 * Texture resolver and treatments.
 *
 * Same contract as src/photo.js: return an <img> when the file exists,
 * otherwise nothing — every caller supplies a procedural fallback from
 * src/theme/motifs.js, so a poster is never broken by a missing texture.
 *
 * The treatments matter as much as the resolver. Stock photography dropped in
 * raw wrecks the one-accent-per-poster rule the whole set is built on: it
 * arrives with its own colour cast, its own contrast, and its own idea of
 * where the eye should go. Everything here exists to beat a photograph into
 * the poster's palette rather than let it import a second one.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEXTURES } from './data/textures.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'assets', 'textures');
const EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

/** Server-relative url, or null. The renderer serves the repo over loopback. */
export function textureOf(id) {
  for (const e of EXTS) {
    if (existsSync(path.join(DIR, id + e))) return `/assets/textures/${id}${e}`;
  }
  return null;
}

export const hasTexture = (id) => Boolean(textureOf(id));

/** Which textures are present — the gallery reports coverage from this. */
export const textureCoverage = () =>
  Object.keys(TEXTURES).map((id) => ({ id, present: hasTexture(id) }));

/**
 * A texture as a positioned layer.
 *
 * @param {string} id
 * @param {object} o
 *   fit/position  object-fit and object-position
 *   grade         {contrast, brightness, saturate, blur} — pushes the photo
 *                 toward the poster's palette before any tint is applied
 *   tint          {colour, mode, opacity} — a flat wash in the poster's accent;
 *                 'multiply' on paper grounds, 'screen'/'overlay' on dark ones
 *   duotone       {shadow, highlight} — full two-colour separation
 *   opacity/blend of the layer itself
 * @returns {string} HTML, or '' when the file is absent
 */
export function texture(id, {
  fit = 'cover', position = 'center', opacity = 1, blend = null,
  grade = null, tint = null, duotone = null, style = '',
} = {}) {
  const src = textureOf(id);
  if (!src) return '';

  const filters = [];
  if (duotone) filters.push('grayscale(1)');
  if (grade) {
    if (grade.contrast != null) filters.push(`contrast(${grade.contrast})`);
    if (grade.brightness != null) filters.push(`brightness(${grade.brightness})`);
    if (grade.saturate != null) filters.push(`saturate(${grade.saturate})`);
    if (grade.blur != null) filters.push(`blur(${grade.blur}px)`);
  }

  // Duotone: greyscale plate, shadow colour multiplied in, highlight screened
  // back on top. Two stacked blends, which is what a real duotone separation is.
  const layers = duotone
    ? `<div style="position:absolute;inset:0;background:${duotone.shadow};mix-blend-mode:lighten;"></div>
       <div style="position:absolute;inset:0;background:${duotone.highlight};mix-blend-mode:multiply;"></div>`
    : tint
      ? `<div style="position:absolute;inset:0;background:${tint.colour};
           mix-blend-mode:${tint.mode || 'multiply'};opacity:${tint.opacity ?? 1};"></div>`
      : '';

  return `<div style="position:absolute;inset:0;overflow:hidden;opacity:${opacity};
      ${blend ? `mix-blend-mode:${blend};` : ''}${style}">
    <img src="${src}" alt="" style="width:100%;height:100%;object-fit:${fit};
      object-position:${position};display:block;
      ${filters.length ? `filter:${filters.join(' ')};` : ''}"/>
    ${layers}
  </div>`;
}

/**
 * Texture with a guaranteed backdrop: the procedural fallback renders when the
 * file is missing, so callers stay a single expression.
 * @param {string} id
 * @param {string} fallback  HTML to use instead — usually from theme/motifs.js
 */
export const textureOr = (id, fallback, opts) =>
  hasTexture(id) ? texture(id, opts) : fallback;
