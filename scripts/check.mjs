import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const resources = JSON.parse(await readFile(new URL('hct/resources.json', root), 'utf8'));
const library = await readFile(new URL('hct/index.html', root), 'utf8');
assert.equal((library.match(/data-resource data-topic=/g) || []).length, resources.length, 'Run npm run build after editing resources');
assert.equal((library.match(/data-library-section/g) || []).length, 5, 'The library must preserve the five requested areas');
for (const resource of resources) assert.ok(library.includes(`id="${resource.id}"`), `Missing ${resource.id}`);
for (const path of ['index.html', 'hct/index.html', 'hct/notes/rans-les.html', '404.html']) {
  const html = await readFile(new URL(path, root), 'utf8');
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${path} needs one main heading`);
  assert.ok(html.includes('lang="en"'), `${path} needs a document language`);
  assert.ok(!html.includes('[TODO]') && !html.includes('href="#"'), `${path} must not contain unfinished links`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const link = match[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|data:)/.test(link)) continue;
    const target = link.startsWith('/') ? new URL(link.slice(1), root) : new URL(link, new URL(path, root));
    const file = target.pathname.endsWith('/') ? new URL('index.html', target) : target;
    file.hash = ''; file.search = '';
    const info = await stat(file).catch(() => null);
    assert.ok(info, `Broken local link in ${path}: ${link}`);
    if (target.hash && info.isFile() && file.pathname.endsWith('.html')) {
      const destination = await readFile(file, 'utf8');
      assert.ok(destination.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `Missing anchor in ${path}: ${link}`);
    }
  }
}
console.log(`Static checks passed: ${resources.length} resources, five areas, page semantics, local files, and anchors.`);
