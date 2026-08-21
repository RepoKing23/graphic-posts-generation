/**
 * Side-profile car silhouettes, hand-authored.
 *
 * These back the photo fallback: until a real photograph lands in
 * assets/cars/, the posters composite one of these. They are drawn to work
 * two ways — filled (mass, for the spotlight/duotone/halftone layouts) and
 * stroked (line, for the blueprint layout).
 *
 * Proportions are taken from real dimensional ratios rather than eyeballed,
 * which is the difference between a car and a clipart blob. With wheel
 * diameter D as the unit:
 *
 *   overall length  6.3 – 7.2 D      sill height      0.46 D
 *   roof height     1.95 D (coupe) … 2.45 D (off-roader)
 *   beltline        1.35 – 1.45 D    wheelbase        4.3 D
 *
 * Shared frame, so any profile drops into any slot: viewBox "0 0 1000 380",
 * D = 136 (r 68), ground y = 340, axle y = 272, axles at x = 210 / 790.
 */

const AXLE = { front: 210, rear: 790, cy: 272, r: 68 };

/** Body outline. Ends with two upward arcs that cut the wheel arches. */
const BODY = {
  // Fastback sports coupe — low roof, long nose, tail that tapers to a ducktail.
  coupe:
    'M 16 262 C 12 226 26 202 66 190 C 110 178 152 172 194 168 ' +
    'C 240 164 282 160 320 156 C 358 108 420 80 500 78 ' +
    'C 578 76 640 92 682 122 C 728 154 780 178 836 192 ' +
    'C 890 210 934 224 952 238 C 966 250 968 262 964 274 ' +
    'L 872 274 A 82 82 0 0 0 708 274 L 292 274 A 82 82 0 0 0 128 274 Z',

  // Three-box saloon — level roof, squared-off boot.
  sedan:
    'M 16 270 C 14 234 24 210 62 197 C 106 184 150 177 190 173 ' +
    'C 250 167 300 163 352 159 C 392 106 448 72 522 68 L 640 68 ' +
    'C 686 68 700 78 716 96 C 748 132 790 154 834 163 ' +
    'C 894 175 944 184 966 195 C 984 204 988 250 984 274 ' +
    'L 872 274 A 82 82 0 0 0 708 274 L 292 274 A 82 82 0 0 0 128 274 Z',

  // Crossover / tall SUV — upright glass, high bonnet, deep flanks.
  suv:
    'M 44 256 C 38 212 50 182 86 168 C 124 154 164 146 202 141 ' +
    'C 230 137 256 134 280 131 ' +
    'C 306 76 358 40 442 36 L 742 28 ' +
    'C 792 28 812 40 824 64 C 846 106 876 146 906 172 ' +
    'C 934 194 948 216 948 246 C 948 262 946 270 944 274 ' +
    'L 878 274 A 88 88 0 0 0 702 274 L 298 274 A 88 88 0 0 0 122 274 Z',

  // Body-on-frame off-roader — flat roof, vertical pillars, no tapers anywhere.
  offroad:
    'M 34 250 L 34 196 C 34 184 40 178 54 176 L 196 166 ' +
    'L 214 40 L 268 26 L 700 22 L 754 36 L 766 150 ' +
    'C 830 158 916 168 950 182 C 976 194 982 248 976 274 ' +
    'L 878 274 A 92 92 0 0 0 698 274 L 302 274 A 92 92 0 0 0 122 274 Z',

  // Hot hatch — short nose, steep tailgate, minimal rear overhang.
  hatch:
    'M 16 266 C 12 228 24 204 62 191 C 104 178 146 171 186 167 ' +
    'C 222 163 254 160 284 157 C 322 108 384 72 466 68 L 640 64 ' +
    'C 682 64 702 78 716 104 C 740 146 786 190 836 212 ' +
    'C 884 234 924 240 936 244 C 944 254 944 268 940 278 ' +
    'L 878 278 C 874 278 872 276 872 274 ' +
    'A 82 82 0 0 0 708 274 L 292 274 A 82 82 0 0 0 128 274 Z',
};

/** Glasshouse, drawn as one shape; pillars are painted back over it in body
 *  colour, which is how you get a believable DLO without drawing six windows. */
const GLASS = {
  coupe:   { d: 'M 370 152 C 404 114 452 92 508 90 C 574 88 626 102 664 128 C 690 146 712 158 730 164 L 370 164 Z',
             pillars: [{ x: 546, w: 13, y: 90, h: 74 }] },
  sedan:   { d: 'M 384 154 C 416 110 460 86 528 83 L 636 83 C 668 84 682 94 696 112 C 718 140 738 152 754 158 L 384 158 Z',
             pillars: [{ x: 556, w: 13, y: 84, h: 74 }, { x: 664, w: 10, y: 88, h: 70 }] },
  suv:     { d: 'M 332 130 C 358 86 402 52 450 48 L 736 42 C 764 44 778 58 788 82 C 800 108 814 126 828 140 L 332 136 Z',
             pillars: [{ x: 500, w: 15, y: 44, h: 92 }, { x: 656, w: 14, y: 44, h: 94 }] },
  offroad: { d: 'M 226 48 L 698 42 L 740 148 L 214 156 Z',
             pillars: [{ x: 400, w: 15, y: 40, h: 112 }, { x: 566, w: 15, y: 38, h: 114 }] },
  hatch:   { d: 'M 332 152 C 360 110 404 86 466 84 L 634 80 C 662 82 676 94 688 116 C 704 148 726 174 746 190 L 332 158 Z',
             pillars: [{ x: 498, w: 13, y: 82, h: 76 }, { x: 618, w: 12, y: 80, h: 82 }] },
};

/** A shoulder highlight following the flank — stops filled mode reading as
 *  a flat cut-out. One soft sweep, no gloss blobs. */
const SHEEN = {
  coupe:   'M 70 232 C 200 208 420 196 700 214 C 812 224 906 242 948 254 L 948 260 C 872 246 700 230 520 228 C 330 226 150 238 70 244 Z',
  sedan:   'M 70 238 C 210 214 430 202 700 218 C 830 226 930 244 966 254 L 966 260 C 880 248 700 234 520 232 C 330 230 150 242 70 250 Z',
  suv:     'M 88 218 C 226 192 434 180 698 196 C 818 204 908 222 938 232 L 938 240 C 862 226 698 212 520 210 C 336 208 168 222 88 230 Z',
  offroad: 'M 60 210 C 210 194 430 188 700 198 C 830 204 924 218 950 228 L 950 236 C 870 222 700 212 520 210 C 330 208 142 218 60 224 Z',
  hatch:   'M 66 228 C 206 204 424 192 690 210 C 776 220 848 240 890 258 L 886 264 C 826 244 690 228 510 226 C 322 224 146 234 66 242 Z',
};

/** Detail linework — door cuts, mirror, lamps, sill step. A flat body plus
 *  these few lines reads as a car; without them it reads as clipart. */
const DETAIL = {
  coupe: {
    cuts: ['M 372 164 C 374 200 374 240 372 272', 'M 660 168 C 664 204 664 240 662 272'],
    mirror: 'M 366 150 L 340 143 C 331 141 329 152 337 156 L 364 164 Z',
    lamps: ['M 34 208 C 62 200 92 196 118 194 L 122 216 C 96 218 64 222 40 228 Z',
            'M 902 220 L 946 230 C 952 242 951 252 948 256 L 900 244 Z'],
    sill: 'M 208 268 L 800 268',
    intake: 'M 30 244 C 58 238 86 236 108 236',
  },
  sedan: {
    cuts: ['M 386 158 C 388 196 388 238 386 272', 'M 556 158 C 558 198 558 238 556 272',
           'M 700 160 C 702 200 702 240 700 272'],
    mirror: 'M 380 152 L 352 145 C 343 143 341 154 349 158 L 378 166 Z',
    lamps: ['M 30 212 C 60 202 92 197 120 194 L 124 216 C 96 219 62 225 36 232 Z',
            'M 934 208 L 974 214 C 980 226 980 240 976 246 L 932 236 Z'],
    sill: 'M 206 268 L 802 268',
    intake: 'M 26 246 C 56 240 86 237 110 237',
  },
  suv: {
    cuts: ['M 334 136 C 336 180 336 230 334 272', 'M 500 136 C 502 184 502 232 500 272',
           'M 656 136 C 658 182 658 232 656 272'],
    mirror: 'M 330 128 L 300 120 C 291 118 289 130 297 134 L 328 142 Z',
    lamps: ['M 58 188 C 90 178 124 172 152 169 L 156 192 C 128 195 92 202 64 210 Z',
            'M 872 182 L 912 204 C 922 222 922 240 918 248 L 868 224 Z'],
    sill: 'M 214 266 L 792 266',
    intake: 'M 54 230 C 86 222 120 218 148 217',
    cladding: 'M 60 248 L 946 248 L 946 274 L 60 274 Z',
  },
  offroad: {
    cuts: ['M 400 154 L 400 272', 'M 566 152 L 566 272', 'M 214 156 L 214 272'],
    mirror: 'M 218 90 L 184 82 C 174 80 172 94 182 98 L 216 106 Z',
    lamps: ['M 46 182 L 128 176 L 130 206 L 48 212 Z',
            'M 920 190 L 962 196 C 968 210 968 228 964 236 L 918 224 Z'],
    sill: 'M 210 266 L 790 266',
    intake: 'M 40 230 L 132 226',
    cladding: 'M 40 244 L 968 244 L 968 274 L 40 274 Z',
  },
  hatch: {
    cuts: ['M 340 158 C 342 196 342 238 340 272', 'M 500 158 C 502 198 502 238 500 272',
           'M 622 162 C 628 200 632 238 634 270'],
    mirror: 'M 334 152 L 306 144 C 297 142 295 154 303 158 L 332 166 Z',
    lamps: ['M 30 212 C 60 202 92 197 120 194 L 124 216 C 96 219 62 225 36 232 Z',
            'M 792 196 C 830 222 878 238 918 244 L 914 262 C 868 256 818 238 776 210 Z'],
    sill: 'M 206 268 L 800 268',
    intake: 'M 26 246 C 56 240 86 237 110 237',
  },
};

/** clipPath ids must be unique per document — several cars can share a page. */
let UID = 0;

export const PROFILES = Object.keys(BODY);

/**
 * @param {string} profile  one of PROFILES
 * @param {object} opts
 *   fill    body colour; pass 'none' with a stroke for pure blueprint line-work
 *   stroke  outline colour, width  stroke weight in viewBox units
 *   glass   glasshouse colour, or 'none' to omit
 *   detail  colour of the door cuts / sill / intake hairlines
 *   lamp    lamp glyph colour
 *   sheen   shoulder highlight colour (filled mode only)
 *   shadow  contact shadow on the ground line
 */
export function carSVG(profile, {
  fill = '#111', stroke = 'none', width = 4,
  tyre = '#0B0B0C', rim = '#C9CCD1', glass = 'rgba(255,255,255,.15)',
  detail = null, lamp = null, sheen = null, shadow = false,
  className = '', style = '',
} = {}) {
  const key = BODY[profile] ? profile : 'coupe';
  const outlined = stroke !== 'none';
  const line = outlined
    ? `stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"` : '';
  const g = GLASS[key];
  const d = DETAIL[key];
  const uid = (UID += 1);

  // Sensible defaults: hairlines read light on a dark body, and in blueprint
  // mode everything collapses to the one stroke colour.
  const hair = detail || (outlined ? stroke : 'rgba(255,255,255,.20)');
  const lampFill = lamp || (outlined ? 'none' : 'rgba(255,255,255,.30)');
  const hairW = outlined ? width * 0.62 : 3;
  const stroked = (path, w = hairW, op = 1) =>
    `<path d="${path}" fill="none" stroke="${hair}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;

  const wheel = (cx) => `
    <circle cx="${cx}" cy="${AXLE.cy}" r="${AXLE.r}" fill="${tyre}" ${line}/>
    <circle cx="${cx}" cy="${AXLE.cy}" r="${AXLE.r - 26}" fill="${rim}" ${line}/>
    ${rim !== 'none' ? [0, 72, 144, 216, 288].map((a) => `
      <path d="M ${cx} ${AXLE.cy - 6} L ${cx - 8} ${AXLE.cy - 39} L ${cx + 8} ${AXLE.cy - 39} Z"
            fill="${tyre}" opacity=".45" transform="rotate(${a} ${cx} ${AXLE.cy})"/>`).join('') : ''}
    <circle cx="${cx}" cy="${AXLE.cy}" r="10" fill="${tyre}" ${line}/>`;

  return `<svg class="${className}" style="${style}" viewBox="0 0 1000 380"
      xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="xMidYMax meet">
    <defs><clipPath id="body-${uid}"><path d="${BODY[key]}"/></clipPath></defs>
    ${shadow ? `<ellipse cx="500" cy="344" rx="450" ry="15" fill="rgba(0,0,0,.28)"/>
                <ellipse cx="500" cy="341" rx="300" ry="9"  fill="rgba(0,0,0,.30)"/>` : ''}
    <path d="${BODY[key]}" fill="${fill}" ${line}/>
    ${d.cladding && !outlined ? `<path d="${d.cladding}" fill="rgba(0,0,0,.28)"
        clip-path="url(#body-${uid})"/>` : ''}
    ${glass !== 'none' ? `<path d="${g.d}" fill="${glass}"/>
        ${g.pillars.map((p) => `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="${fill}"/>`).join('')}` : ''}
    ${sheen ? `<path d="${SHEEN[key]}" fill="${sheen}" clip-path="url(#body-${uid})"/>` : ''}
    ${lampFill !== 'none' ? d.lamps.map((l) => `<path d="${l}" fill="${lampFill}"/>`).join('') : ''}
    ${d.cuts.map((c) => stroked(c, hairW, 0.7)).join('')}
    ${stroked(d.sill, hairW, 0.55)}
    ${stroked(d.intake, hairW * 1.6, 0.45)}
    <path d="${d.mirror}" fill="${outlined ? 'none' : fill}" ${line}/>
    ${wheel(AXLE.front)}
    ${wheel(AXLE.rear)}
  </svg>`;
}
