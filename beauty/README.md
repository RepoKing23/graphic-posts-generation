# Luxury Beauty by Cleo R: Google Business Profile posts

Seven before/after posts at **1200 × 900** (4:3, the ratio Google Business
Profile crops post images to). They're built from the `pair*.jpg` uploads in the
repo root.

```bash
npm run beauty            # extract logo + photos, then render all seven
node beauty/src/render.mjs 3 5   # re-render just pairs 3 and 5
```

- `src/extract.py` cuts the logo (lockup and LB monogram, white on transparent)
  and each BEFORE/AFTER photo out of the uploaded composites into `assets/`.
- `src/posts.js` holds the per-post line and brand copy (treatment name, CTA).
- `src/page.mjs` is the layout: black ground, white serif, rose-gold accent,
  logo lockup in the header and the LB monogram watermarked on every photo.
- Output goes to `out/gbp-NN.png`.

To add a new pair, upload it as `pair8_*.jpg` in the same template, add
`{ n: 8, line: '…' }` to `posts.js`, and run `npm run beauty`.
