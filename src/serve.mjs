/**
 * Tiny static server for the render pipeline.
 *
 * Chromium blocks file:// subresources from a setContent page, so the fonts
 * silently fell back to system faces. Serving the repo over loopback fixes
 * that and keeps assets/fonts/fonts.css as ordinary relative URLs.
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.ttf': 'font/ttf',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml',
};

/** Serves `root` from disk, plus one in-memory page swapped between renders. */
export async function startServer(root) {
  let current = '<!doctype html><title>idle</title>';

  const server = http.createServer(async (req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    if (url === '/' || url === '/poster') {
      res.writeHead(200, { 'Content-Type': TYPES['.html'] });
      return res.end(current);
    }
    // Confine to root; a poster should never be able to read outside it.
    const file = path.join(root, path.normalize(url).replace(/^(\.\.[/\\])+/, ''));
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    try {
      const buf = await readFile(file);
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(buf);
    } catch { res.writeHead(404); res.end(); }
  });

  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const { port } = server.address();
  return {
    origin: `http://127.0.0.1:${port}`,
    set: (html) => { current = html; },
    close: () => new Promise((ok) => server.close(ok)),
  };
}
