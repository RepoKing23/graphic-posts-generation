/**
 * Platform cards — the graphic that goes out with the LinkedIn post and the
 * X tweet.
 *
 * These are drawn, not cropped. Squeezing the 4:5 poster into a square or a
 * 16:9 slot means cutting a layout that was composed to its own edges, so each
 * card is its own composition built from the same parts: the accent, the
 * silhouette, the published figures, the same two typefaces. The set reads as
 * one account across three aspect ratios instead of one poster badly cropped
 * three ways.
 */
import { PAPER, STEEL, INK, FONT, grain, grainLight, alpha, mix } from '../theme/tokens.js';
import { BRANDS, brandMark } from '../data/brands.js';
import { specLedger } from '../theme/blocks.js';
import { heroCar } from '../photo.js';
import { texture } from '../texture.js';
import { AUTHOR } from '../data/author.js';
import { PLATFORMS } from '../data/platforms.js';

/**
 * The three figures a ledger carries.
 *
 * `skip` drops a spec that is already set at hero scale elsewhere on the card —
 * the LinkedIn card led with 717 hp and then repeated it in the ledger below,
 * which reads as a mistake rather than as emphasis.
 */
function lead(car, skip = null) {
  const pool = car.specs.filter((s) => s !== skip);
  const accel = pool.find((s) => /^0[–-]60/.test(s.k));
  const ordered = [accel, ...pool].filter(Boolean);
  const out = [];
  for (const s of ordered) if (!out.includes(s) && out.length < 3) out.push(s);
  return out;
}

/* --------------------------------------------------- LinkedIn — 1200 × 1200 */

function linkedin(car, post) {
  const b = BRANDS[car.brand];
  const a = car.accent;
  const M = 92;
  const hair = `1px solid ${alpha(INK, 0.2)}`;
  // Which figure the card leads with — named in copy.js when the first spec
  // is not the interesting one (the GT3 RS leads on downforce, not power).
  const hero = car.specs.find((s) => s.k === post.plan.hero_spec) || car.specs[0];

  return `
  <div style="position:absolute;inset:0;background:${PAPER[0]};"></div>
  ${texture('paper-fibre', { grade: { saturate: 0, contrast: 1.08, brightness: 1.05 },
    opacity: 0.35, blend: 'multiply' })}
  <div style="position:absolute;left:${M - 26}px;right:${M - 26}px;top:0;bottom:0;
    border-left:${hair};border-right:${hair};"></div>

  <div style="position:absolute;top:${M}px;left:${M}px;right:${M}px;display:flex;
    align-items:center;justify-content:space-between;padding-bottom:22px;border-bottom:2px solid ${INK};">
    <div style="display:flex;align-items:center;gap:16px;">
      ${brandMark(car.brand, 38)}
      ${b.lettered ? '' : `<span style="font-family:${FONT.archivo};font-weight:700;font-size:20px;
        letter-spacing:.15em;color:${INK};">${b.name.toUpperCase()}</span>`}
    </div>
    <span style="font-family:${FONT.mono};font-size:11px;letter-spacing:.26em;
      text-transform:uppercase;color:${alpha(INK, 0.55)};">${car.model} · ${car.trim} · ${car.year}</span>
  </div>

  <div style="position:absolute;left:${M}px;right:${M}px;top:${M + 128}px;">
    <div style="font-family:${FONT.mono};font-size:12px;font-weight:600;letter-spacing:.32em;
      text-transform:uppercase;color:${a};">${car.kicker}</div>
    <div style="margin-top:30px;display:flex;align-items:flex-start;gap:26px;">
      <div style="font-family:${FONT.archivo};font-weight:900;font-size:${String(hero.v).length > 3 ? 210 : 250}px;
        line-height:.74;letter-spacing:-.06em;color:${INK};">${hero.v}</div>
      <div style="padding-top:18px;">
        <div style="font-family:${FONT.archivo};font-weight:900;font-size:52px;line-height:.9;
          letter-spacing:-.03em;color:${a};">${String(hero.u).split(/[ ,@(]/)[0].toUpperCase()}</div>
        <div style="margin-top:10px;font-family:${FONT.mono};font-size:11px;letter-spacing:.24em;
          text-transform:uppercase;color:${alpha(INK, 0.55)};max-width:150px;">${hero.k}</div>
      </div>
    </div>
    <div style="margin-top:34px;max-width:820px;font-family:${FONT.tight};font-weight:300;
      font-size:34px;line-height:1.2;letter-spacing:-.024em;color:${INK};">${post.plan.core_message}</div>
  </div>

  <div style="position:absolute;left:${M + 40}px;right:${M + 40}px;bottom:${M + 196}px;">
    ${heroCar(car, { fill: STEEL[6], detail: alpha('#FFFFFF', 0.22), lamp: alpha(a, 0.85),
      glass: alpha(STEEL[2], 0.32), sheen: alpha('#FFFFFF', 0.06),
      tyre: '#0B0C0E', rim: STEEL[3], shadow: true })}
  </div>

  <div style="position:absolute;left:${M}px;right:${M}px;bottom:${M}px;">
    ${specLedger(lead(car, hero), { color: INK, accent: a, valueSize: 44, labelSize: 10, unitSize: 10.5 })}
    <div style="margin-top:22px;font-family:${FONT.mono};font-size:10.5px;letter-spacing:.24em;
      text-transform:uppercase;color:${alpha(INK, 0.45)};">${AUTHOR.handles.linkedin}</div>
  </div>

  ${grain(0.045)}`;
}

/* ----------------------------------------------------------- X — 1600 × 900 */

function x(car, post) {
  const b = BRANDS[car.brand];
  const a = car.accent;
  const M = 76;
  const ink = '#FFFFFF';

  const chip = (s) => `
    <div style="padding:0 22px 0 0;margin-right:22px;border-right:1px solid ${alpha(ink, 0.22)};">
      <div style="font-family:${FONT.archivo};font-weight:800;font-size:34px;letter-spacing:-.03em;
        color:${ink};line-height:1;">${s.v}</div>
      <div style="margin-top:8px;font-family:${FONT.mono};font-size:10px;letter-spacing:.22em;
        text-transform:uppercase;color:${alpha(ink, 0.6)};white-space:nowrap;">${s.k}</div>
    </div>`;

  return `
  <div style="position:absolute;inset:0;background:${STEEL[7]};"></div>
  ${texture('light-trails', { grade: { saturate: 0.25, contrast: 1.15, brightness: 0.75 },
    opacity: 0.3, blend: 'screen' })}
  <div style="position:absolute;inset:0;background:
    radial-gradient(64% 84% at 74% 50%, ${alpha(a, 0.28)}, transparent 66%);"></div>

  <div style="position:absolute;left:52%;right:-2%;top:50%;transform:translateY(-40%);">
    ${heroCar(car, { fill: mix(STEEL[5], a, 0.42), detail: alpha('#FFFFFF', 0.26),
      lamp: alpha(a, 0.95), glass: alpha('#FFFFFF', 0.14), sheen: alpha('#FFFFFF', 0.09),
      tyre: '#08090B', rim: STEEL[3], shadow: false })}
  </div>

  <div style="position:absolute;left:${M}px;top:${M}px;display:flex;align-items:center;gap:14px;">
    ${brandMark(car.brand, 26, ink)}
    <span style="font-family:${FONT.mono};font-size:11px;font-weight:600;letter-spacing:.28em;
      text-transform:uppercase;color:${alpha(ink, 0.8)};">${b.lettered ? '' : `${b.name} · `}${car.trim} · ${car.year}</span>
  </div>

  <div style="position:absolute;left:${M}px;top:50%;transform:translateY(-50%);width:820px;">
    <div style="font-family:${FONT.mono};font-size:11.5px;font-weight:600;letter-spacing:.32em;
      text-transform:uppercase;color:${a};">${car.kicker}</div>
    <div style="margin-top:22px;font-family:${FONT.archivo};font-weight:900;font-size:104px;
      line-height:.88;letter-spacing:-.048em;color:${ink};">${car.model}</div>
    <div style="margin-top:28px;max-width:690px;font-family:${FONT.tight};font-weight:300;
      font-size:28px;line-height:1.32;letter-spacing:-.015em;color:${alpha(ink, 0.84)};">
      ${post.plan.core_message}</div>
    <div style="margin-top:44px;height:2px;width:220px;background:${a};"></div>
    <div style="margin-top:28px;display:flex;align-items:flex-start;">${lead(car).map(chip).join('')}</div>
  </div>

  <div style="position:absolute;left:${M}px;bottom:${M}px;font-family:${FONT.mono};font-size:10.5px;
    letter-spacing:.24em;text-transform:uppercase;color:${alpha(ink, 0.45)};">
    ${AUTHOR.handles.x}</div>

  ${grainLight(0.08)}`;
}

const CARD = { linkedin, x };

/** Card HTML for a platform, or null where the platform has no single card. */
export const cardHTML = (car, post) =>
  (CARD[post.platform] ? CARD[post.platform](car, post) : null);

export const cardCanvas = (platform) => PLATFORMS[platform].canvas;
