/**
 * One entry per uploaded before/after pair. `n` matches the pairN_*.jpg upload
 * and the beauty/assets/N-before.jpg / N-after.jpg crops. Each post gets its
 * own line so the seven read as a series on the profile, not seven copies.
 */
export const POSTS = [
  { n: 1, line: 'Soft, natural volume.' },
  { n: 2, line: 'Balanced from every angle.' },
  { n: 3, line: 'Subtle, refined, still you.' },
  { n: 4, line: 'Shape and definition.' },
  { n: 5, line: 'A fresh, plump finish.' },
  { n: 6, line: 'Hydrated, smooth, glossy.' },
  { n: 7, line: 'A fuller, sculpted pout.' },
];

export const BRAND = {
  treatment: 'Lip filler',
  name: 'Luxury Beauty by Cleo R',
  cta: 'Book a consultation',
};
