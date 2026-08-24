/** Document shell: fonts, reset, and a stage the layouts draw into.
 *
 * The stage is sized per call now that the same shell serves three canvases —
 * the 1080×1350 poster and carousel slide, the 1200×1200 LinkedIn card, and
 * the 1600×900 X card. Layouts keep positioning against the size they were
 * written for; the renderer asserts the result matches.
 */
import { CANVAS } from './theme/tokens.js';

export function page(inner, size = CANVAS) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{background:#fff;}
body{width:${size.w}px;height:${size.h}px;overflow:hidden;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;}
.stage{position:relative;width:${size.w}px;height:${size.h}px;overflow:hidden;}
img,svg{display:block;}
</style></head><body><div class="stage">${inner}</div></body></html>`;
}
