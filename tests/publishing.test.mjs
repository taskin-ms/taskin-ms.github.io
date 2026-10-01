import assert from 'node:assert/strict';
import { writeFile,readFile,unlink,rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve,dirname } from 'node:path';
const root = resolve('.');
const output = resolve(root,'artifacts/publishing-check');
assert.equal(dirname(output),resolve(root,'artifacts'));
const mdNote = 'content/notes/test-markdown-note.md';
const note = 'content/notes/test-mdx-note.mdx';
const build = () => spawnSync(process.execPath,['node_modules/@11ty/eleventy/cmd.cjs','--output=artifacts/publishing-check'],{encoding:'utf8'});
try {
  await rm(output,{recursive:true,force:true});
  await writeFile(mdNote,'---\ntitle: "A Markdown note"\nintro: "Publishing fixture"\n---\n\n## Density\n\nDensity $\\rho$ is positive.\n');
  await writeFile(note,'---\ntitle: "Test MDX note"\nintro: "Publishing fixture"\n---\n\n## Test heading\n\n<Callout title="Fixture">Component content</Callout>\n\n<Equation tex="x^2" />\n\n<Disclosure title="Show details">Detail content</Disclosure>\n');
  let result = build();
  assert.equal(result.status,0,result.stdout+result.stderr);
  let library = await readFile(resolve(output,'hct/index.html'),'utf8');
  assert.ok(library.includes('href="/hct/notes/test-markdown-note.html"'), 'Markdown notes must be indexed automatically');
  assert.ok(library.indexOf('href="/hct/notes/test-markdown-note.html"') < library.indexOf('href="/hct/notes/test-mdx-note.html"'), 'Notes sort alphabetically without manual maintenance');
  assert.ok(library.includes('href="/hct/notes/test-mdx-note.html"'),'New MDX notes are indexed automatically');
  const html = await readFile(resolve(output,'hct/notes/test-mdx-note.html'),'utf8');
  assert.ok(html.includes('Component content') && html.includes('<math') && html.includes('<details>'),'MDX components must actually render');
  assert.ok(html.includes('id="test-heading"') && html.includes('href="#test-heading"'),'MDX headings must update the contents menu');
  assert.ok((await readFile(resolve(output,'hct/notes/test-markdown-note.html'),'utf8')).includes('<math'), 'Markdown inline math renders');
  await writeFile(mdNote,(await readFile(mdNote,'utf8')).replace('---\n\n## Density','draft: true\n---\n\n## Density'));
  await writeFile(note,(await readFile(note,'utf8')).replace('---\n\n## Test heading','draft: true\n---\n\n## Test heading'));
  await rm(output,{recursive:true,force:true});
  result = build();
  assert.equal(result.status,0,result.stdout+result.stderr);
  library = await readFile(resolve(output,'hct/index.html'),'utf8');
  assert.ok(!library.includes('href="/hct/notes/test-markdown-note.html"') && !library.includes('href="/hct/notes/test-mdx-note.html"'),'Drafts must stay out of the guide');
  await assert.rejects(readFile(resolve(output,'hct/notes/test-markdown-note.html')));
  await assert.rejects(readFile(resolve(output,'hct/notes/test-mdx-note.html')));
  console.log('Publishing checks passed: Markdown/MDX, automatic note order/index, components, math, heading links, and drafts.');
} finally {
  await Promise.all([unlink(mdNote).catch(()=>{}),unlink(note).catch(()=>{})]);
  await rm(output,{recursive:true,force:true});
}
