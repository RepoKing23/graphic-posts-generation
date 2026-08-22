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

## The car artwork

Every car is drawn from scratch, one drawing per car, in `src/theme/carart.js`.
They are not five archetypes stretched to fit ten cars — that is what made a
Wrangler come out looking like a limousine. Each entry is scaled from published
dimensions:

- the viewBox carries the car's real length:height ratio, so a Defender is tall
  and a Model S is low;
- wheelbase, overhangs and tyre diameter come from the real figures, so a 911
  sits back on its axles and an IONIQ 5 has almost no overhang;
- the bodywork carries the cues you would name the car by — the GT3 RS
  swan-neck wing, the Wrangler's seven-slot grille and tailgate spare, the
  Defender's alpine roof lights, the IONIQ's pixel lamps;
- wheels are per-brand: centre-lock, beadlock, turbine, aero disc, M-spoke.

`npm run preview` renders all ten on their own to `out/preview-cars.png`, which
is the fast way to judge the drawings without a poster layout on top of them.

Adding an eleventh car means adding an entry to `CARS` in that file keyed by the
car's slug. `ALIAS` maps the generic names (`sedan`, `suv`, `coupe`, …) onto
real cars for the background traffic in the spotlight layout.

## Type that survives the feed

These are 1080 x 1350 files read a few hundred pixels wide. `src/theme/blocks.js`
enforces a floor — 12px on tracked caps labels, 12.5px on unit strings, 0.74
alpha on anything set against its own ground — because unit strings like
`L supercharged V8` at 9.5px and half opacity are decoration, not information.
Tracking comes down as size comes down for the same reason.

Where type has to sit on artwork or a busy ground, knock the ground out rather
than dimming the type: the halftone poster clears its dot screen under the spec
ledger, and `carSVG` takes an `outline` so a white car still reads on white
paper.

## Adding photography

The drawings above are the default, so the set is complete out of the box.
There are two image slots, and dropping a file into either swaps a photograph
in instead:

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
and save it as `<slug>-cutout.png`. With no key set, or no network, the posters
fall back to the drawings and render exactly as committed.

## Layout of the code

```
src/data/cars.js        the ten posts: copy, specs, accent colour, layout
src/data/brands.js      manufacturer marks, hand-authored as SVG
src/theme/tokens.js     palettes, type stacks, grain, colour helpers
src/theme/blocks.js     spec ledger / table / hero numeral
src/theme/motifs.js     moiré, halftone, dimension lines, streaks, barcode…
src/theme/carart.js     ten per-car drawings, scaled from published dimensions
src/layouts/*.js        one module per poster — render(car) → HTML
src/render.mjs          Chromium loop, size + typeface assertions
```

### Changing a poster

Copy, specifications and accent colour live in `src/data/cars.js`; edit there
and re-render. Structural changes belong in the matching `src/layouts/*.js`.

### Adding an eleventh

Add an entry to `CARS` in `src/data/cars.js` with a new `layout` name, then
create `src/layouts/<name>.js` exporting
`default function (car) { return '<html>' }`. The renderer picks it up
automatically. Give the car a drawing in `src/theme/carart.js` keyed by its
slug, or it falls back to the nearest archetype.

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
- Small type is information, not texture. Nothing under the floor in
  `src/theme/blocks.js`, and no text left to fight a pattern it sits on.

## Notes

- Specifications are published manufacturer figures — see `NOTICE.md`.
- Brand marks are unlicensed reproductions of registered trademarks, for mockup
  use only. **Read `NOTICE.md` before publishing any of this commercially.**
- Typefaces are Google Fonts, downloaded to `assets/fonts/` and committed so
  renders are deterministic and work offline.
