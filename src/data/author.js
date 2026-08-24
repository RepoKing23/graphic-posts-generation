/**
 * Author profile — Phase 1 of the social-post workflow.
 *
 * The skill this pipeline implements (docs/social-post-writer.SKILL.md) starts
 * every post by loading an author profile and combining its base tone with the
 * platform's offsets. This is that profile: one file, edited by hand, read by
 * `effectiveTone()` in src/social/voice.js.
 *
 *   formality    1 = texting a friend, 10 = a filing
 *   opinionated  1 = reports the figures, 10 = tells you what to think of them
 *
 * Both are the *base* tone. No platform ever uses these numbers directly —
 * each applies its own offset first, which is why the LinkedIn copy and the X
 * copy generated from the same car read as two different voices.
 */
export const AUTHOR = {
  name: 'Car spec posts',
  handles: {
    linkedin: 'car-spec-posts',
    instagram: '@carspecposts',
    x: '@carspecposts',
  },

  /** Enthusiast editorial: mid-formal, and happy to hold a position. */
  formality: 5,
  opinionated: 7,

  /**
   * Languages to publish in. The first is the source language; every other
   * entry needs a locale file in src/data/locales/ AND per-car copy in the
   * `social.<lang>` block of src/data/cars.js. Nothing is machine-translated:
   * a language with no copy is reported as untranslated and skipped, rather
   * than shipped as an invented translation.
   */
  languages: ['en'],

  /**
   * Where a call to action can point. Left null on purpose — a post that
   * invites a click needs a real destination, and a placeholder URL in a
   * published caption is worse than no link at all. Set it and every CTA
   * gains a destination; leave it and the CTAs stay conversational.
   */
  link: null,

  /** House hashtags, appended to the car-specific ones on every platform. */
  tags: ['CarSpecs', 'AutomotiveDesign'],
};
