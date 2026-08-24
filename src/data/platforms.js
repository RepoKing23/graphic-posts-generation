/**
 * Platform defaults — the `platform_defaults.<platform>` settings the skill
 * loads in Phase 1.
 *
 * Everything a platform imposes lives here: the canvas the graphic renders
 * at, the tone offsets applied to the author's base numbers, the hard limits
 * the review phase enforces, and the structural elements a post of that kind
 * must contain. A layout or a composer never hard-codes a limit — it reads it
 * from this file, so raising Instagram's hashtag ceiling is a one-line change
 * rather than a search across the repo.
 *
 *   canvas             pixel size of the platform's graphic
 *   tone_adjustment    added to the author's base tone, then clamped to 1..10
 *   limits             enforced in src/social/review.js — [min, max] where a range
 *   structure          required elements; a missing one fails review
 *   files              output basenames, {slug} and {lang} substituted
 *
 * EMOJI: every budget is 0. The set's house rules ban emoji in the graphics,
 * and copy that carries them beside a poster that does not reads as two
 * different accounts. The knob stays because review enforces it — raise the
 * number and the composer starts spending it.
 */

/** The source graphic: 4:5, the tallest thing a feed will show uncropped. */
export const POSTER_CANVAS = { w: 1080, h: 1350 };

export const PLATFORMS = {
  linkedin: {
    name: 'LinkedIn',
    canvas: { w: 1200, h: 1200 },        // square reads full-width in the feed
    tone_adjustment: { formality_offset: +2, opinionated_offset: -1 },
    limits: {
      chars: 3000,                        // hard platform ceiling
      words: [110, 320],                  // house range for a spec post
      hashtags: [3, 5],
      hook_chars: [40, 210],              // the part shown before "…see more"
      emoji: 0,                           // see EMOJI note below
      exclamations: 0,
    },
    structure: ['hook', 'body', 'cta', 'hashtags'],
    hashtag_case: 'title',
    files: ['{slug}.linkedin.{lang}.md'],
  },

  instagram: {
    name: 'Instagram',
    canvas: { w: 1080, h: 1350 },
    tone_adjustment: { formality_offset: -2, opinionated_offset: +1 },
    limits: {
      caption_chars: 2200,
      visible_preview: 125,               // characters shown before "more"
      hashtags: [8, 15],
      slides: [5, 10],
      slide_title_chars: 34,
      slide_body_chars: 200,
      emoji: 0,
      exclamations: 1,
    },
    structure: ['caption', 'hook', 'cta', 'hashtags', 'carousel'],
    hashtag_case: 'lower',
    files: ['{slug}.instagram.{lang}.md', '{slug}.instagram.carousel.{lang}.md'],
  },

  x: {
    name: 'X',
    canvas: { w: 1600, h: 900 },          // 16:9, the only card X shows uncropped
    tone_adjustment: { formality_offset: -1, opinionated_offset: +2 },
    limits: {
      tweet_chars: 280,
      hashtags: [0, 2],
      thread: [5, 9],
      emoji: 0,
      exclamations: 1,
    },
    structure: ['tweet', 'thread', 'hashtags'],
    hashtag_case: 'title',
    files: ['{slug}.x.tweet.{lang}.md', '{slug}.x.thread.{lang}.md'],
  },
};

export const PLATFORM_IDS = Object.keys(PLATFORMS);

export const isPlatform = (id) => Object.hasOwn(PLATFORMS, id);

/** Resolve a platform's output filenames for one post and language. */
export const fileNames = (platform, slug, lang) =>
  PLATFORMS[platform].files.map((f) => f.replace('{slug}', slug).replace('{lang}', lang));
