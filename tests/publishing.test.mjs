import assert from 'node:assert/strict';
import { writeFile,readFile,unlink,rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve,dirname } from 'node:path';
const root = resolve('.');
const output = resolve(root,'artifacts/publishing-check');
assert.equal(dirname(output),resolve(root,'artifacts'));
const resource = 'content/resources/frontier/test-auto-resource.md';
const note = 'content/notes/test-mdx-note.mdx';
const currentLibrary = await readFile('_site/hct/index.html','utf8');
const originalCount = (currentLibrary.match(/data-resource data-topic=/g)||[]).length;
const build = () => spawnSync(process.execPath,['node_modules/@11ty/eleventy/cmd.cjs','--output=artifacts/publishing-check'],{encoding:'utf8'});
try {
  await rm(output,{recursive:true,force:true});
  await writeFile(resource,'---\ntitle: "Test newest paper"\nauthors: "Test author"\nyear: 2099\nsource: "https://example.com/paper"\nsummary: "Publishing fixture"\n---\n\nA reading note.\n');
  await writeFile(note,'---\ntitle: "Test MDX note"\nintro: "Publishing fixture"\n---\n\n## Test heading\n\n<Callout title="Fixture">Component content</Callout>\n\n<Equation tex="x^2" />\n\n<Disclosure title="Show details">Detail content</Disclosure>\n');
  let result = build();
  assert.equal(result.status,0,result.stdout+result.stderr);
  let library = await readFile(resolve(output,'hct/index.html'),'utf8');
  assert.ok(library.includes(`${originalCount+2} resources available`),'New resources and notes must update the count');
  const frontier = [...library.matchAll(/<article class="resource-row" id="([^"]+)" data-resource data-topic="frontier"/g)].map(m=>m[1]);
  assert.equal(frontier[0],'test-auto-resource','Newest paper sorts ahead of existing research');
  assert.ok(library.includes('href="/hct/notes/test-mdx-note.html"'),'New MDX notes are indexed automatically');
  const html = await readFile(resolve(output,'hct/notes/test-mdx-note.html'),'utf8');
  assert.ok(html.includes('Component content') && html.includes('<math') && html.includes('<details>'),'MDX components must actually render');
  assert.ok(html.includes('id="test-heading"') && html.includes('href="#test-heading"'),'MDX headings must update the contents menu');
  await writeFile(resource,(await readFile(resource,'utf8')).replace('---\n\nA reading note.','draft: true\n---\n\nA reading note.'));
  await writeFile(note,(await readFile(note,'utf8')).replace('---\n\n## Test heading','draft: true\n---\n\n## Test heading'));
  await rm(output,{recursive:true,force:true});
  result = build();
  assert.equal(result.status,0,result.stdout+result.stderr);
  library = await readFile(resolve(output,'hct/index.html'),'utf8');
  assert.ok(library.includes(`${originalCount} resources available`) && !library.includes('id="test-auto-resource"') && !library.includes('id="test-mdx-note"'),'Drafts must stay out of the library');
  await assert.rejects(readFile(resolve(output,'hct/notes/test-mdx-note.html')));
  console.log('Publishing checks passed: add, auto-sort, auto-index, count, MDX components, heading links, and drafts.');
} finally {
  await Promise.all([unlink(resource).catch(()=>{}),unlink(note).catch(()=>{})]);
  await rm(output,{recursive:true,force:true});
}
