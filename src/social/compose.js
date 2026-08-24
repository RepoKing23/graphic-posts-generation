/**
 * Phases 2–4: plan, then draft, one platform at a time.
 *
 * Every platform draws on the same substance — the angle, points, verdict and
 * question in src/data/copy.js, plus the published figures in cars.js — and
 * arranges it to that platform's structure at that platform's effective tone.
 * Nothing here reaches for the author's base tone; it only ever sees the
 * effective one, which is the whole reason the three drafts read differently.
 */
import { AUTHOR } from '../data/author.js';
import { PLATFORMS } from '../data/platforms.js';
import { BRANDS } from '../data/brands.js';
import { copyOf } from '../data/copy.js';
import { effectiveTone, voice } from './voice.js';

/** Topical tags for the platform that expects a dozen of them. */
const HOUSE_TOPICS = ['cars', 'carsofinstagram', 'automotive', 'cardesign',
  'specsheet', 'graphicdesign', 'typography'];

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

/** '300 hp', '0–60 mph in 4.9 sec', 'AWD GR-FOUR' — a spec as running text. */
export function specPhrase(s) {
  const unit = String(s.u).split(/[,(]/)[0].trim();
  if (/^0[–-]60/.test(s.k)) return `0–60 mph in ${s.v} ${unit}`;
  if (/^[A-Z]{3}$/.test(String(s.v))) return `${s.v} ${unit}`;
  return `${s.v} ${unit.replace(/\s*@.*$/, '')}`;
}

/**
 * The specs a running sentence should lead with: output, then torque, then
 * whatever the car is actually famous for — the acceleration row where there
 * is one, otherwise the next figure down the sheet. Taking the first three in
 * declaration order gave the Toyota "300 hp · 273 lb-ft · 1.6 L turbo I3",
 * which buries the interesting number.
 */
function headlineSpecs(car, n = 3) {
  const accel = car.specs.find((s) => /^0[–-]60|1\/4 mile/.test(s.k));
  const picked = [];
  for (const s of [...car.specs.filter((s) => /power|torque/i.test(s.k)), accel, ...car.specs]) {
    if (s && !picked.includes(s)) picked.push(s);
    if (picked.length === n) break;
  }
  return picked;
}

const specLine = (car, n = 3) => headlineSpecs(car, n).map(specPhrase).join(' · ');

/** Hashtags for a platform, cased to its convention and capped at its ceiling. */
function hashtags(platformId, stems) {
  const p = PLATFORMS[platformId];
  const max = p.limits.hashtags[1];
  const seen = new Set();
  const out = [];
  for (const raw of stems) {
    const stem = String(raw).replace(/[^A-Za-z0-9]/g, '');
    if (!stem) continue;
    const tag = p.hashtag_case === 'lower' ? stem.toLowerCase() : stem;
    if (seen.has(tag.toLowerCase())) continue;
    seen.add(tag.toLowerCase());
    out.push(`#${tag}`);
    if (out.length === max) break;
  }
  return out;
}

/** Phase 2 — the plan, kept on the post so the .md file can show its working. */
function plan(car, c, platformId) {
  return {
    mode: 'derive',
    source: `poster ${car.id}`,
    core_message: c.angle,
    audience: c.audience,
    hero_spec: c.hero || car.specs[0].k,
    points: c.points,
    structure: PLATFORMS[platformId].structure,
  };
}

/* ------------------------------------------------------------------ LinkedIn */

function linkedin(car, c, v) {
  const b = BRANDS[car.brand].name;
  const hook = `${v.register(car.kicker)}.\n\n${v.register(c.angle)}`;

  const body = [
    v.register(car.body),
    `${car.year} ${b} ${car.model} ${car.trim} — ${specLine(car)}.`,
    c.points.map((p) => `· ${v.register(p)}`).join('\n'),
    v.register(v.verdict ? c.verdict : c.neutral),
  ].join('\n\n');

  const cta = AUTHOR.link
    ? `${v.ask(c.question)}\n\n${AUTHOR.link}`
    : v.ask(c.question);

  const tags = hashtags('linkedin', [...c.tags, ...AUTHOR.tags]);
  const text = [hook, body, cta, tags.join(' ')].join('\n\n');

  return {
    data: { hook, body, cta, hashtags: tags, word_count: words(text), char_count: text.length },
    text,
  };
}

/* ----------------------------------------------------------------- Instagram */

function instagram(car, c, v) {
  const b = BRANDS[car.brand].name;
  const limits = PLATFORMS.instagram.limits;

  // The first 125 characters are all a scrolling reader gets, so the angle
  // leads on its own line and has to make sense with nothing after it.
  const caption = [
    v.register(c.angle),
    v.register(car.line),
    c.points.slice(0, 3).map((p) => `· ${v.register(p)}`).join('\n'),
    `${car.year} ${b} ${car.model} ${car.trim}\n${specLine(car, 4)}`,
    v.register(v.verdict ? c.verdict : c.neutral),
    v.ask(c.question),
  ].join('\n\n');

  const tags = hashtags('instagram',
    [...c.tags, b, ...AUTHOR.tags, ...HOUSE_TOPICS]);
  const text = `${caption}\n\n${tags.join(' ')}`;

  const slides = [
    {
      number: 1,
      kind: 'cover',
      title: `${b} ${car.model}`,
      body: v.register(`${car.kicker}. ${c.angle}`),
      visual_direction: 'Cover: silhouette running off the right edge on the accent field, '
        + 'model name at slide scale, kicker as tracked caps above it.',
    },
    ...c.points.map((p, i) => ({
      number: i + 2,
      kind: 'point',
      title: c.slideTitles[i],
      body: v.register(p),
      visual_direction: `Point ${i + 1} of ${c.points.length}: heading at display scale over a `
        + 'hairline rule, body set narrow, slide index in the corner.',
    })),
    {
      number: c.points.length + 2,
      kind: 'specs',
      title: 'The numbers',
      body: car.specs.map(specPhrase).join(' / '),
      visual_direction: 'Full spec table, dotted leaders, values in the accent colour.',
    },
    {
      number: c.points.length + 3,
      kind: 'closer',
      title: 'Over to you',
      body: v.register(`${v.verdict ? c.verdict : c.neutral} ${v.ask(c.question)}`),
      visual_direction: 'Closer: accent field, question at display scale, handle in tracked caps at the foot.',
    },
  ];

  return {
    data: {
      caption: {
        text,
        visible_preview: text.slice(0, limits.visible_preview),
        hashtags: tags,
        char_count: text.length,
      },
      carousel: { slide_count: slides.length, slides },
    },
    text,
  };
}

/* ------------------------------------------------------------------------- X */

function x(car, c, v) {
  const b = BRANDS[car.brand].name;
  const tags = hashtags('x', c.tags);

  const tweetText = `${v.register(c.angle)}\n\n${specLine(car)}\n\n${tags.join(' ')}`.trim();

  const bodies = [
    `${v.register(car.line)}\n\n${car.year} ${b} ${car.model} ${car.trim}.`,
    ...c.points.map((p) => v.register(p)),
    `The numbers: ${car.specs.map(specPhrase).join(' · ')}.`,
    v.register(v.verdict ? c.verdict : c.neutral),
    `${v.ask(c.question)}${tags.length ? `\n\n${tags.join(' ')}` : ''}`,
  ];

  const tweets = bodies.map((text, i) => ({ number: i + 1, text, char_count: text.length }));

  return {
    data: {
      tweet: { text: tweetText, char_count: tweetText.length, hashtags: tags },
      thread: { tweet_count: tweets.length, tweets },
    },
    text: [tweetText, ...bodies].join('\n\n'),
  };
}

const DRAFT = { linkedin, instagram, x };

/**
 * Plan and draft one post.
 *
 * @param {object} car        a row from src/data/cars.js
 * @param {string} platformId 'linkedin' | 'instagram' | 'x'
 * @param {string} lang       language code; copy must exist for it
 * @returns {object} post — plan, effective tone, platform_data, and the flat
 *                   text the review phase runs its checks over
 */
export function compose(car, platformId, lang) {
  const c = copyOf(car.id, lang);
  if (!c) throw new Error(`no ${lang} copy for car ${car.id} — see src/data/copy.js`);

  const tone = effectiveTone(AUTHOR, platformId);
  const v = voice(tone, PLATFORMS[platformId].limits);
  const { data, text } = DRAFT[platformId](car, c, v);

  return {
    id: `${car.id}-${platformId}`,
    car,
    platform: platformId,
    lang,
    slug: car.slug,
    derived_from: car.id,
    tone,
    plan: plan(car, c, platformId),
    data,
    text,
  };
}
