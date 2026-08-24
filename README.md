# Car spec posts

Ten art-directed social graphics about cars and their specifications, rendered
from code — and, from each one, a LinkedIn post, an Instagram caption with a
seven-slide carousel, and an X tweet and thread, planned, drafted, reviewed and
written out by the same run.

The poster is the **source article**: 1080 × 1350, the 4:5 Instagram and
Facebook feed size. Everything else is derived from it, following the Social
Post Writer skill committed at
[`docs/social-post-writer.SKILL.md`](docs/social-post-writer.SKILL.md).

Each poster is an HTML layout screenshotted by headless Chromium, so the whole
set re-renders in a few seconds when you change a colour, a figure, or a photo.

| # | Design | Device | Car |
|---|---|---|---|
| 01 | Triptych Spec Sheet | three detail crops over a hero, ledger footer | Toyota GR Corolla |
| 02 | Concentric Field | corner moiré, x-mark flanks, red slats | Jeep Wrangler Rubicon 392 |
| 03 | Spotlight Fleet | one lit car inside a dimmed fleet | Hyundai IONIQ 5 N |
| 04 | Terrain Ribbon | road unspooling from a paper massif | Honda Civic Type R |
| 05 | Blueprint Cutaway | dimension lines, leader callouts, title block | Porsche 911 GT3 RS |
| 06 | Spec Slab | Swiss data poster, hairline grid | BMW M5 |
| 07 | Split Duotone | hard seam, car rendered twice across it | Mercedes-AMG GT 63 |
| 08 | Motion Streak | long-exposure bands, condensed caps | Ford Mustang Dark Horse |
| 09 | Halftone Riso | two-colour screen print, out of register | Land Rover Defender 110 V8 |
| 10 | Service Ticket | perforated docket, barcode, rubber stamp | Tesla Model S Plaid |

## Quick start

```bash
npm install
npm run build            # fetches the typefaces, then renders posters and posts
open out/index.html      # contact sheet
open out/posts/index.html # the derived posts, card by card
```

`npm run posts` re-runs everything without re-fetching fonts. `npm run render`
renders only the posters. Both take ids or a layout name to work on a subset:

```bash
npm run render 03 07
npm run posts 05
npm run posts -- --platform linkedin      # one platform, all cars
npm run posts -- --no-poster              # keep the posters already in out/
npm run posts -- --status ready           # write the rows with a status of your own
```

## The platform posts

One poster becomes three posts. Each gets its own folder, its own graphic at the
platform's own size, the markdown to paste, and the `platform_data` JSON:

| Platform | Graphic | Files |
|---|---|---|
| LinkedIn | one 1200 × 1200 card | `{slug}.linkedin.{lang}.md` |
| Instagram | seven 1080 × 1350 slides | `{slug}.instagram.{lang}.md` + `{slug}.instagram.carousel.{lang}.md` |
| X | one 1600 × 900 card | `{slug}.x.tweet.{lang}.md` + `{slug}.x.thread.{lang}.md` |

```
out/
  01-toyota-gr-corolla.png              the source poster
  index.html                            poster contact sheet
  articles.json                         one row per artefact: platform, derived_from,
                                        status, output_folder, output_files, platform_data
  posts/
    index.html                          board: every card, carousel and caption
    01-toyota-gr-corolla/
      linkedin/    toyota-gr-corolla.linkedin.en.md, .png, platform_data.json
      instagram/   caption .md, carousel .md, slide-01…07.png, platform_data.json
      x/           tweet .md, thread .md, .png, platform_data.json
```

The cards are drawn, not cropped. Squeezing a 4:5 poster into a square or a 16:9
slot cuts a layout composed to its own edges, so each card is its own
composition built from the same parts — the accent, the silhouette, the
published figures, the same two typefaces.

### One voice, three registers

The author's base tone lives in `src/data/author.js`; each platform in
`src/data/platforms.js` adjusts it, and the composer only ever sees the result:

| Platform | Formality | Opinionated | What changes |
|---|---|---|---|
| LinkedIn | 5 → **7** | 7 → **6** | contractions expanded, verdict replaced by a neutral close |
| Instagram | 5 → **3** | 7 → **8** | contractions kept, verdict runs, lowercase hashtags |
| X | 5 → **4** | 7 → **9** | contractions kept, verdict closes the thread |

These numbers are wired to real choices, not printed in a header. Move
`AUTHOR.formality` to 8 and the Instagram caption stops using contractions on
the next run.

### Changing what a post says

Copy is data. `src/data/copy.js` holds, per car and per language, the core
message, the audience, three to five key points, a carousel heading for each, a
verdict, its non-opinionated alternative, the closing question, and the
car-specific hashtags. Edit there and re-run; the arrangement per platform is
`src/social/compose.js`'s job.

Every figure in that file is either already in the car's `specs` block or
arithmetic on it. Nothing new is claimed — see `NOTICE.md`.

### Review runs as code

`src/social/review.js` is the skill's compliance checklist, executed: character
and word limits, hashtag count and case, required structural elements, the
effective tone's register, and — because a caption is read in a feed days later
by someone who never saw the poster — a check that nothing refers back to the
graphic it came from. Thirteen to sixteen checks per post.

A failed check writes nothing for that post and exits non-zero. The boxes a
machine cannot tick are carried into each `.md` file, unticked, for a human.

Phase-by-phase detail, and how to add a language or a platform, is in
[`docs/pipeline.md`](docs/pipeline.md).

## Adding photography

**Start with [`SHOTLIST.md`](SHOTLIST.md)** — fourteen textures, each with a
hand-picked Unsplash candidate and the exact filename to save it as.

The division of labour is deliberate: **photography supplies the world, the
identifiable car stays vector.** A night car park, mud, light trails, a studio
sweep, macro detail — that is what a camera does best, and it is what stock
libraries actually carry de-branded and cleanly licensable. The car itself is
drawn (`src/theme/silhouettes.js`), so a Toyota poster shows something honestly
labelled a Toyota rather than whichever generic hatchback a search returned.

Three drop-in slots, all optional, each swapping in on the next render:

| File | Used for |
|---|---|
| `assets/textures/<id>.jpg` | the world — grounds, skies, surfaces, macro detail |
| `assets/cars/<slug>.jpg` | optional per-car photograph |
| `assets/cars/<slug>-cutout.png` | optional transparent cut-out for the hero slot |

Texture ids and the art direction for each are in `src/data/textures.js`; slugs
are the `slug` field in `src/data/cars.js`.

With nothing supplied, every poster falls back to the procedural motifs in
`src/theme/motifs.js` and renders complete — the committed set is never broken
by a missing file. The cards use the same slots: the LinkedIn card takes
`paper-fibre` if it is there, the X card takes `light-trails`.

To fill everything automatically instead, with a free key from
<https://unsplash.com/oauth/applications>:

```bash
UNSPLASH_ACCESS_KEY=xxxx npm run photos            # textures + car photos
UNSPLASH_ACCESS_KEY=xxxx npm run photos textures   # textures only
npm run posts
```

That takes the top search hit per slot, which is blunt for art direction — the
shot list is curated and will give better results. Photographer credit lands in
`credits.json` beside each set.

### Keeping a photograph in the palette

Stock dropped in raw breaks the one-accent-per-poster rule: it arrives with its
own colour cast and its own contrast. `src/texture.js` exists to prevent that,
and every layout passes its textures through it:

- `grade` — contrast, brightness and saturation, pushing the frame toward the
  poster's palette before anything else happens
- `tint` — a flat wash in the poster's own accent; `multiply` on paper grounds,
  `screen` or `overlay` on dark ones
- `duotone` — a real two-colour separation, used on the Mercedes seam and the
  Land Rover riso plates

If a new texture looks wrong, the fix is almost always a `grade`/`tint` value in
the layout, not a different photograph.

## Layout of the code

```
src/data/cars.js        the ten posters: copy, specs, accent colour, layout
src/data/copy.js        per-car post copy: angle, points, verdict, question, tags
src/data/author.js      author profile — base tone, languages, handles, link
src/data/platforms.js   platform defaults — canvas, tone offsets, limits, file names
src/data/brands.js      manufacturer marks, hand-authored as SVG
src/data/textures.js    texture manifest — role, search terms, art direction

src/texture.js          texture resolver + grade / tint / duotone treatments
src/theme/tokens.js     palettes, type stacks, grain, colour helpers
src/theme/blocks.js     spec ledger / table / hero numeral
src/theme/motifs.js     moiré, halftone, dimension lines, streaks, barcode…
src/theme/silhouettes.js five side profiles, drawn to real dimensional ratios
src/layouts/*.js        one module per poster — render(car) → HTML

src/social/voice.js     effective tone, and the phrasing it drives
src/social/compose.js   plan and draft, one function per platform
src/social/review.js    the compliance checklist, run as code
src/social/markdown.js  the .md files, named as the skill names them
src/social/slides.js    carousel slides — cover, point, specs, closer
src/social/cards.js     LinkedIn 1200×1200 and X 1600×900 cards
src/social/folders.js   per-post output folders
src/social/board.mjs    contact sheet for the derived posts

src/studio.mjs          Chromium loop, size and typeface assertions
src/render.mjs          renders the posters
src/posts.mjs           the seven-phase pipeline
```

### Changing a poster

Copy, specifications and accent colour live in `src/data/cars.js`; edit there
and re-render. Structural changes belong in the matching `src/layouts/*.js`.

### Adding an eleventh

Add an entry to `CARS` with a new `layout` name, then create
`src/layouts/<name>.js` exporting `default function (car) { return '<html>' }`.
Add a matching entry to `src/data/copy.js` and the three platform posts come
with it. The renderer picks both up automatically.

## House rules

The set is deliberately not generic. Encoded in `src/theme/tokens.js` and held
across every layout, card and slide:

- **One accent colour per poster.** Everything else sits on a neutral ramp —
  warm paper and concrete, or cool gunmetal.
- **No** purple→cyan gradients, glassmorphism, uniformly rounded corners, emoji,
  or drop-shadowed centred stacks.
- A display face paired with a technical face for spec data; extreme tracking on
  small caps, tight negative tracking on large display, weight and colour shifts
  inside a single line.
- Hairline rules instead of boxes, a real baseline grid, deliberate asymmetry,
  print grain over everything.

The copy follows the same rules: no emoji, no exclamation marks on LinkedIn, no
hashtag soup outside Instagram, and no post that needs the poster beside it to
make sense.

## Notes

- Specifications are published manufacturer figures — see `NOTICE.md`.
- Textures come from Unsplash under the Unsplash Licence: free, commercial use
  permitted, no attribution required. Credit is recorded anyway.
- Brand marks are unlicensed reproductions of registered trademarks, for mockup
  use only. **Read `NOTICE.md` before publishing any of this commercially.**
- Typefaces are Google Fonts, downloaded to `assets/fonts/` and committed so
  renders are deterministic and work offline.
