# Car spec posts

Ten art-directed social graphics about cars and their specifications, rendered
from code to **1080 × 1350** PNG — the 4:5 Instagram/Facebook feed size.


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
npm run build          # downloads the typefaces, then renders all ten
open out/index.html    # contact sheet
```

`npm run render` alone re-renders without re-fetching fonts. Pass ids or a
layout name to render a subset:

```bash
npm run render 03 07
npm run render blueprint
```

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
by a missing file.

To fill everything automatically instead, with a free key from
<https://unsplash.com/oauth/applications>:

```bash
UNSPLASH_ACCESS_KEY=xxxx npm run photos            # textures + car photos
UNSPLASH_ACCESS_KEY=xxxx npm run photos textures   # textures only
npm run render
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
src/data/cars.js        the ten posts: copy, specs, accent colour, layout
src/data/brands.js      manufacturer marks, hand-authored as SVG
src/data/textures.js    texture manifest — role, search terms, art direction
src/texture.js          texture resolver + grade / tint / duotone treatments
src/theme/tokens.js     palettes, type stacks, grain, colour helpers
src/theme/blocks.js     spec ledger / table / hero numeral
src/theme/motifs.js     moiré, halftone, dimension lines, streaks, barcode…
src/theme/silhouettes.js five side profiles, drawn to real dimensional ratios
src/layouts/*.js        one module per poster — render(car) → HTML
src/render.mjs          Chromium loop, size + typeface assertions
```

### Changing a poster

Copy, specifications and accent colour live in `src/data/cars.js`; edit there
and re-render. Structural changes belong in the matching `src/layouts/*.js`.

### Adding an eleventh

Add an entry to `CARS` with a new `layout` name, then create
`src/layouts/<name>.js` exporting `default function (car) { return '<html>' }`.
The renderer picks it up automatically.

## House rules

The set is deliberately not generic. Encoded in `src/theme/tokens.js` and held
across every layout:

- **One accent colour per poster.** Everything else sits on a neutral ramp —
  warm paper and concrete, or cool gunmetal.
- **No** purple→cyan gradients, glassmorphism, uniformly rounded corners, emoji,
  or drop-shadowed centred stacks.
- A display face paired with a technical face for spec data; extreme tracking on
  small caps, tight negative tracking on large display, weight and colour shifts
  inside a single line.
- Hairline rules instead of boxes, a real baseline grid, deliberate asymmetry,
  print grain over everything.

## Notes

- Specifications are published manufacturer figures — see `NOTICE.md`.
- Textures come from Unsplash under the Unsplash Licence: free, commercial use
  permitted, no attribution required. Credit is recorded anyway.
- Brand marks are unlicensed reproductions of registered trademarks, for mockup
  use only. **Read `NOTICE.md` before publishing any of this commercially.**
- Typefaces are Google Fonts, downloaded to `assets/fonts/` and committed so
  renders are deterministic and work offline.
