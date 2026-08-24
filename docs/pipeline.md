# The pipeline, phase by phase

`npm run posts` implements the Social Post Writer skill in
[`social-post-writer.SKILL.md`](social-post-writer.SKILL.md), which is committed
here verbatim as the specification. This page says where each phase lives.

Everything runs in **derive mode**. The 1080 × 1350 poster is the source
article; the LinkedIn, Instagram and X posts are adaptations of it, so every row
carries `derived_from` and the research phase is skipped.

## Where each phase lives

| Skill | Here |
|---|---|
| Load author profile | `src/data/author.js` |
| Load `platform_defaults.<platform>` | `src/data/platforms.js` |
| Calculate effective tone | `effectiveTone()` in `src/social/voice.js` |
| `create-article-folder.ts --derive-from` | `articleFolder()` in `src/social/folders.js` |
| Phase 2 — Plan adaptation | `src/data/copy.js`, arranged by `plan()` in `compose.js` |
| Phase 3 — Research (light) | skipped: derive mode, the poster is the research |
| Phase 4 — Draft | `src/social/compose.js`, one function per platform |
| Output file naming | `files` in `src/data/platforms.js`, written by `markdown.js` |
| Phase 5 — Review | `src/social/review.js` — a failed check stops the write |
| Phase 6 — Translate | `AUTHOR.languages` + the per-language blocks in `copy.js` |
| Phase 7 — Finalize | rows in `out/articles.json`, files in `out/posts/…` |
| `platform_data` JSON | `out/posts/<id>-<slug>/<platform>/platform_data.json` |
| `show.ts settings <platform>` | read `src/data/platforms.js` — it is the settings table |
| `article-stats.ts --set-status` | `npm run posts -- --status ready` |
| Companion projects | none, per the skill. `AUTHOR.link` is the only outbound link. |

## What the effective tone actually changes

The skill's formula is applied in `effectiveTone()`:

```
effective_formality   = clamp(author.formality   + platform.formality_offset,   1, 10)
effective_opinionated = clamp(author.opinionated + platform.opinionated_offset, 1, 10)
```

With the shipped profile (formality 5, opinionated 7) that gives:

| Platform | Formality | Opinionated | Consequence in the copy |
|---|---|---|---|
| LinkedIn | 7 | 6 | contractions expanded; the neutral summary replaces the verdict |
| Instagram | 3 | 8 | contractions kept; the verdict runs; lowercase hashtags |
| X | 4 | 9 | contractions kept; the verdict leads the thread's close |

`voice()` in `src/social/voice.js` turns those numbers into the choices the
composer makes. Change `AUTHOR.formality` to 8 and the Instagram caption stops
using contractions on the next run — the numbers are not decoration.

## Review

`src/social/review.js` runs the skill's compliance checklist as code: character
and word limits, hashtag count and case, required structural elements, the
effective tone's register, and the derive-mode checks that the post stands
alone. Thirteen to sixteen checks per post depending on the platform.

A failed check with level `error` means nothing is written for that post and the
run exits non-zero. Checks that a machine cannot decide — whether the hook is
any good — are written into each `.md` file as an unticked box.

## Deviations from the skill, and why

- **Canvas sizes.** The skill is about copy; this repo also renders the graphic
  that goes with it, so each platform entry carries a canvas and the cards and
  carousel slides are rendered from code like the posters.
- **Emoji budgets are 0.** The poster house rules ban emoji. Copy carrying them
  beside a poster that does not reads as two different accounts. The budget is
  still enforced, so raising it in `platforms.js` starts spending it.
- **Nothing is machine-translated.** A language listed in `AUTHOR.languages`
  with no matching block in `copy.js` is reported and skipped, not invented.
- **`platform_data` is written to disk, not to a database.** `out/articles.json`
  carries the rows the skill would insert — `platform`, `derived_from`,
  `platform_data`, `status`, `output_folder`, `output_files` — so the same
  shape survives if a database is added later.

## Adding a language

1. Add the code to `AUTHOR.languages` in `src/data/author.js`.
2. Add a block beside `en` for each car in `src/data/copy.js` — `angle`,
   `audience`, `points`, `slideTitles`, `verdict`, `neutral`, `question`, `tags`.
3. `npm run posts`. Files land as `{slug}.{platform}.{lang}.md`, hashtags follow
   the platform's case rule, and every limit is enforced again in the new
   language.

Cars without a block for that language are skipped with a warning, so a
half-translated set still renders.

## Adding a platform

Add an entry to `PLATFORMS` in `src/data/platforms.js` (canvas, tone offsets,
limits, structure, file names), a draft function in `src/social/compose.js`, its
limit checks in `src/social/review.js`, a document renderer in
`src/social/markdown.js`, and a card in `src/social/cards.js`. The pipeline
picks it up from the `PLATFORMS` keys.
