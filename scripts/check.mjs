import assert from 'node:assert/strict';
import { readFile,stat,readdir } from 'node:fs/promises';
const root = new URL('../_site/',import.meta.url);
const pages = [];
async function scan(dir) {
  for(const entry of await readdir(dir,{withFileTypes:true})) {
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''),dir);
    if(entry.isDirectory()) await scan(file);
    else if(entry.name.endsWith('.html')) pages.push(file);
  }
}
await scan(root);
const library = await readFile(new URL('hct/index.html',root),'utf8');
const count = (library.match(/data-resource data-topic=/g)||[]).length;
assert.ok(count > 0,'The bibliography must include resources');
assert.ok(library.includes(`${count} resources available`),'The resource count must update automatically');
assert.equal((library.match(/data-library-section/g)||[]).length,5,'Keep the five resource areas');
for(const page of pages) {
  const html = await readFile(page,'utf8');
  const path = page.href.slice(root.href.length);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${path}: use one main heading (the layout supplies it)`);
  assert.ok(html.includes('lang="en"'),`${path}: document language missing`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`${path}: duplicate heading or resource IDs`);
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const link = match[1].replace(/&amp;/g,'&');
    if(/^(https?:|mailto:|data:)/.test(link)) continue;
    const target = link.startsWith('/') ? new URL(link.slice(1),root) : new URL(link,page);
    const file = target.pathname.endsWith('/') ? new URL('index.html',target) : new URL(target);
    file.hash=''; file.search='';
    const info = await stat(file).catch(()=>null);
    assert.ok(info,`${path}: broken local link ${link}`);
    if(target.hash && info.isFile() && file.pathname.endsWith('.html')) {
      const destination = await readFile(file,'utf8');
      assert.ok(destination.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`),`${path}: missing heading or resource ${link}`);
    }
  }
}
assert.ok(!pages.some(p=>p.href.includes('/archive/')),'The decommissioned site must not be published');
console.log(`Static checks passed: ${pages.length} pages, ${count} resources, five areas, automatic counts, and local links.`);
