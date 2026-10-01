import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { extname, resolve, sep } from 'node:path';
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg' };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const target = resolve(root, `.${pathname}`);
    if ((target !== root && !target.startsWith(root + sep)) || pathname.split('/').some(part => part.startsWith('.'))) { res.writeHead(403).end(); return; }
    const info = await stat(target);
    if (info.isDirectory() && !pathname.endsWith('/')) { res.writeHead(301, { Location: `${pathname}/${url.search}` }).end(); return; }
    const file = info.isDirectory() ? resolve(target, 'index.html') : target;
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(new URL('../404.html', import.meta.url)));
  }
}).listen(4173, '127.0.0.1', () => console.log('Research fieldbook: http://127.0.0.1:4173'));
