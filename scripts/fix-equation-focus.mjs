import { readFile, writeFile } from 'node:fs/promises';
const url = new URL('../hct/notes/rans-les.html', import.meta.url);
const html = await readFile(url, 'utf8');
await writeFile(url, html.replaceAll('<div class="equation">', '<div class="equation" tabindex="0" role="group" aria-label="Mathematical expression">'));
