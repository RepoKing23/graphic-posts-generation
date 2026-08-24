/**
 * Renders every poster in src/data/cars.js to out/<id>-<slug>.png.
 *
 * The poster is the source artefact: the social posts in src/posts.mjs are all
 * derived from it. Each render is verified at exactly 1080x1350 — a layout
 * that overflows the stage is a bug, and a silent off-size PNG is worse than
 * a loud failure.
 */
import path from 'node:path';
import { CARS } from './data/cars.js';
import { POSTER_CANVAS } from './data/platforms.js';
import { openStudio } from './studio.mjs';
import { buildGallery } from './gallery.mjs';
import { ROOT, OUT } from './paths.mjs';

/** Load the layout module for each car once. */
export async function layoutsFor(cars) {
  const layouts = {};
  for (const c of cars) {
    if (!layouts[c.layout]) {
      layouts[c.layout] = (await import(`./layouts/${c.layout}.js`)).default;
    }
  }
  return layouts;
}

/** Render posters with an already-open studio — the social pipeline reuses this. */
export async function renderPosters(studio, cars) {
  const layouts = await layoutsFor(cars);
  const written = [];
  for (const car of cars) {
    const file = path.join(OUT, `${car.id}-${car.slug}.png`);
    const { w, h } = await studio.shoot(layouts[car.layout](car), POSTER_CANVAS, file, car.id);
    console.log(`  ${car.id}  ${car.layout.padEnd(11)} ${path.basename(file)}  ${w}x${h}`);
    written.push({ car, file: path.basename(file) });
  }
  return written;
}

export function selectCars(argv) {
  const only = argv.filter((a) => !a.startsWith('-'));
  const cars = only.length
    ? CARS.filter((c) => only.includes(c.id) || only.includes(c.layout))
    : CARS;
  if (!cars.length) throw new Error(`no posters matched: ${only.join(', ')}`);
  return cars;
}

async function main() {
  const cars = selectCars(process.argv.slice(2));
  const studio = await openStudio(ROOT);
  try {
    const written = await renderPosters(studio, cars);
    await buildGallery(written, OUT);
    console.log(`\n${written.length} poster(s) -> out/  (contact sheet: out/index.html)`);
  } finally {
    await studio.close();
  }
}

// Only run when invoked directly; src/posts.mjs imports the helpers above.
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
