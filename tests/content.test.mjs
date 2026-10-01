import assert from 'node:assert/strict';
import { markdown } from '../scripts/markdown.mjs';
import { compareResources } from '../scripts/resources.mjs';
const records = [
  {id:'a',topic:'frontier',year:'2019',title:'A',format:'paper'},
  {id:'b',topic:'frontier',year:'2026',title:'B',format:'paper'},
  {id:'c',topic:'theory',year:'2026',title:'A',format:'paper'},
  {id:'d',topic:'theory',year:'2009',title:'Z',format:'book'}
];
assert.deepEqual(records.sort(compareResources).map(r=>r.id),['d','c','b','a']);
assert.ok(markdown.render('```math\n\\widetilde u_i = \\frac{\\overline{\\rho u_i}}{\\overline\\rho}\n```').includes('<math'));
assert.ok(!markdown.render('<script>alert(1)</script>').includes('<script>'));
assert.ok(markdown.render('## Density weighting').includes('id="density-weighting"'));
console.log('Content checks passed: automatic order, equations, literal HTML, and heading links.');
