/**
 * Effective tone, and the phrasing knobs it drives.
 *
 * Phase 1 of the skill:
 *
 *   effective_formality   = clamp(author.formality   + platform.formality_offset,   1, 10)
 *   effective_opinionated = clamp(author.opinionated + platform.opinionated_offset, 1, 10)
 *
 * The point of computing it is that it has to *do* something. Everything below
 * the calculation turns those two numbers into concrete choices the composer
 * makes — contractions or none, a verdict or a summary, "0–60 mph in 3.4
 * seconds" or "0–60 in 3.4s" — so the same car genuinely reads differently on
 * LinkedIn and on X rather than differing only by hashtag count.
 */
import { PLATFORMS } from '../data/platforms.js';

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export function effectiveTone(author, platformId) {
  const adj = PLATFORMS[platformId].tone_adjustment;
  return {
    platform: platformId,
    base: { formality: author.formality, opinionated: author.opinionated },
    formality: clamp(author.formality + adj.formality_offset, 1, 10),
    opinionated: clamp(author.opinionated + adj.opinionated_offset, 1, 10),
  };
}

/**
 * Contractions, in both directions — the single loudest formality signal.
 *
 * Matched case-insensitively and re-capitalised on the way out, because half
 * of these turn up at the head of a sentence ("There's only one") and a
 * case-sensitive rule silently left those alone.
 */
const PAIRS = [
  ['it is', "it's"], ['that is', "that's"], ['there is', "there's"],
  ['does not', "doesn't"], ['do not', "don't"], ['is not', "isn't"],
  ['will not', "won't"], ['cannot', "can't"], ['you will', "you'll"],
  ['what is', "what's"], ['here is', "here's"], ['has not', "hasn't"],
];

/** Build a replace table: `dir` says which column is matched. */
const rules = (dir) => PAIRS.map(([long, short]) => {
  const [from, to] = dir === 'contract' ? [long, short] : [short, long];
  return [new RegExp(`\\b${from.replace(/'/g, "['’]")}\\b`, 'gi'), to];
});

const SHORT = rules('contract');
const LONG = rules('expand');

/** Keeps "There is" from coming back as "there is". */
const recase = (match, replacement) =>
  (/^[A-Z]/.test(match) ? replacement[0].toUpperCase() + replacement.slice(1) : replacement);

const apply = (s, table) =>
  table.reduce((t, [re, to]) => t.replace(re, (m) => recase(m, to)), s);

/**
 * Turns an effective tone into the helpers the composer writes with.
 *
 * @param {object} tone     from effectiveTone()
 * @param {object} limits   the platform's limits block (emoji budget etc.)
 */
export function voice(tone, limits = {}) {
  const formal = tone.formality >= 7;
  const loose = tone.formality <= 4;
  const strong = tone.opinionated >= 7;

  return {
    tone,
    formal,
    loose,

    /** Three registers of the same sentence; the middle one is the default. */
    pick: (formalText, neutralText, looseText = neutralText) =>
      (formal ? formalText : loose ? looseText : neutralText),

    /** Pull a written line toward this register rather than rewriting it. */
    register: (text) => apply(text, loose ? SHORT : formal ? LONG : []),

    /** Does this post get to hold a position, or does it only report? */
    verdict: strong,

    /** Formal copy spells its units out; loose copy abbreviates them. */
    spec: (s) => (formal
      ? `${s.k}: ${s.v} ${s.u}`
      : `${s.k} ${s.v} ${String(s.u).replace(/\bsec\b/, 's').replace(/\bmph\b/, 'mph')}`),

    /** Emoji budget comes from the platform, never from the author. */
    emoji: (glyph) => ((limits.emoji || 0) > 0 ? glyph : ''),

    /** A question the reader can answer, phrased at the right distance. */
    ask: (q) => (formal ? q.replace(/^Which/, 'Which of these').replace(/\?$/, '?') : q),
  };
}

/** One-line summary for the pipeline log. */
export const describeTone = (t) =>
  `formality ${t.base.formality}→${t.formality}, opinionated ${t.base.opinionated}→${t.opinionated}`;
