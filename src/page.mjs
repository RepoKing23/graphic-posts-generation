/** Document shell: fonts, reset, and a 1080x1350 stage the layouts draw into. */
import { CANVAS } from './theme/tokens.js';

export function page(inner) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{background:#fff;}
body{width:${CANVAS.w}px;height:${CANVAS.h}px;overflow:hidden;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;}
.stage{position:relative;width:${CANVAS.w}px;height:${CANVAS.h}px;overflow:hidden;}
img,svg{display:block;}
</style></head><body><div class="stage">${inner}</div></body></html>`;
}
