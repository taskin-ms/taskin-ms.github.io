import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const guide = await readFile('_site/hct/index.html', 'utf8');
assert.ok(guide.includes('Hypersonic Compressible Turbulence'), 'Publish the requested guide title');
const numbered = [...guide.matchAll(/<section class="guide-section" id="([^"]+)"/g)].map(m => m[1]);
assert.deepEqual(numbered, ['section-01','section-02','section-03','section-04','section-05','section-06'], 'Publish six ordered sections');
assert.ok(!guide.includes('id="references"'), 'Remove the global bibliography');
assert.equal((guide.match(/class="guide-sources"/g) || []).length, 6, 'Each section needs local Sources');
for (const number of ['01','02','03','04','05','06']) {
  const section = guide.split(`id="section-${number}"`)[1]?.split('</section>')[0];
  assert.ok(section?.includes(`id="section-${number}-sources"`), `Missing local Sources in ${number}`);
  const [body,sources] = section.split('class="guide-sources"');
  for (const doi of body.matchAll(/href="(https:\/\/doi.org\/[^" ]+)"/g)) assert.ok(sources.includes(doi[1]), `Inline citation needs a full local entry: ${doi[1]}`);
}
assert.equal((guide.match(/<figure class="scientific-figure/g) || []).length, 4, 'Three topology figures and one published scaling figure');
assert.ok(guide.includes('creativecommons.org/licenses/by/4.0/'), 'Attribute the published figure license');
for (const reference of ['5.0218585', 'jfm.2013.445', 'CBO9780511840531']) assert.ok(guide.includes(reference), `Missing scaling source ${reference}`);
assert.ok((guide.match(/<math[ >]/g) || []).length >= 14, 'Render the governing equations and averaging notation');
assert.ok(!/data-library|data-resource|data-presentation|Scope.{0,10}reading cues|Start here|Reproduce one observable/i.test(guide), 'Remove the old catalog interface and filler');
for (const reference of ['PhysRevFluids.4.042601', 'PhysRevFluids.5.084609', 'annurev-fluid-010518-040547', 'chung2022_info.json']) {
  assert.ok(guide.includes(reference), `Missing verified source: ${reference}`);
}
assert.ok(guide.includes('INCOMPRESSIBLE') || guide.includes('incompressible'), 'Identify the incompressible JHTDB baseline');
assert.ok(!guide.includes('src="/script.js"'), 'The narrative requires no catalog JavaScript');
console.log('Guide checks passed: six sections, local Sources, scientific figures, equations, and dataset provenance.');
