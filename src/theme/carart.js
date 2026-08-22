/**
 * Per-car side-profile illustrations, hand-authored — one drawing per car.
 *
 * The previous version of this file held five generic archetypes (coupe,
 * sedan, suv, offroad, hatch) shared across the ten posts. That is why a
 * Wrangler came out looking like a limousine and a GT3 RS like a bar of soap:
 * ten cars were being drawn with five outlines, all stretched into one box.
 *
 * Each car now has its own geometry, taken from published dimensions:
 *
 *   - the viewBox is the car's real length:height ratio, so a Defender is
 *     genuinely tall and a Model S genuinely low;
 *   - wheelbase, overhangs and tyre diameter are scaled from the real figures,
 *     so a 911 sits back on its axles and an IONIQ 5 has almost no overhang;
 *   - the bodywork carries the cues you would actually name the car by — the
 *     GT3 RS swan-neck wing, the Wrangler's seven-slot grille and tailgate
 *     spare, the Defender's alpine roof lights, the IONIQ's pixel lamps;
 *   - wheels are per-brand: centre-lock, beadlock, turbine, aero disc.
 *
 * Everything is authored in a 1000-wide space. `G` is the ground line, so the
 * body of a car is drawn between y=0 (roof) and y=G (tyre contact patch), and
 * `top` opens headroom above the roof for wings and roof racks.
 *
 * Conventions, so any car drops into any slot:
 *   cy   = G - r          axle centre
 *   arch = r + 8          wheel-arch cut, so the body bottom is a clean semi
 *   body path runs: front bumper -> over the roof -> rear bumper -> arches -> Z
 */

/* ── wheels ──────────────────────────────────────────────────────────────── */

/**
 * Rim faces. Five distinct designs, because a five-spoke pinwheel on every
 * car is the single clearest tell that the artwork is generic.
 */
function rimFace(cx, cy, r, style, { rim, tyre, accent }) {
  const R = r * 0.70;              // rim flange
  const hub = r * 0.15;
  const spoke = (a, w, inner, outer, fill) => {
    const rad = (d) => (d * Math.PI) / 180;
    const p = (ang, rr, off = 0) => {
      const x = cx + Math.cos(rad(ang)) * rr - Math.sin(rad(ang)) * off;
      const y = cy + Math.sin(rad(ang)) * rr + Math.cos(rad(ang)) * off;
      return `${x.toFixed(1)} ${y.toFixed(1)}`;
    };
    return `<path d="M ${p(a, inner, -w * 0.75)} L ${p(a, outer, -w / 2)} `
         + `L ${p(a, outer, w / 2)} L ${p(a, inner, w * 0.75)} Z" fill="${fill}"/>`;
  };
  const ring = (rr, w, fill, op = 1) =>
    `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="${fill}"
       stroke-width="${w}" opacity="${op}"/>`;

  const face = [];
  const dark = tyre;

  if (style === 'centerlock') {
    // Porsche: five slim forged spokes, deep dish, single centre nut.
    for (let i = 0; i < 5; i += 1) face.push(spoke(i * 72 - 90, r * 0.16, hub, R, rim));
    face.push(ring(R, r * 0.10, rim));
    face.push(`<circle cx="${cx}" cy="${cy}" r="${hub * 1.35}" fill="${rim}"/>`);
    face.push(`<circle cx="${cx}" cy="${cy}" r="${hub * 0.6}" fill="${accent || tyre}"/>`);
  } else if (style === 'mesh') {
    // AMG: ten thin spokes read as a mesh at poster size.
    for (let i = 0; i < 10; i += 1) face.push(spoke(i * 36 - 90, r * 0.075, hub * 1.2, R, rim));
    face.push(ring(R, r * 0.09, rim));
    face.push(`<circle cx="${cx}" cy="${cy}" r="${hub}" fill="${rim}"/>`);
  } else if (style === 'turbine') {
    // Tesla: swept aero blades, almost closed.
    for (let i = 0; i < 9; i += 1) {
      const a = i * 40 - 90;
      const rad = (d) => (d * Math.PI) / 180;
      face.push(`<path d="M ${cx + Math.cos(rad(a)) * hub} ${cy + Math.sin(rad(a)) * hub}
        Q ${cx + Math.cos(rad(a + 16)) * R * 0.7} ${cy + Math.sin(rad(a + 16)) * R * 0.7}
          ${cx + Math.cos(rad(a + 30)) * R} ${cy + Math.sin(rad(a + 30)) * R}
        L ${cx + Math.cos(rad(a + 2)) * R} ${cy + Math.sin(rad(a + 2)) * R} Z" fill="${rim}"/>`);
    }
    face.push(ring(R, r * 0.08, rim));
  } else if (style === 'aero') {
    // IONIQ: near-solid aero disc cut by narrow slots.
    face.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${rim}"/>`);
    for (let i = 0; i < 8; i += 1) face.push(spoke(i * 45 - 90, r * 0.11, R * 0.42, R * 0.88, dark));
    face.push(`<circle cx="${cx}" cy="${cy}" r="${hub * 1.4}" fill="${dark}" opacity=".55"/>`);
  } else if (style === 'beadlock') {
    // Jeep: wide spokes, visible bead ring and lug circle.
    face.push(ring(R * 1.02, r * 0.13, rim));
    for (let i = 0; i < 5; i += 1) face.push(spoke(i * 72 - 66, r * 0.24, hub, R * 0.86, rim));
    face.push(`<circle cx="${cx}" cy="${cy}" r="${hub * 1.7}" fill="${rim}"/>`);
    for (let i = 0; i < 5; i += 1) {
      const rad = ((i * 72 - 66) * Math.PI) / 180;
      face.push(`<circle cx="${cx + Math.cos(rad) * R * 1.02}" cy="${cy + Math.sin(rad) * R * 1.02}"
        r="${r * 0.05}" fill="${dark}" opacity=".7"/>`);
    }
  } else if (style === 'utility') {
    // Defender: five broad dished spokes, heavy centre cap.
    for (let i = 0; i < 5; i += 1) face.push(spoke(i * 72 - 90, r * 0.30, hub * 1.2, R * 0.92, rim));
    face.push(ring(R, r * 0.11, rim));
    face.push(`<circle cx="${cx}" cy="${cy}" r="${hub * 1.9}" fill="${rim}"/>`);
    face.push(`<circle cx="${cx}" cy="${cy}" r="${hub * 1.1}" fill="${dark}" opacity=".5"/>`);
  } else if (style === 'mspoke') {
    // BMW M: five double-Y spokes.
    for (let i = 0; i < 5; i += 1) {
      face.push(spoke(i * 72 - 90 - 9, r * 0.11, hub * 1.4, R, rim));
      face.push(spoke(i * 72 - 90 + 9, r * 0.11, hub * 1.4, R, rim));
    }
    face.push(ring(R, r * 0.09, rim));
    face.push(`<circle cx="${cx}" cy="${cy}" r="${hub * 1.5}" fill="${rim}"/>`);
  } else {
    // sport5 — the default: five broad spokes with a machined lip.
    for (let i = 0; i < 5; i += 1) face.push(spoke(i * 72 - 90, r * 0.20, hub, R * 0.94, rim));
    face.push(ring(R, r * 0.10, rim));
    face.push(`<circle cx="${cx}" cy="${cy}" r="${hub * 1.4}" fill="${rim}"/>`);
  }
  return face.join('');
}

function wheel(cx, cy, r, style, o) {
  const { tyre, rim, line, accent, brake } = o;
  if (rim === 'none') {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${tyre}" ${line}/>`;
  }
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${tyre}" ${line}/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.74}" fill="${tyre}" opacity=".55"/>
    ${brake ? `<circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="${brake}" opacity=".9"/>` : ''}
    ${rimFace(cx, cy, r, style, { rim, tyre, accent })}`;
}

/* ── the ten cars ────────────────────────────────────────────────────────── */

/**
 * arch is derived (r + 8) and the body bottom sits on the axle line, so the
 * wheel-arch cut-outs are exact semicircles whichever car is being drawn.
 */
const CARS = {
  /* Rear-engined and cab-forward: fender crowns high, roof and engine lid
     almost one line, then the swan-neck wing standing clear above it. */
  'porsche-911-gt3-rs': {
    G: 289, top: -56, r: 78, fx: 223, rx: 760, rim: 'centerlock',
    body:
      'M 16 190 C 8 168 10 136 22 118 C 42 92 78 76 124 68 '
      + 'C 172 60 226 56 272 58 C 292 59 304 53 312 41 '
      + 'C 340 16 384 5 444 4 L 574 4 '
      + 'C 628 6 672 13 704 25 C 754 42 806 46 852 48 '
      + 'C 906 50 946 62 966 82 C 982 100 990 136 988 174 '
      + 'C 986 198 980 211 966 211 '
      + 'L 841 211 A 86 86 0 0 0 669 211 L 309 211 A 86 86 0 0 0 137 211 Z',
    glass: {
      d: 'M 326 54 C 350 24 392 11 446 10 L 570 10 '
       + 'C 620 12 660 20 692 34 C 700 38 704 44 706 50 Z',
      pillars: [{ x: 556, w: 11, y: 10, h: 46 }],
    },
    sheen: 'M 46 150 C 190 116 430 100 700 112 C 812 118 908 132 962 146 L 962 158 '
         + 'C 884 142 700 126 500 124 C 302 122 132 136 46 158 Z',
    cuts: ['M 330 60 C 334 100 334 158 332 210', 'M 706 52 C 712 100 714 158 712 210'],
    sill: 'M 164 198 L 826 198',
    lamps: [{ d: 'M 44 106 C 66 94 92 86 116 82 L 120 102 C 98 106 74 114 56 126 Z' },
            { d: 'M 906 132 C 936 140 960 150 976 160 L 970 178 C 950 168 924 158 898 152 Z' }],
    mirror: 'M 324 58 L 292 48 C 281 45 279 60 290 64 L 322 74 Z',
    vents: ['M 154 96 C 194 88 232 84 268 82', 'M 806 88 C 848 96 886 108 916 120'],
    over: (c, f, a) => `
      <path d="M 700 -20 L 986 -34 L 986 -12 L 700 2 Z" fill="${f}"/>
      <path d="M 758 0 L 778 -18 L 792 -18 L 774 4 Z" fill="${f}"/>
      <path d="M 924 -10 L 944 -28 L 958 -28 L 940 -6 Z" fill="${f}"/>
      <path d="M 18 188 C 40 182 74 178 110 178 L 110 190 C 74 190 42 194 22 200 Z"
            fill="rgba(255,255,255,.14)"/>`,
  },

  /* Short, upright wide-body hatch: stubby overhangs, roof spoiler, three pipes. */
  'toyota-gr-corolla': {
    G: 336, top: -16, r: 73, fx: 207, rx: 806, rim: 'sport5',
    body:
      'M 20 230 C 12 206 12 172 24 152 C 40 130 68 118 106 110 '
      + 'C 150 102 200 97 244 93 C 264 91 276 85 284 73 '
      + 'C 308 38 350 12 412 8 C 492 4 578 6 656 14 '
      + 'C 696 18 722 32 738 58 C 768 104 826 148 884 176 '
      + 'C 916 192 940 210 952 230 C 962 246 964 258 958 263 '
      + 'L 888 263 A 81 81 0 0 0 726 263 L 288 263 A 81 81 0 0 0 126 263 Z',
    glass: {
      d: 'M 300 82 C 320 46 356 18 412 14 C 490 10 574 12 650 20 '
       + 'C 682 24 700 36 712 60 C 718 72 722 84 726 94 L 300 96 Z',
      pillars: [{ x: 456, w: 13, y: 13, h: 60 }, { x: 600, w: 12, y: 13, h: 66 }],
    },
    sheen: 'M 48 186 C 190 154 430 140 690 158 C 792 168 878 190 926 212 L 922 224 '
         + 'C 864 194 690 172 500 170 C 312 168 132 184 48 206 Z',
    cuts: ['M 302 92 C 306 140 306 200 304 262', 'M 480 84 C 484 140 484 202 482 262'],
    sill: 'M 152 250 L 862 250',
    lamps: [{ d: 'M 34 146 C 58 132 88 122 118 116 L 122 138 C 94 144 66 154 44 168 Z' },
            { d: 'M 826 154 C 858 170 886 190 906 210 L 890 226 C 870 206 842 186 812 170 Z' }],
    mirror: 'M 296 88 L 260 76 C 248 72 246 90 259 94 L 294 106 Z',
    vents: ['M 62 200 C 112 190 162 186 208 184', 'M 92 224 C 134 217 176 213 212 211'],
    over: (c, f, a) => `
      <path d="M 640 18 L 736 12 L 740 -2 L 634 4 Z" fill="${f}"/>
      <path d="M 128 216 L 296 208 L 296 226 L 130 234 Z" fill="rgba(0,0,0,.30)"/>
      <circle cx="908" cy="252" r="9" fill="${f}" opacity=".85"/>
      <circle cx="882" cy="254" r="9" fill="${f}" opacity=".85"/>
      <circle cx="856" cy="256" r="9" fill="${f}" opacity=".85"/>`,
  },

  /* Flat everything: vertical seven-slot grille, raked screen, square tub,
     33-inch tyres standing clear of the body, spare on the tailgate. */
  'jeep-wrangler-392': {
    G: 377, top: -12, r: 86, fx: 162, rx: 778, rim: 'beadlock',
    body:
      'M 22 254 L 22 126 C 22 116 28 112 40 111 '
      + 'L 272 101 L 284 97 L 384 22 L 872 16 '
      + 'C 906 16 918 24 920 42 L 924 279 '
      + 'L 874 279 A 96 96 0 0 0 682 279 L 258 279 A 96 96 0 0 0 66 279 Z',
    glass: {
      d: 'M 300 94 L 394 26 L 862 22 L 866 100 Z',
      pillars: [{ x: 430, w: 16, y: 20, h: 84 }, { x: 604, w: 16, y: 20, h: 84 }],
    },
    sheen: 'M 40 176 C 200 168 440 164 700 170 C 800 173 866 178 890 184 L 890 194 '
         + 'C 838 184 700 178 500 176 C 302 174 116 180 40 188 Z',
    cuts: ['M 430 104 L 430 278', 'M 604 104 L 604 278', 'M 296 100 L 296 278'],
    sill: 'M 100 266 L 840 266',
    lamps: [{ d: 'M 46 152 A 22 22 0 1 1 46 196 A 22 22 0 1 1 46 152 Z', round: true },
            { d: 'M 878 156 L 900 158 L 900 196 L 878 194 Z' }],
    mirror: 'M 348 52 L 306 40 C 293 36 291 58 306 62 L 346 74 Z',
    vents: ['M 56 168 L 156 164', 'M 56 188 L 156 184'],
    clad: 'M 20 244 L 910 244 L 910 292 L 20 292 Z',
    over: (c, f, a) => `
      <path d="M 2 126 L 26 124 L 26 222 L 2 218 Z" fill="${f}"/>
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${5 + i * 2.9}" y="134" width="1.7"
         height="76" fill="${a}" opacity=".95"/>`).join('')}
      <circle cx="946" cy="150" r="54" fill="${f}"/>
      <circle cx="946" cy="150" r="31" fill="rgba(255,255,255,.14)"/>
      <path d="M 902 232 L 972 232 L 972 268 L 902 268 Z" fill="${f}"/>
      <rect x="290" y="102" width="9" height="30" fill="${f}"/>
      <rect x="290" y="164" width="9" height="30" fill="${f}"/>
      <rect x="422" y="104" width="8" height="26" fill="${f}"/>
      <rect x="422" y="166" width="8" height="26" fill="${f}"/>`,
  },

  /* Three metres of wheelbase, almost no overhang, clamshell bonnet and a
     straight-edge tail; lamps are pixel blocks, wheels are aero discs. */
  'hyundai-ioniq-5-n': {
    G: 336, top: -12, r: 77, fx: 179, rx: 815, rim: 'aero',
    body:
      'M 20 230 C 12 206 14 168 26 148 C 36 132 58 122 90 117 '
      + 'L 232 104 C 252 102 264 96 270 84 '
      + 'C 292 44 336 16 396 10 L 748 6 '
      + 'C 788 8 810 22 822 52 C 836 96 858 140 880 172 '
      + 'C 900 200 924 222 938 240 C 948 252 950 259 944 259 '
      + 'L 900 259 A 85 85 0 0 0 730 259 L 264 259 A 85 85 0 0 0 94 259 Z',
    glass: {
      d: 'M 286 94 C 306 52 344 22 398 18 L 740 12 '
       + 'C 772 14 790 28 800 56 C 806 76 810 92 814 106 L 286 108 Z',
      pillars: [{ x: 462, w: 14, y: 16, h: 84 }, { x: 620, w: 13, y: 14, h: 88 }],
    },
    sheen: 'M 44 182 C 200 150 450 136 710 154 C 812 164 898 186 944 208 L 940 220 '
         + 'C 882 190 710 168 510 166 C 312 164 130 180 44 202 Z',
    cuts: ['M 288 104 C 292 150 292 206 290 258', 'M 460 96 C 464 148 464 206 462 258'],
    sill: 'M 132 248 L 880 248',
    lamps: [{ pixel: [26, 126, 6, 4, 4] }, { pixel: [852, 176, 6, 4, 4] }],
    mirror: 'M 282 100 L 244 88 C 232 84 230 102 243 106 L 280 118 Z',
    vents: ['M 40 198 L 152 192', 'M 62 218 L 172 212'],
    clad: 'M 16 216 L 944 216 L 944 262 L 16 262 Z',
    over: (c, f, a) => `
      <path d="M 664 10 L 758 4 L 764 -8 L 658 -2 Z" fill="${f}"/>
      <path d="M 90 117 L 236 104 L 236 112 L 92 125 Z" fill="rgba(255,255,255,.16)"/>
      <rect x="352" y="112" width="26" height="6" rx="3" fill="rgba(255,255,255,.22)"/>
      <rect x="530" y="106" width="26" height="6" rx="3" fill="rgba(255,255,255,.22)"/>`,
  },

  /* Long-roofed FL5: low nose, wide arches, the wing on its own uprights. */
  'honda-civic-type-r': {
    G: 306, top: -32, r: 70, fx: 201, rx: 796, rim: 'sport5',
    body:
      'M 18 210 C 10 186 10 154 22 132 C 38 110 68 98 106 90 '
      + 'C 152 82 206 77 250 74 C 268 72 280 66 288 54 '
      + 'C 312 24 354 6 414 5 C 496 3 588 6 664 14 '
      + 'C 702 18 726 30 742 56 C 772 100 828 142 884 168 '
      + 'C 916 183 942 200 954 216 C 964 228 966 236 960 236 '
      + 'L 874 236 A 78 78 0 0 0 718 236 L 279 236 A 78 78 0 0 0 123 236 Z',
    glass: {
      d: 'M 304 64 C 324 32 360 12 414 11 C 496 9 586 12 658 20 '
       + 'C 690 24 710 34 722 56 C 728 66 732 70 736 78 L 304 78 Z',
      pillars: [{ x: 452, w: 13, y: 10, h: 58 }, { x: 604, w: 12, y: 12, h: 60 }],
    },
    sheen: 'M 44 166 C 190 134 430 120 690 138 C 792 148 876 168 924 190 L 920 202 '
         + 'C 862 174 690 152 500 150 C 312 148 130 162 44 184 Z',
    cuts: ['M 306 74 C 310 122 310 182 308 235', 'M 472 66 C 476 120 476 182 474 235'],
    sill: 'M 148 226 L 856 226',
    lamps: [{ d: 'M 30 132 C 54 118 84 108 114 102 L 118 122 C 90 128 62 138 40 152 Z' },
            { d: 'M 824 148 C 856 164 884 182 906 202 L 890 218 C 868 198 840 180 810 164 Z' }],
    mirror: 'M 300 70 L 264 58 C 252 54 250 72 263 76 L 298 88 Z',
    vents: ['M 48 178 C 102 168 154 164 202 162', 'M 78 200 C 124 192 170 188 208 186'],
    over: (c, f, a) => `
      <path d="M 656 -6 L 926 -20 L 926 -2 L 656 12 Z" fill="${f}"/>
      <path d="M 698 10 L 718 -6 L 730 -6 L 712 14 Z" fill="${f}"/>
      <path d="M 874 -2 L 894 -18 L 906 -18 L 888 2 Z" fill="${f}"/>
      <path d="M 116 192 L 268 186 L 268 202 L 118 208 Z" fill="rgba(0,0,0,.30)"/>
      <circle cx="900" cy="226" r="8" fill="${f}" opacity=".85"/>
      <circle cx="876" cy="228" r="8" fill="${f}" opacity=".85"/>
      <circle cx="852" cy="230" r="8" fill="${f}" opacity=".85"/>`,
  },

  /* A three-box saloon that stays a three-box: long bonnet, flat boot deck,
     Hofmeister kink at the base of the rear glass, quad pipes. */
  'bmw-m5': {
    G: 296, top: -8, r: 72, fx: 186, rx: 774, rim: 'mspoke',
    body:
      'M 16 204 C 10 180 10 142 20 124 C 28 110 44 102 68 97 '
      + 'C 130 88 222 84 300 80 C 318 79 328 74 334 64 '
      + 'C 356 34 396 10 460 8 L 636 6 '
      + 'C 676 8 700 18 716 38 C 736 62 760 74 790 78 '
      + 'C 850 82 916 86 954 92 C 974 96 986 112 988 142 '
      + 'C 990 174 990 200 988 224 '
      + 'L 854 224 A 80 80 0 0 0 694 224 L 266 224 A 80 80 0 0 0 106 224 Z',
    glass: {
      d: 'M 344 72 C 362 38 400 14 460 12 L 630 11 '
       + 'C 666 13 688 24 702 46 C 710 58 714 66 716 74 Z',
      pillars: [{ x: 500, w: 12, y: 11, h: 68 }, { x: 622, w: 11, y: 11, h: 68 }],
    },
    sheen: 'M 44 156 C 200 126 460 112 730 128 C 848 136 942 152 984 168 L 982 180 '
         + 'C 914 156 730 138 520 136 C 312 134 132 150 44 172 Z',
    cuts: ['M 346 82 C 350 128 350 180 348 223', 'M 502 78 C 506 128 506 182 504 223',
           'M 706 84 C 710 132 710 184 708 223'],
    sill: 'M 142 214 L 852 214',
    lamps: [{ d: 'M 28 126 C 52 114 82 106 112 100 L 116 118 C 88 124 60 132 38 144 Z' },
            { d: 'M 918 116 C 946 122 968 130 984 138 L 980 158 C 960 150 934 142 908 138 Z' }],
    mirror: 'M 340 74 L 302 62 C 290 58 288 76 301 80 L 338 92 Z',
    vents: ['M 44 176 C 104 166 160 162 210 160', 'M 70 198 C 122 190 170 186 212 184'],
    over: (c, f, a) => `
      <path d="M 702 46 L 724 44 L 716 78 L 700 78 Z" fill="${f}"/>
      <rect x="896" y="212" width="24" height="9" rx="4" fill="${f}" opacity=".9"/>
      <rect x="928" y="211" width="24" height="9" rx="4" fill="${f}" opacity=".9"/>
      <path d="M 104 186 L 244 180 L 244 194 L 106 200 Z" fill="rgba(0,0,0,.26)"/>`,
  },

  /* Cab-rearward 2+2: an enormous bonnet, a short roof set well back, and a
     ducktail over a wide rear haunch. */
  'mercedes-amg-gt-63': {
    G: 286, top: -10, r: 76, fx: 212, rx: 783, rim: 'mesh',
    body:
      'M 14 202 C 6 178 8 144 22 124 C 40 104 72 90 116 82 '
      + 'C 184 71 268 65 330 62 C 350 61 362 55 370 43 '
      + 'C 392 20 430 6 480 5 L 604 5 '
      + 'C 652 7 686 20 712 44 C 748 76 796 96 848 106 '
      + 'C 902 116 944 124 964 136 C 980 146 988 164 988 188 '
      + 'C 988 200 986 210 982 210 '
      + 'L 867 210 A 84 84 0 0 0 699 210 L 296 210 A 84 84 0 0 0 128 210 Z',
    glass: {
      d: 'M 384 58 C 402 30 436 12 482 11 L 598 11 '
       + 'C 638 13 668 26 690 48 C 700 58 706 66 710 74 Z',
      pillars: [{ x: 542, w: 12, y: 11, h: 54 }],
    },
    sheen: 'M 40 150 C 200 120 470 104 740 120 C 858 128 946 146 982 162 L 980 174 '
         + 'C 912 150 740 132 530 130 C 322 128 130 144 40 168 Z',
    cuts: ['M 386 66 C 390 112 390 166 388 209', 'M 704 62 C 710 110 712 164 710 209'],
    sill: 'M 158 200 L 846 200',
    lamps: [{ d: 'M 26 122 C 54 106 90 94 126 88 L 130 108 C 96 114 62 126 38 142 Z' },
            { d: 'M 906 132 C 942 142 968 152 984 162 L 978 180 C 956 168 926 158 898 152 Z' }],
    mirror: 'M 380 62 L 342 50 C 330 46 328 64 341 68 L 378 80 Z',
    vents: ['M 150 106 C 214 96 278 90 332 86', 'M 60 176 C 118 166 174 162 222 160'],
    over: (c, f, a) => `
      <path d="M 846 100 C 900 110 946 122 980 136 L 976 150
               C 940 134 892 122 838 114 Z" fill="${f}" opacity=".85"/>
      <rect x="880" y="198" width="26" height="9" rx="4" fill="${f}" opacity=".85"/>
      <rect x="916" y="197" width="26" height="9" rx="4" fill="${f}" opacity=".85"/>
      <path d="M 140 104 C 206 94 272 88 328 84 L 328 92 C 270 96 206 102 142 114 Z"
            fill="rgba(255,255,255,.13)"/>`,
  },

  /* Fastback pony car: domed bonnet, heavy sail panel, upright tri-bar tail. */
  'ford-mustang-dark-horse': {
    G: 291, top: -12, r: 73, fx: 183, rx: 748, rim: 'sport5',
    body:
      'M 16 204 C 9 180 10 146 24 126 C 44 106 78 94 118 87 '
      + 'C 180 78 254 72 310 68 C 330 67 344 61 352 49 '
      + 'C 376 22 416 6 472 5 L 604 5 '
      + 'C 648 7 674 20 696 46 C 724 80 762 112 806 134 '
      + 'C 856 158 908 172 944 180 C 966 185 980 196 984 214 '
      + 'C 986 220 986 224 984 218 '
      + 'L 828 218 A 81 81 0 0 0 666 218 L 264 218 A 81 81 0 0 0 102 218 Z',
    glass: {
      d: 'M 366 62 C 388 32 422 12 472 11 L 598 11 '
       + 'C 632 13 656 24 674 48 C 690 68 708 84 726 96 L 366 82 Z',
      pillars: [{ x: 520, w: 13, y: 11, h: 62 }],
    },
    sheen: 'M 44 156 C 200 126 460 110 720 128 C 830 136 916 158 960 180 L 956 192 '
         + 'C 896 164 720 142 512 140 C 306 138 130 152 44 176 Z',
    cuts: ['M 368 78 C 372 122 372 174 370 217', 'M 690 70 C 696 118 698 172 696 217'],
    sill: 'M 140 208 L 812 208',
    lamps: [{ d: 'M 26 124 C 52 110 84 100 118 94 L 122 114 C 90 120 60 130 36 144 Z' },
            { bars: [978, 150, 26, 12, 3] }],
    mirror: 'M 362 66 L 324 54 C 312 50 310 68 323 72 L 360 84 Z',
    vents: ['M 152 96 C 214 88 268 84 312 82', 'M 46 172 C 106 162 160 158 204 156'],
    over: (c, f, a) => `
      <path d="M 690 8 L 790 0 L 796 -12 L 684 -6 Z" fill="${f}" opacity=".9"/>
      <path d="M 150 92 C 212 82 266 78 310 76 L 310 84 C 266 86 212 92 154 102 Z"
            fill="rgba(255,255,255,.14)"/>
      <rect x="878" y="206" width="30" height="10" rx="4" fill="${f}" opacity=".9"/>
      <rect x="916" y="205" width="30" height="10" rx="4" fill="${f}" opacity=".9"/>`,
  },

  /* Upright, square, alpine roof lights over the rear glass, side-hinged
     tailgate carrying the spare, and daylight under the sills. */
  'land-rover-defender-110-v8': {
    G: 392, top: -14, r: 79, fx: 177, rx: 779, rim: 'utility',
    body:
      'M 20 262 L 20 138 C 20 128 26 124 38 123 '
      + 'L 276 113 L 288 108 L 372 30 L 878 24 '
      + 'C 914 24 926 32 928 50 L 932 292 '
      + 'L 866 292 A 87 87 0 0 0 692 292 L 264 292 A 87 87 0 0 0 90 292 Z',
    glass: {
      d: 'M 304 106 L 380 34 L 868 30 L 872 112 Z',
      pillars: [{ x: 434, w: 16, y: 30, h: 84 }, { x: 604, w: 16, y: 28, h: 86 }],
    },
    sheen: 'M 40 190 C 200 182 440 178 700 184 C 802 187 870 192 894 198 L 894 208 '
         + 'C 842 198 700 192 500 190 C 302 188 116 194 40 202 Z',
    cuts: ['M 434 114 L 434 291', 'M 604 112 L 604 291', 'M 300 110 L 300 291'],
    sill: 'M 104 278 L 848 278',
    lamps: [{ d: 'M 44 164 A 21 21 0 1 1 44 206 A 21 21 0 1 1 44 164 Z', round: true },
            { d: 'M 884 162 L 906 164 L 906 206 L 884 204 Z' }],
    mirror: 'M 340 62 L 298 50 C 285 46 283 68 298 72 L 338 84 Z',
    vents: ['M 48 178 L 152 174', 'M 48 200 L 152 196'],
    clad: 'M 18 258 L 914 258 L 914 300 L 18 300 Z',
    over: (c, f, a) => `
      <path d="M 612 28 L 866 26 L 868 62 L 612 64 Z" fill="rgba(255,255,255,.28)"/>
      <rect x="700" y="27" width="10" height="36" fill="${f}"/>
      <rect x="788" y="27" width="10" height="36" fill="${f}"/>
      <path d="M 276 113 L 288 108 L 288 100 L 276 105 Z" fill="rgba(255,255,255,.2)"/>
      <circle cx="946" cy="176" r="50" fill="${f}"/>
      <circle cx="946" cy="176" r="28" fill="rgba(255,255,255,.14)"/>
      <path d="M 908 240 L 976 240 L 976 280 L 908 280 Z" fill="${f}"/>
      <rect x="294" y="112" width="9" height="30" fill="${f}"/>
      <rect x="294" y="176" width="9" height="30" fill="${f}"/>
      <path d="M 26 150 L 152 145 L 152 154 L 26 159 Z" fill="rgba(255,255,255,.16)"/>`,
  },

  /* One continuous arc from the windscreen base to the tail, a blunt nose
     with no grille at all, flush handles and no exhaust. */
  'tesla-model-s-plaid': {
    G: 285, top: -8, r: 72, fx: 184, rx: 774, rim: 'turbine',
    body:
      'M 14 200 C 8 176 10 142 24 122 C 42 102 78 90 120 85 '
      + 'C 178 78 248 74 300 71 C 316 70 326 65 332 55 '
      + 'C 354 28 398 8 466 6 L 616 5 '
      + 'C 666 7 700 20 728 46 C 776 88 838 116 896 132 '
      + 'C 938 143 966 150 980 158 C 990 164 992 178 992 196 '
      + 'C 992 210 990 218 986 220 '
      + 'L 854 220 A 80 80 0 0 0 694 220 L 264 220 A 80 80 0 0 0 104 220 Z',
    glass: {
      d: 'M 348 70 C 368 34 406 12 466 10 L 612 9 '
       + 'C 652 11 682 24 706 48 C 736 78 776 102 812 118 L 348 90 Z',
      pillars: [{ x: 502, w: 12, y: 10, h: 66 }, { x: 646, w: 11, y: 12, h: 80 }],
    },
    sheen: 'M 40 152 C 200 122 460 106 730 122 C 852 130 946 152 986 172 L 984 184 '
         + 'C 916 158 730 136 520 134 C 312 132 130 148 40 170 Z',
    cuts: ['M 350 84 C 354 128 354 178 352 219', 'M 504 76 C 508 126 508 180 506 219',
           'M 700 88 C 706 132 708 180 706 219'],
    sill: 'M 140 210 L 852 210',
    lamps: [{ d: 'M 24 124 C 50 110 82 100 116 94 L 118 110 C 88 116 56 128 32 142 Z' },
            { d: 'M 916 138 C 950 148 974 158 988 168 L 982 182 C 962 172 934 162 906 156 Z' }],
    mirror: 'M 344 68 L 306 56 C 294 52 292 70 305 74 L 342 86 Z',
    vents: ['M 34 178 C 96 168 152 164 202 162'],
    over: (c, f, a) => `
      <rect x="386" y="96" width="30" height="6" rx="3" fill="rgba(255,255,255,.24)"/>
      <rect x="548" y="90" width="30" height="6" rx="3" fill="rgba(255,255,255,.24)"/>
      <path d="M 14 196 C 34 190 66 186 106 186 L 106 198 C 66 198 34 202 16 208 Z"
            fill="rgba(255,255,255,.12)"/>`,
  },
};

/* Background-fleet aliases: the spotlight layout fills the lot with traffic. */
const ALIAS = {
  coupe: 'mercedes-amg-gt-63',
  sedan: 'bmw-m5',
  suv: 'hyundai-ioniq-5-n',
  offroad: 'land-rover-defender-110-v8',
  hatch: 'honda-civic-type-r',
};

export const CAR_KEYS = Object.keys(CARS);

/**
 * Slug first, then the car's archetype (`profile` in src/data/cars.js), then
 * an archetype alias. An eleventh car with no drawing of its own still gets
 * something in the right class rather than whatever happens to be first.
 */
export const resolve = (key, fallback) =>
  CARS[key] || CARS[ALIAS[key]] || CARS[fallback] || CARS[ALIAS[fallback]] || CARS['bmw-m5'];

/** clipPath ids must be unique per document — several cars share a page. */
let UID = 0;

/**
 * @param {string} key   a car slug from src/data/cars.js, or an archetype alias
 * @param {object} opts
 *   fill    body colour; pass 'none' with a stroke for pure blueprint line-work
 *   stroke  outline colour, width  stroke weight in viewBox units
 *   glass   glasshouse colour, or 'none' to omit
 *   detail  colour of the door cuts / sill / vent hairlines
 *   lamp    lamp glyph colour
 *   sheen   shoulder highlight colour (filled mode only)
 *   shadow  contact shadow on the ground line
 *   fallback archetype to use when `key` has no drawing of its own
 *   outline a keyline drawn over the filled body. Unlike `stroke` this does
 *           not switch the drawing into blueprint mode — it is what keeps a
 *           white car legible on white paper.
 */
export function carSVG(key, {
  fill = '#111', stroke = 'none', width = 4,
  tyre = '#0B0B0C', rim = '#C9CCD1', glass = 'rgba(255,255,255,.15)',
  detail = null, lamp = null, sheen = null, shadow = false, accent = null,
  outline = null, outlineWidth = 3, fallback = null,
  className = '', style = '',
} = {}) {
  const c = resolve(key, fallback);
  const outlined = stroke !== 'none';
  const line = outlined
    ? `stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"` : '';
  const uid = (UID += 1);
  const cy = c.G - c.r;
  const H = c.G - c.top + 22;              // headroom above, shadow below

  const hair = detail || (outlined ? stroke : 'rgba(255,255,255,.22)');
  const lampFill = lamp || (outlined ? 'none' : 'rgba(255,255,255,.32)');
  const hairW = outlined ? width * 0.62 : 3;
  const stroked = (path, w = hairW, op = 1) =>
    `<path d="${path}" fill="none" stroke="${hair}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;

  // Lamps come in three flavours so a Wrangler gets round units, an IONIQ gets
  // its pixel blocks and a Mustang its tri-bars, instead of one generic sliver.
  const lampShape = (l) => {
    if (l.pixel) {
      const [x, y, s, cols, rows] = l.pixel;
      const cells = [];
      for (let r = 0; r < rows; r += 1) {
        for (let q = 0; q < cols; q += 1) {
          if ((r === 0 || r === rows - 1) && (q === 0 || q === cols - 1)) continue;
          cells.push(`<rect x="${x + q * (s + 2.4)}" y="${y + r * (s + 2.4)}"
            width="${s}" height="${s}" fill="${lampFill}"/>`);
        }
      }
      return cells.join('');
    }
    if (l.bars) {
      const [x, y, w, h, n] = l.bars;
      return Array.from({ length: n }, (_, i) =>
        `<rect x="${x - w}" y="${y + i * (h + 5)}" width="${w}" height="${h}"
           rx="2" fill="${lampFill}"/>`).join('');
    }
    return `<path d="${l.d}" fill="${lampFill}" ${outlined ? line : ''}/>`;
  };

  return `<svg class="${className}" style="${style}" viewBox="0 ${c.top} 1000 ${H}"
      xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="xMidYMax meet">
    <defs><clipPath id="body-${uid}"><path d="${c.body}"/></clipPath></defs>
    ${shadow ? `<ellipse cx="500" cy="${c.G + 6}" rx="440" ry="14" fill="rgba(0,0,0,.26)"/>
                <ellipse cx="500" cy="${c.G + 3}" rx="290" ry="8"  fill="rgba(0,0,0,.28)"/>` : ''}
    <path d="${c.body}" fill="${fill}" ${line}/>
    ${glass !== 'none' ? `<path d="${c.glass.d}" fill="${glass}"/>
        ${c.glass.pillars.map((p) => `<rect x="${p.x}" y="${p.y}" width="${p.w}"
           height="${p.h}" fill="${fill}"/>`).join('')}` : ''}
    ${sheen && c.sheen ? `<path d="${c.sheen}" fill="${sheen}" clip-path="url(#body-${uid})"/>` : ''}
    ${!outlined && c.clad ? `<path d="${c.clad}" fill="rgba(0,0,0,.28)"
        clip-path="url(#body-${uid})"/>` : ''}
    ${c.over ? `<g ${outlined ? `fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"` : ''}>${c.over(c, outlined ? 'none' : fill, accent || hair)}</g>` : ''}
    ${lampFill !== 'none' ? `<g clip-path="url(#body-${uid})">${c.lamps.map(lampShape).join('')}</g>` : ''}
    ${c.cuts.map((p) => stroked(p, hairW, 0.66)).join('')}
    ${stroked(c.sill, hairW, 0.5)}
    ${(c.vents || []).map((v) => stroked(v, hairW * 1.4, 0.42)).join('')}
    <path d="${c.mirror}" fill="${outlined ? 'none' : fill}" ${line}/>
    ${wheel(c.fx, cy, c.r, c.rim, { tyre, rim, line, accent, brake: null })}
    ${wheel(c.rx, cy, c.r, c.rim, { tyre, rim, line, accent, brake: null })}
    ${outline ? `<path d="${c.body}" fill="none" stroke="${outline}"
        stroke-width="${outlineWidth}" stroke-linejoin="round"/>` : ''}
  </svg>`;
}
