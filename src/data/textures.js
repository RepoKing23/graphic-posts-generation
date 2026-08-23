/**
 * Texture manifest.
 *
 * Photography supplies the world the cars sit in — night car parks, mud, light
 * trails, studio sweeps, macro detail. The identifiable car itself stays vector
 * (see src/theme/silhouettes.js), which is why every texture here is generic
 * and de-branded: all of them are cleanly licensable from any stock library,
 * and none of them has to be a particular model.
 *
 * Each entry carries the search terms and the selection criteria used to pick
 * it, so the shot list in SHOTLIST.md stays in sync with the code and a
 * replacement can be sourced later without guessing what the slot needs.
 *
 *   id        file is assets/textures/<id>.jpg
 *   role      what the poster does with it
 *   query     search terms
 *   want      what a good candidate looks like — the art direction
 *   aspect    'landscape' | 'portrait' | 'square' — what the slot needs
 */
export const TEXTURES = {
  'detail-headlight': {
    role: 'Macro crop, triptych panel 1',
    query: 'car headlight close up macro',
    want: 'Tight on the lamp cluster. Hard specular highlights, dark surround, no plate or badge in frame.',
    aspect: 'portrait',
  },
  'detail-wheel': {
    role: 'Macro crop, triptych panel 2',
    query: 'car alloy wheel rim close up',
    want: 'Spokes filling the frame, tyre wall visible along one edge. No brand centre-cap.',
    aspect: 'portrait',
  },
  'detail-grille': {
    role: 'Macro crop, triptych panel 3',
    query: 'car grille air intake close up',
    want: 'Mesh or slat pattern, raking light. Nothing that reads as a manufacturer badge.',
    aspect: 'portrait',
  },
  'studio-sweep': {
    role: 'Ground and backdrop behind a hero car',
    query: 'empty photography studio cyclorama backdrop',
    want: 'Seamless sweep, light falling off to the corners, no props, no people. Neutral grey or warm white.',
    aspect: 'landscape',
  },
  'terrain-mud': {
    role: 'Fills the Jeep slats; stock for the Land Rover riso plates',
    query: 'mud tracks off road trail texture',
    want: 'Churned wet ground with tyre ruts. Strong tonal range — it has to survive being tinted flat red.',
    aspect: 'landscape',
  },
  'night-carpark': {
    role: 'The real dimmed fleet behind the spotlit car',
    query: 'car park at night rows of parked cars',
    want: 'Rows receding into the dark, overhead lighting. Generic saloons and SUVs; no readable badges or plates.',
    aspect: 'landscape',
  },
  'wet-asphalt': {
    role: 'Ground plane under the spotlit car',
    query: 'wet asphalt reflection night',
    want: 'Sheen and puddle reflection, kerb-free. Dark enough to sit under white type.',
    aspect: 'landscape',
  },
  'mountain-mist': {
    role: 'Behind the paper massif on the terrain poster',
    query: 'misty mountain ridges fog layers',
    want: 'Receding ridgelines separated by haze. High key, almost monochrome — it sits behind pale paper shapes.',
    aspect: 'landscape',
  },
  'asphalt': {
    role: 'Surface of the road ribbon',
    query: 'asphalt road surface texture from above',
    want: 'Flat-lit aggregate, no markings, no shadows. Shot square on so it tiles into a perspective slab.',
    aspect: 'landscape',
  },
  'carbon-weave': {
    role: 'Ground under the blueprint graph paper',
    query: 'carbon fibre weave texture',
    want: 'Twill weave, low sheen, shot flat. Used at very low opacity, so pattern matters more than colour.',
    aspect: 'landscape',
  },
  'paper-fibre': {
    role: 'Stock for the Swiss spec slab and the Tesla docket',
    query: 'white paper texture fibres close up',
    want: 'Uncoated stock, visible fibre, even lighting, no fold or shadow.',
    aspect: 'landscape',
  },
  'city-bokeh-night': {
    role: 'Night half of the duotone seam',
    query: 'city lights bokeh night out of focus',
    want: 'Wholly defocused. Points of light on black, no legible signage or architecture.',
    aspect: 'portrait',
  },
  'brushed-metal': {
    role: 'Brass half of the duotone seam',
    query: 'brushed metal surface texture',
    want: 'Fine directional grain, raking light. Neutral — it gets tinted to brass, so it must not arrive blue.',
    aspect: 'portrait',
  },
  'light-trails': {
    role: 'Long-exposure bands on the motion poster',
    query: 'long exposure traffic light trails night',
    want: 'Horizontal streaks across a dark frame. Warm trails preferred; no readable buildings.',
    aspect: 'landscape',
  },
};

export const TEXTURE_IDS = Object.keys(TEXTURES);
