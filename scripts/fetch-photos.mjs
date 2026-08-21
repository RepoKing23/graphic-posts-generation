/**
 * Fetches car photography from Unsplash into assets/cars/.
 *
 *   UNSPLASH_ACCESS_KEY=xxxx npm run photos          # all ten
 *   UNSPLASH_ACCESS_KEY=xxxx npm run photos 03 07    # just these
 *   UNSPLASH_ACCESS_KEY=xxxx npm run photos -- --force
 *
 * Get a free key at https://unsplash.com/oauth/applications.
 *
 * This writes the rectangular photo slot only. The hero slot wants a cut-out
 * with a transparent background, which stock search cannot give you — save
 * one yourself as assets/cars/<slug>-cutout.png and it will be picked up.
 *
 * Photographer credit is written to assets/cars/credits.json, and each photo's
 * download endpoint is pinged, as the Unsplash API terms require.
 */
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARS } from '../src/data/cars.js';

// Node's fetch ignores HTTPS_PROXY unless told otherwise; harmless elsewhere.
process.env.NODE_USE_ENV_PROXY ??= '1';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'assets', 'cars');
const KEY = process.env.UNSPLASH_ACCESS_KEY;
const API = 'https://api.unsplash.com';

const auth = { Authorization: `Client-ID ${KEY}`, 'Accept-Version': 'v1' };

async function search(query) {
  const url = `${API}/search/photos?query=${encodeURIComponent(query)}`
            + '&per_page=5&orientation=landscape&content_filter=high';
  const res = await fetch(url, { headers: auth });
  if (res.status === 401) throw new Error('Unsplash rejected the access key (401).');
  if (res.status === 403) throw new Error('Unsplash rate limit reached (403). Try again in an hour.');
  if (!res.ok) throw new Error(`Unsplash search failed: ${res.status}`);
  const { results } = await res.json();
  return results?.[0] || null;
}

async function main() {
  if (!KEY) {
    console.error('Set UNSPLASH_ACCESS_KEY first — see the header of this file.');
    process.exit(1);
  }
  await mkdir(DIR, { recursive: true });

  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const only = args.filter((a) => !a.startsWith('-'));
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
