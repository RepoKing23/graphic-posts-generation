/**
 * Image resolver.
 *
 * Two slots, because the two jobs are genuinely different:
 *
 *   assets/cars/<slug>.jpg         a rectangular photograph — fills panels,
 *                                  bands and full-bleed backgrounds.
 *   assets/cars/<slug>-cutout.png  a transparent cut-out — the hero car that
 *                                  floats free on the page.
 *
 * A stock search gives you the first; only a cut-out gives you the second, so
 * a hero slot with no cut-out falls back to that car's own drawing (see
 * theme/carart.js) rather than dropping a rectangle with its own background
 * into the middle of the poster.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { carSVG } from './theme/carart.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CARS_DIR = path.join(ROOT, 'assets', 'cars');

// Returns a server-relative url, not a file path: the renderer serves the
// repo over loopback so that fonts and images load under a normal origin.
const find = (base, exts) => {
  for (const e of exts) {
    if (existsSync(path.join(CARS_DIR, base + e))) return `/assets/cars/${base}${e}`;
  }
  return null;
};

export const photoOf = (slug) => find(slug, ['.jpg', '.jpeg', '.png', '.webp']);
export const cutoutOf = (slug) => find(`${slug}-cutout`, ['.png', '.webp']);

/**
 * Rectangular photo slot. Returns an <img> when a photograph is available,
 * otherwise a designed studio plate carrying the silhouette — so the panel is
 * never an empty grey box.
 * @param {object} car
 * @param {object} o
 *   fit/position  object-fit and object-position for the photograph
 *   crop          {scale,x,y} — zooms the fallback silhouette so a panel shows
 *                 one region (nose, wheel, tail) rather than the whole car,
 *                 mirroring what object-position does to a photograph
 *   plate/body    fallback background and car colour
 */
export function photoPanel(car, {
  fit = 'cover', position = 'center', filter = '', style = '',
  plate = 'linear-gradient(160deg,#E7E4DC,#B8B2A4)', body = '#22242A', sheen = null,
  crop = null,
} = {}) {
  const src = photoOf(car.slug);
  if (src) {
    return `<img src="${src}" style="width:100%;height:100%;object-fit:${fit};
      object-position:${position};display:block;${filter ? `filter:${filter};` : ''}${style}"/>`;
  }
  const zoom = crop
    ? `transform:scale(${crop.scale}) translate(${crop.x || 0}%, ${crop.y || 0}%);`
    : '';
  return `<div style="width:100%;height:100%;position:relative;background:${plate};
      display:flex;align-items:center;justify-content:center;overflow:hidden;${style}">
    <div style="position:absolute;inset:0;
      background:radial-gradient(62% 46% at 50% 62%, rgba(255,255,255,.55), transparent 70%);"></div>
    ${carSVG(car.slug, { fallback: car.profile, fill: body, sheen, shadow: !crop,
      style: `width:${crop ? '100%' : '126%'};position:relative;${zoom}` })}
  </div>`;
}

/**
 * Free-floating hero car. Uses a transparent cut-out when one exists, and the
 * car's own drawing otherwise. Drawing options pass straight through to carSVG.
 */
export function heroCar(car, { style = '', filter = '', ...silhouette } = {}) {
  const src = cutoutOf(car.slug);
  if (src) {
    return `<img src="${src}" style="width:100%;display:block;
      ${filter ? `filter:${filter};` : ''}${style}"/>`;
  }
  return carSVG(car.slug, { fallback: car.profile, ...silhouette, style: `width:100%;display:block;${style}` });
}

/** Did this car get real photography? Used by the gallery to report coverage. */
export const photoStatus = (car) => ({
  photo: Boolean(photoOf(car.slug)),
  cutout: Boolean(cutoutOf(car.slug)),
});
