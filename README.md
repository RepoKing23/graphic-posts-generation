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

The posters ship using hand-drawn vector silhouettes so they are complete out of
the box. There are two image slots, and dropping a file into either swaps it in:

| File | Used for |
|---|---|
| `assets/cars/<slug>.jpg` | rectangular photograph — panels, bands, backgrounds |
| `assets/cars/<slug>-cutout.png` | transparent cut-out — the hero car that floats free |

Slugs are the `slug` field in `src/data/cars.js` (e.g. `porsche-911-gt3-rs`).

To pull the rectangular slot from Unsplash automatically, get a free access key
at <https://unsplash.com/oauth/applications> and run:

```bash
UNSPLASH_ACCESS_KEY=xxxx npm run photos     # all ten
UNSPLASH_ACCESS_KEY=xxxx npm run photos 03  # just one
npm run render
```

Photographer credit lands in `assets/cars/credits.json`. The hero slot needs a
background-free cut-out, which stock search cannot provide — cut one yourself
and save it as `<slug>-cutout.png`.

## Layout of the code

```
src/data/cars.js        the ten posts: copy, specs, accent colour, layout
src/data/brands.js      manufacturer marks, hand-authored as SVG
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
- Brand marks are unlicensed reproductions of registered trademarks, for mockup
  use only. **Read `NOTICE.md` before publishing any of this commercially.**
- Typefaces are Google Fonts, downloaded to `assets/fonts/` and committed so
  renders are deterministic and work offline.
