import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const guide = await readFile('_site/hct/index.html', 'utf8');
assert.ok(guide.includes('Hypersonic Compressible Turbulence'), 'Publish the requested guide title');
const numbered = [...guide.matchAll(/<section class="guide-section" id="([^"]+)"/g)].map(m => m[1]);
assert.equal(numbered.length, 5, 'The guide must contain exactly five major numbered sections');
assert.ok(guide.includes('id="references"'), 'Publish a separate references section');
assert.ok((guide.match(/<math[ >]/g) || []).length >= 14, 'Render the governing equations and averaging notation');
assert.ok(!/data-library|data-resource|data-presentation|Scope.{0,10}reading cues|Start here|Reproduce one observable/i.test(guide), 'Remove the old catalog interface and filler');
for (const reference of ['PhysRevFluids.4.042601', 'PhysRevFluids.5.084609', 'annurev-fluid-010518-040547', 'chung2022_info.json']) {
  assert.ok(guide.includes(reference), `Missing verified source: ${reference}`);
}
assert.ok(guide.includes('INCOMPRESSIBLE') || guide.includes('incompressible'), 'Identify the incompressible JHTDB baseline');
assert.ok(!guide.includes('src="/script.js"'), 'The narrative requires no catalog JavaScript');
console.log('Guide checks passed: five sections, equations, references, dataset provenance, and no catalog interface.');
