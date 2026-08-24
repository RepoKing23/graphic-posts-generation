/**
 * Phase 5 — the platform constraint compliance checklist, run as code.
 *
 * The skill states the checklist as boxes a human ticks. Every box that can be
 * decided mechanically is decided here instead, and a failed box with level
 * 'error' stops the pipeline: a caption over the character limit or a post
 * carrying eleven hashtags on a platform that takes five is a broken artefact,
 * and shipping it quietly is worse than a loud failure.
 *
 * The boxes that cannot be decided mechanically — is the hook actually good —
 * are left to the reader, and the .md files carry the checklist so the reading
 * has somewhere to happen.
 */
import { AUTHOR } from '../data/author.js';
import { PLATFORMS } from '../data/platforms.js';

const EMOJI = /\p{Extended_Pictographic}/u;

/** Contractions, checked by list: a bare apostrophe rule flags possessives. */
const CONTRACTIONS =
  /\b(it's|that's|there's|doesn't|don't|isn't|won't|can't|you'll|what's|here's|hasn't|didn't|aren't)\b/i;

/**
 * Phrases that only make sense beside the thing the post was derived from.
 * A caption is read in a feed, days later, by someone who never saw the
 * poster — so a reference to "the image above" is a defect, not a shortcut.
 */
const ORPHANED = [
  [/\bas (we|i) (discussed|covered|saw)\b/i, 'refers back to a source the reader does not have'],
  [/\bsection \d/i, 'cites a section number'],
  [/\b(image|poster|graphic) above\b/i, 'assumes a fixed position beside the graphic'],
  [/\bthe full (article|post|write-?up)\b/i, 'points at an article this post does not link'],
  [/\bcompanion (project|repo|repository)\b/i, 'social posts have no companion project'],
  [/\bcode (example|sample)\b/i, 'orphaned reference to code'],
];

const LINK_REQUIRED = [
  [/\blink in bio\b/i, 'promises a link, and author.link is not set'],
  [/\bread more\b/i, 'promises a destination, and author.link is not set'],
];

const check = (id, label, ok, detail = '', level = 'error') => ({ id, label, ok, detail, level });

/** Every mechanical box on the checklist, for one composed post. */
export function review(post) {
  const p = PLATFORMS[post.platform];
  const L = p.limits;
  const d = post.data;
  const out = [];
  const text = post.text;

  /* --- character and word limits ---------------------------------------- */
  if (post.platform === 'linkedin') {
    out.push(check('limit.chars', `Post within ${L.chars} characters`,
      d.char_count <= L.chars, `${d.char_count} characters`));
    out.push(check('limit.words', `Word count in ${L.words[0]}–${L.words[1]}`,
      d.word_count >= L.words[0] && d.word_count <= L.words[1], `${d.word_count} words`));
    out.push(check('limit.hook', `Hook in ${L.hook_chars[0]}–${L.hook_chars[1]} characters`,
      d.hook.length >= L.hook_chars[0] && d.hook.length <= L.hook_chars[1],
      `${d.hook.length} characters before "…see more"`));
  }

  if (post.platform === 'instagram') {
    const cap = d.caption;
    out.push(check('limit.chars', `Caption within ${L.caption_chars} characters`,
      cap.char_count <= L.caption_chars, `${cap.char_count} characters`));
    out.push(check('limit.preview', `Visible preview is ${L.visible_preview} characters`,
      cap.visible_preview.length === Math.min(L.visible_preview, cap.char_count),
      `${cap.visible_preview.length} characters`));
    out.push(check('limit.slides', `Carousel of ${L.slides[0]}–${L.slides[1]} slides`,
      d.carousel.slide_count >= L.slides[0] && d.carousel.slide_count <= L.slides[1],
      `${d.carousel.slide_count} slides`));
    const longTitle = d.carousel.slides.find((s) => s.title.length > L.slide_title_chars);
    out.push(check('limit.slide_title', `Slide titles within ${L.slide_title_chars} characters`,
      !longTitle, longTitle ? `slide ${longTitle.number}: "${longTitle.title}"` : 'all slides'));
    const longBody = d.carousel.slides.find((s) => s.body.length > L.slide_body_chars);
    out.push(check('limit.slide_body', `Slide bodies within ${L.slide_body_chars} characters`,
      !longBody, longBody ? `slide ${longBody.number}: ${longBody.body.length} characters` : 'all slides'));
  }

  if (post.platform === 'x') {
    out.push(check('limit.tweet', `Single tweet within ${L.tweet_chars} characters`,
      d.tweet.char_count <= L.tweet_chars, `${d.tweet.char_count} characters`));
    const over = d.thread.tweets.filter((t) => t.char_count > L.tweet_chars);
    out.push(check('limit.thread_tweets', `Every tweet in the thread within ${L.tweet_chars}`,
      !over.length, over.length ? `over: ${over.map((t) => t.number).join(', ')}`
        : `longest ${Math.max(...d.thread.tweets.map((t) => t.char_count))} characters`));
    out.push(check('limit.thread', `Thread of ${L.thread[0]}–${L.thread[1]} tweets`,
      d.thread.tweet_count >= L.thread[0] && d.thread.tweet_count <= L.thread[1],
      `${d.thread.tweet_count} tweets`));
  }

  /* --- hashtags ---------------------------------------------------------- */
  const tags = post.platform === 'instagram' ? d.caption.hashtags
    : post.platform === 'x' ? d.tweet.hashtags : d.hashtags;
  const [lo, hi] = L.hashtags;
  out.push(check('hashtags.count', `Hashtag count in ${lo}–${hi}`,
    tags.length >= lo && tags.length <= hi, `${tags.length}: ${tags.join(' ') || 'none'}`));
  const miscased = tags.filter((t) =>
    (p.hashtag_case === 'lower' ? t !== t.toLowerCase() : /^#[a-z]/.test(t)));
  out.push(check('hashtags.case', `Hashtags in ${p.hashtag_case} case`,
    !miscased.length, miscased.join(' ') || 'consistent'));

  /* --- required structure ------------------------------------------------ */
  const present = {
    hook: post.platform === 'linkedin' ? Boolean(d.hook) : Boolean(d.caption?.visible_preview),
    body: Boolean(d.body),
    cta: /\?/.test(post.platform === 'linkedin' ? d.cta : text),
    hashtags: tags.length > 0 || lo === 0,
    caption: Boolean(d.caption?.text),
    carousel: (d.carousel?.slide_count || 0) > 0,
    tweet: Boolean(d.tweet?.text),
    thread: (d.thread?.tweet_count || 0) > 0,
  };
  const missing = p.structure.filter((el) => !present[el]);
  out.push(check('structure', `Required elements present: ${p.structure.join(', ')}`,
    !missing.length, missing.length ? `missing ${missing.join(', ')}` : 'all present'));

  /* --- tone matches the EFFECTIVE tone, not the author's base ------------ */
  const formal = post.tone.formality >= 7;
  out.push(check('tone.contractions',
    formal ? 'Formal register: no contractions' : 'Register allows contractions',
    formal ? !CONTRACTIONS.test(text) : true,
    formal ? (CONTRACTIONS.exec(text)?.[0] ?? 'none found') : `formality ${post.tone.formality}`));

  const exclamations = (text.match(/!/g) || []).length;
  out.push(check('tone.exclamations', `At most ${L.exclamations} exclamation mark(s)`,
    exclamations <= L.exclamations, `${exclamations} found`));

  const emoji = EMOJI.test(text);
  out.push(check('tone.emoji', L.emoji ? `Emoji budget ${L.emoji}` : 'No emoji (house rule)',
    L.emoji ? true : !emoji, emoji ? 'emoji present' : 'none'));

  /* --- stands alone (derive mode) ---------------------------------------- */
  const orphans = ORPHANED.filter(([re]) => re.test(text));
  out.push(check('standalone', 'No assumptions about the graphic it was derived from',
    !orphans.length, orphans.map(([, why]) => why).join('; ') || 'reads on its own'));

  if (!AUTHOR.link) {
    const promises = LINK_REQUIRED.filter(([re]) => re.test(text));
    out.push(check('standalone.link', 'No promised destination without a link',
      !promises.length, promises.map(([, why]) => why).join('; ') || 'no link promised'));
  }

  /* --- the value proposition survived the adaptation --------------------- */
  const lead = post.car.specs[0];
  out.push(check('value.figure', 'Headline figure carried across from the poster',
    text.includes(String(lead.v)), `${lead.k} ${lead.v}`));
  out.push(check('value.identity', 'Car is identified by model and year',
    text.includes(post.car.model) && text.includes(post.car.year),
    `${post.car.model} ${post.car.year}`));

  /* --- platform formatting ----------------------------------------------- */
  if (post.platform === 'linkedin') {
    const longest = Math.max(...d.body.split('\n\n').map((b) => b.length));
    out.push(check('format.breaks', 'No paragraph over 420 characters',
      longest <= 420, `longest ${longest}`, 'warn'));
  }
  if (post.platform === 'instagram') {
    out.push(check('format.tags_last', 'Hashtags sit at the end of the caption',
      d.caption.text.trimEnd().endsWith(tags[tags.length - 1]), 'tail of caption'));
  }

  return out;
}

export const errorsIn = (checks) => checks.filter((c) => !c.ok && c.level === 'error');
export const warningsIn = (checks) => checks.filter((c) => !c.ok && c.level === 'warn');
