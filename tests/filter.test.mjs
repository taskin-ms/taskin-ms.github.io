import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const script = await readFile(new URL('../script.js', import.meta.url), 'utf8');
assert.ok(script.includes('export function matchesResource'), 'The library needs a real, independently testable search predicate');
const { matchesResource } = await import('../script.js');
const record = { title: 'Mean velocity scaling', authors: 'Trettel and Larsson', topic: 'wall', format: 'paper', tags: ['heat transfer', 'DNS'] };
assert.equal(matchesResource(record, { q: '  LARSSON heat  ', topic: 'wall', format: 'paper' }), true, 'Search must match separate words across metadata, ignoring case and padding');
assert.equal(matchesResource(record, { q: 'heat', topic: 'shocks', format: 'paper' }), false, 'Topic and query must be combined');
assert.equal(matchesResource(record, { q: '', topic: 'all', format: 'code' }), false, 'Format must narrow results');
assert.equal(matchesResource(record, { q: '<script>', topic: 'all', format: 'all' }), false, 'Punctuation is literal search text');
assert.equal(matchesResource(record, { q: '  ', topic: 'all', format: 'all' }), true, 'Whitespace-only search shows available resources');
console.log('Search, combined filters, and literal input checks passed.');
