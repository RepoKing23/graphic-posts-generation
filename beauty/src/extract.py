"""Pull the logo and the individual before/after photos out of the uploaded
composites (pair*.jpg). Each composite is the same 1132x1389 template: logo
centred at the top, BEFORE oval on the left half, AFTER oval on the right.

    python3 beauty/src/extract.py
"""
import glob, os
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'beauty', 'assets')
os.makedirs(OUT, exist_ok=True)


def white_on_alpha(rgb, lo=18, hi=235):
    """White artwork on black -> pure white with luminance as alpha."""
    lum = np.asarray(rgb.convert('L')).astype(float)
    a = np.clip((lum - lo) / (hi - lo), 0, 1) * 255
    out = np.zeros((*a.shape, 4), np.uint8)
    out[..., :3] = 255
    out[..., 3] = a.astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def trim(img):
    box = img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    return img.crop(box)


# Logo: full lockup, plus the LB monogram ring on its own for watermarks.
src = Image.open(os.path.join(ROOT, 'pair1_0960_0962.jpg')).convert('RGB')
trim(white_on_alpha(src.crop((360, 40, 775, 290)))).save(os.path.join(OUT, 'logo-lockup.png'))
trim(white_on_alpha(src.crop((490, 45, 640, 180)))).save(os.path.join(OUT, 'logo-mark.png'))

# Photos: tight crop around each vignetted oval, kept on its black ground.
for f in sorted(glob.glob(os.path.join(ROOT, 'pair*.jpg'))):
    n = os.path.basename(f).split('_')[0].replace('pair', '')
    im = Image.open(f).convert('RGB')
    lum = np.asarray(im.convert('L')).astype(int)
    for side, (x0, x1) in {'before': (0, 566), 'after': (566, 1132)}.items():
        sub = lum[330:1300, x0:x1] > 12
        ys, xs = np.where(sub.any(1))[0], np.where(sub.any(0))[0]
        box = (x0 + xs[0], 330 + ys[0], x0 + xs[-1] + 1, 330 + ys[-1] + 1)
        im.crop(box).save(os.path.join(OUT, f'{n}-{side}.jpg'), quality=95)
print('ok', sorted(os.listdir(OUT)))
