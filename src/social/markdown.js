/**
 * Phase 7 output — one markdown file per artefact, named the way the skill
 * names them:
 *
 *   {slug}.linkedin.{lang}.md
 *   {slug}.instagram.{lang}.md          {slug}.instagram.carousel.{lang}.md
 *   {slug}.x.tweet.{lang}.md            {slug}.x.thread.{lang}.md
 *
 * Each file is the post as it goes out — copyable in one block — followed by
 * the review checklist for that post, so the boxes a machine cannot tick have
 * somewhere to be read.
 */
import { AUTHOR } from '../data/author.js';
import { PLATFORMS } from '../data/platforms.js';
import { BRANDS } from '../data/brands.js';
import { fileNames } from '../data/platforms.js';

const fence = (s) => `\`\`\`text\n${s}\n\`\`\``;

function frontMatter(post, extra = {}) {
  const rows = {
    platform: post.platform,
    language: post.lang,
    car: `${post.car.id} ${BRANDS[post.car.brand].name} ${post.car.model}`,
    derived_from: `poster ${post.derived_from}`,
    status: 'draft',
    effective_tone: `formality ${post.tone.formality}, opinionated ${post.tone.opinionated}`,
    ...extra,
  };
  return ['---', ...Object.entries(rows).map(([k, v]) => `${k}: ${v}`), '---'].join('\n');
}

function checklist(checks) {
  return ['## Review\n', ...checks.map((c) =>
    `- [${c.ok ? 'x' : ' '}] ${c.label}${c.detail ? ` — ${c.detail}` : ''}`
    + (c.ok ? '' : `  <!-- ${c.level} -->`)), '',
  '### Read these yourself\n',
  '- [ ] The hook earns the second line',
  '- [ ] The tone reads as the effective tone above, not as the house voice',
  '- [ ] Nothing here needs the poster in front of you to make sense',
  ].join('\n');
}

function planBlock(post) {
  const p = post.plan;
  return ['## Plan\n',
    `**Core message.** ${p.core_message}`, '',
    `**Audience.** ${p.audience}`, '',
    '**Key points.**', ...p.points.map((x) => `1. ${x}`), '',
    `**Structure.** ${p.structure.join(' → ')}`, '',
  ].join('\n');
}

const heading = (post, what) =>
  `# ${BRANDS[post.car.brand].name} ${post.car.model} — ${PLATFORMS[post.platform].name} ${what}`;

/* --------------------------------------------------------------- renderers */

function linkedinDoc(post, checks) {
  const d = post.data;
  const full = [d.hook, d.body, d.cta, d.hashtags.join(' ')].join('\n\n');
  return [
    frontMatter(post, { word_count: d.word_count, char_count: d.char_count }),
    '', heading(post, 'post'), '',
    '## Post\n', fence(full), '',
    '## Parts\n',
    `**Hook** (${d.hook.length} characters — everything before “…see more”)\n`, fence(d.hook), '',
    '**Body**\n', fence(d.body), '',
    '**Call to action**\n', fence(d.cta), '',
    `**Hashtags** (${d.hashtags.length}) — ${d.hashtags.join(' ')}`, '',
    planBlock(post),
    checklist(checks), '',
  ].join('\n');
}

function instagramCaptionDoc(post, checks) {
  const c = post.data.caption;
  return [
    frontMatter(post, { char_count: c.char_count, hashtags: c.hashtags.length,
      carousel: `${post.data.carousel.slide_count} slides` }),
    '', heading(post, 'caption'), '',
    '## Caption\n', fence(c.text), '',
    `## Visible preview\n\nThe first ${c.visible_preview.length} characters — all a scrolling reader sees:\n`,
    `> ${c.visible_preview.replace(/\n+/g, ' ')}…`, '',
    `## Hashtags (${c.hashtags.length})\n\n${c.hashtags.join(' ')}`, '',
    planBlock(post),
    checklist(checks), '',
  ].join('\n');
}

function instagramCarouselDoc(post, checks, images = {}) {
  const car = post.data.carousel;
  const slides = car.slides.map((s) => {
    const img = images[`slide-${String(s.number).padStart(2, '0')}`];
    return [
      `### Slide ${s.number} — ${s.title}`, '',
      img ? `![Slide ${s.number}](${img})\n` : '',
      s.body, '',
      `*Visual direction.* ${s.visual_direction}`, '',
    ].join('\n');
  });
  return [
    frontMatter(post, { slide_count: car.slide_count }),
    '', heading(post, 'carousel'), '',
    `${car.slide_count} slides, 1080×1350 each, in order.`, '',
    ...slides,
    checklist(checks.filter((c) => c.id.startsWith('limit.slide') || c.id === 'limit.slides')), '',
  ].join('\n');
}

function xTweetDoc(post, checks) {
  const t = post.data.tweet;
  return [
    frontMatter(post, { char_count: t.char_count }),
    '', heading(post, 'tweet'), '',
    `## Tweet (${t.char_count}/280)\n`, fence(t.text), '',
    planBlock(post),
    checklist(checks.filter((c) => !c.id.startsWith('limit.thread'))), '',
  ].join('\n');
}

function xThreadDoc(post, checks) {
  const th = post.data.thread;
  return [
    frontMatter(post, { tweet_count: th.tweet_count }),
    '', heading(post, 'thread'), '',
    `${th.tweet_count} tweets. Post in order; the card goes on the first.`, '',
    ...th.tweets.map((t) => [`### ${t.number}/${th.tweet_count} · ${t.char_count}/280\n`,
      fence(t.text), ''].join('\n')),
    checklist(checks.filter((c) => c.id.startsWith('limit.thread') || c.id === 'structure')), '',
  ].join('\n');
}

/**
 * Every file for one post: `[{ name, body }]`, in the order the skill lists
 * them for that platform.
 */
export function documents(post, checks, images = {}) {
  const [a, b] = fileNames(post.platform, post.slug, post.lang);
  if (post.platform === 'linkedin') return [{ name: a, body: linkedinDoc(post, checks) }];
  if (post.platform === 'instagram') {
    return [
      { name: a, body: instagramCaptionDoc(post, checks) },
      { name: b, body: instagramCarouselDoc(post, checks, images) },
    ];
  }
  return [
    { name: a, body: xTweetDoc(post, checks) },
    { name: b, body: xThreadDoc(post, checks) },
  ];
}

/** Author block for the contact sheet and the manifest. */
export const authorLine = () =>
  `${AUTHOR.name} · ${Object.entries(AUTHOR.handles).map(([k, v]) => `${k} ${v}`).join(' · ')}`;
