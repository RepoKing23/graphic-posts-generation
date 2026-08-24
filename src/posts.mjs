/**
 * The social post pipeline — the skill's seven phases, end to end.
 *
 *   Initialize → Plan → Research → Draft → Review → Translate → Finalize
 *
 * Derive mode throughout: the 1080×1350 poster is the source article, and
 * every post is an adaptation of it, so Research is skipped and every row
 * carries `derived_from`. Nothing is written until Review passes.
 *
 *   npm run posts                     every car, every platform, every language
 *   npm run posts 03 07               only those cars
 *   npm run posts -- --platform x     only that platform
 *   npm run posts -- --no-poster      keep the posters already in out/
 *   npm run posts -- --status ready   write the rows with a status other than draft
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { AUTHOR } from './data/author.js';
import { PLATFORMS, PLATFORM_IDS, isPlatform } from './data/platforms.js';
import { languagesOf } from './data/copy.js';
import { compose } from './social/compose.js';
import { review, errorsIn, warningsIn } from './social/review.js';
import { documents } from './social/markdown.js';
import { slideHTML, SLIDE_CANVAS } from './social/slides.js';
import { cardHTML, cardCanvas } from './social/cards.js';
import { articleFolder, relative } from './social/folders.js';
import { describeTone, effectiveTone } from './social/voice.js';
import { openStudio } from './studio.mjs';
import { renderPosters, selectCars } from './render.mjs';
import { buildGallery } from './gallery.mjs';
import { buildBoard } from './social/board.mjs';
import { ROOT, OUT } from './paths.mjs';

function parseArgs(argv) {
  const opts = { platforms: [...PLATFORM_IDS], poster: true, status: 'draft', rest: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--platform') {
      const p = argv[i += 1];
      if (!isPlatform(p)) throw new Error(`unknown platform: ${p}`);
      opts.platforms = [p];
    } else if (a === '--status') opts.status = argv[i += 1];
    else if (a === '--no-poster') opts.poster = false;
    else if (a.startsWith('-')) throw new Error(`unknown flag: ${a}`);
    else opts.rest.push(a);
  }
  return opts;
}

/** Phase 6 — which languages this car can actually be published in. */
function translations(car) {
  const have = languagesOf(car.id);
  const wanted = AUTHOR.languages;
  return {
    ready: wanted.filter((l) => have.includes(l)),
    missing: wanted.filter((l) => !have.includes(l)),
  };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const cars = selectCars(opts.rest);

  /* ---- Phase 1: initialize ------------------------------------------- */
  console.log(`\nInitialize — author "${AUTHOR.name}", base tone `
    + `formality ${AUTHOR.formality} / opinionated ${AUTHOR.opinionated}`);
  for (const p of opts.platforms) {
    const tone = effectiveTone(AUTHOR, p);
    console.log(`  ${PLATFORMS[p].name.padEnd(9)} ${describeTone(tone)}  `
      + `canvas ${PLATFORMS[p].canvas.w}×${PLATFORMS[p].canvas.h}`);
  }

  const studio = await openStudio(ROOT);
  const rows = [];
  let failures = 0;

  try {
    /* ---- the source article ------------------------------------------ */
    if (opts.poster) {
      console.log('\nSource posters');
      await renderPosters(studio, cars);
    }
    for (const car of cars) {
      rows.push({
        id: car.id,
        kind: 'source',
        platform: null,
        derived_from: null,
        status: 'rendered',
        slug: car.slug,
        output_folder: 'out',
        output_files: { image: `${car.id}-${car.slug}.png` },
      });
    }

    for (const car of cars) {
      const langs = translations(car);
      for (const missing of langs.missing) {
        console.warn(`  ! ${car.id}: no ${missing} copy — skipped, not machine-translated`);
      }

      for (const platform of opts.platforms) {
        for (const lang of langs.ready) {
          /* ---- Phases 2–4: plan, research (skipped), draft ------------ */
          const post = compose(car, platform, lang);

          /* ---- Phase 5: review --------------------------------------- */
          const checks = review(post);
          const errors = errorsIn(checks);
          const warnings = warningsIn(checks);
          for (const w of warnings) console.warn(`  ! ${post.id} ${w.id}: ${w.detail}`);
          if (errors.length) {
            failures += 1;
            for (const e of errors) console.error(`  × ${post.id} ${e.id}: ${e.label} — ${e.detail}`);
            continue;   // nothing is written for a post that fails review
          }

          /* ---- Phase 7: finalize ------------------------------------- */
          const dir = await articleFolder(car, platform);
          const images = {};

          if (platform === 'instagram') {
            for (const slide of post.data.carousel.slides) {
              const key = `slide-${String(slide.number).padStart(2, '0')}`;
              await studio.shoot(
                slideHTML(car, slide, post.data.carousel.slide_count),
                SLIDE_CANVAS, path.join(dir, `${key}.png`), `${post.id} ${key}`,
              );
              images[key] = `${key}.png`;
            }
          } else {
            const file = `${car.slug}.${platform}.png`;
            await studio.shoot(cardHTML(car, post), cardCanvas(platform),
              path.join(dir, file), post.id);
            images.card = file;
          }

          const docs = documents(post, checks, images);
          for (const doc of docs) await writeFile(path.join(dir, doc.name), doc.body);
          await writeFile(path.join(dir, 'platform_data.json'),
            `${JSON.stringify(post.data, null, 2)}\n`);

          rows.push({
            id: post.id,
            kind: 'post',
            platform,
            derived_from: post.derived_from,
            status: opts.status,
            language: lang,
            slug: car.slug,
            effective_tone: { formality: post.tone.formality, opinionated: post.tone.opinionated },
            output_folder: relative(dir),
            output_files: {
              [lang]: docs.map((d) => d.name),
              images: Object.values(images),
              platform_data: 'platform_data.json',
            },
            review: { checks: checks.length, failed: 0 },
            platform_data: post.data,
          });

          const size = platform === 'instagram'
            ? `${post.data.carousel.slide_count} slides`
            : `${cardCanvas(platform).w}×${cardCanvas(platform).h}`;
          console.log(`  ${post.id.padEnd(14)} ${lang}  ${size.padEnd(12)} `
            + `${docs.length} file(s)  ${checks.length} checks passed`);
        }
      }
    }

    await writeFile(path.join(OUT, 'articles.json'), `${JSON.stringify(rows, null, 2)}\n`);
    await buildBoard(rows, OUT);
    await buildGallery([], OUT);
  } finally {
    await studio.close();
  }

  const posts = rows.filter((r) => r.kind === 'post').length;
  console.log(`\n${posts} post(s) -> out/posts/  (board: out/posts/index.html, rows: out/articles.json)`);
  if (failures) {
    console.error(`${failures} post(s) failed review and were not written`);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
