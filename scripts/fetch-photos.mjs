/**
 * Fetches imagery from Unsplash.
 *
 *   UNSPLASH_ACCESS_KEY=xxxx npm run photos              # textures + car photos
 *   UNSPLASH_ACCESS_KEY=xxxx npm run photos textures     # textures only
 *   UNSPLASH_ACCESS_KEY=xxxx npm run photos 03 07        # those cars only
 *   UNSPLASH_ACCESS_KEY=xxxx npm run photos -- --force   # re-fetch existing
 *
 * Get a free key at https://unsplash.com/oauth/applications.
 *
 * Two destinations:
 *   assets/textures/<id>.jpg   the world the cars sit in — see src/data/textures.js
 *   assets/cars/<slug>.jpg     an optional per-car photograph
 *
 * The hero slot wants a cut-out with a transparent background, which no stock
 * search can give you — save one as assets/cars/<slug>-cutout.png by hand.
 *
 * Search picks the top hit, which is a blunt instrument for art direction.
 * SHOTLIST.md carries hand-picked candidates per slot and is the better route
 * if you care which frame you get; this script is for filling everything fast.
 *
 * Photographer credit is written alongside each set, and every photo's download
 * endpoint is pinged, as the Unsplash API terms require.
 */
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARS } from '../src/data/cars.js';
import { TEXTURES } from '../src/data/textures.js';

// Node's fetch ignores HTTPS_PROXY unless told otherwise; harmless elsewhere.
process.env.NODE_USE_ENV_PROXY ??= '1';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'assets', 'cars');
const TEX_DIR = path.join(ROOT, 'assets', 'textures');
const KEY = process.env.UNSPLASH_ACCESS_KEY;
const API = 'https://api.unsplash.com';

const auth = { Authorization: `Client-ID ${KEY}`, 'Accept-Version': 'v1' };

async function search(query, orientation = 'landscape') {
  const url = `${API}/search/photos?query=${encodeURIComponent(query)}`
            + `&per_page=5&orientation=${orientation}&content_filter=high`;
  const res = await fetch(url, { headers: auth });
  if (res.status === 401) throw new Error('Unsplash rejected the access key (401).');
  if (res.status === 403) throw new Error('Unsplash rate limit reached (403). Try again in an hour.');
  if (!res.ok) throw new Error(`Unsplash search failed: ${res.status}`);
  const { results } = await res.json();
  return results?.[0] || null;
}

/** Download one search hit to `dest`, returning its credit record. */
async function grab(query, dest, orientation) {
  const photo = await search(query, orientation);
  if (!photo) return null;
  const img = await fetch(`${photo.urls.raw}&w=2200&q=82&fm=jpg&fit=max`);
  if (!img.ok) return null;
  await writeFile(dest, Buffer.from(await img.arrayBuffer()));
  if (photo.links?.download_location) {
    await fetch(photo.links.download_location, { headers: auth }).catch(() => {});
  }
  return {
    photographer: photo.user.name,
    profile: `${photo.user.links.html}?utm_source=graphic-posts-generation&utm_medium=referral`,
    photo: photo.links.html,
    query,
  };
}

async function fetchTextures(force) {
  await mkdir(TEX_DIR, { recursive: true });
  const creditsPath = path.join(TEX_DIR, 'credits.json');
  const credits = existsSync(creditsPath) ? JSON.parse(await readFile(creditsPath, 'utf8')) : {};

  for (const [id, t] of Object.entries(TEXTURES)) {
    const dest = path.join(TEX_DIR, `${id}.jpg`);
    if (existsSync(dest) && !force) { console.log(`  skip (exists)  ${id}.jpg`); continue; }
    const credit = await grab(t.query, dest, t.aspect === 'portrait' ? 'portrait' : 'landscape');
    if (!credit) { console.warn(`  no result      ${id}  ("${t.query}")`); continue; }
    credits[id] = credit;
    console.log(`  ${id.padEnd(18)} © ${credit.photographer}`);
  }
  await writeFile(creditsPath, `${JSON.stringify(credits, null, 2)}\n`);
  console.log('\nTexture credits -> assets/textures/credits.json');
}

async function main() {
  if (!KEY) {
    console.error('No UNSPLASH_ACCESS_KEY set.\n');
    console.error('Either export one (free, from https://unsplash.com/oauth/applications)');
    console.error('or follow SHOTLIST.md, which lists a hand-picked candidate for every');
    console.error('slot with the filename to save it as. The shot list gives better');
    console.error('results than this script does — it was curated, not top-hit.');
    process.exit(1);
  }
  await mkdir(DIR, { recursive: true });

  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const only = args.filter((a) => !a.startsWith('-') && a !== 'textures' && a !== 'cars');

  if (!args.includes('cars')) {
    console.log('Textures:');
    await fetchTextures(force);
  }
  if (args.includes('textures')) return;

  console.log('\nCar photographs:');
  const cars = only.length ? CARS.filter((c) => only.includes(c.id) || only.includes(c.slug)) : CARS;

  const creditsPath = path.join(DIR, 'credits.json');
  const credits = existsSync(creditsPath) ? JSON.parse(await readFile(creditsPath, 'utf8')) : {};

  for (const car of cars) {
    const dest = path.join(DIR, `${car.slug}.jpg`);
    if (existsSync(dest) && !force) {
      console.log(`  ${car.id}  skip (exists)   ${car.slug}.jpg`);
      continue;
    }

    const photo = await search(car.photoQuery);
    if (!photo) { console.warn(`  ${car.id}  no result for "${car.photoQuery}"`); continue; }

    const img = await fetch(`${photo.urls.raw}&w=1800&q=82&fm=jpg&fit=max`);
    if (!img.ok) { console.warn(`  ${car.id}  download failed: ${img.status}`); continue; }
    await writeFile(dest, Buffer.from(await img.arrayBuffer()));

    // Required by the Unsplash API terms whenever a photo is used.
    if (photo.links?.download_location) {
      await fetch(photo.links.download_location, { headers: auth }).catch(() => {});
    }

    credits[car.slug] = {
      photographer: photo.user.name,
      profile: `${photo.user.links.html}?utm_source=graphic-posts-generation&utm_medium=referral`,
      photo: photo.links.html,
      query: car.photoQuery,
    };
    console.log(`  ${car.id}  ${car.slug}.jpg  © ${photo.user.name}`);
  }

  await writeFile(creditsPath, `${JSON.stringify(credits, null, 2)}\n`);
  console.log('\nCredits -> assets/cars/credits.json');
  console.log('Now run: npm run render');
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
