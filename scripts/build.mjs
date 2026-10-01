import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const resources = JSON.parse(await readFile(new URL('hct/resources.json', root), 'utf8'));
const topics = {
  theory: ['01', 'Basic theory', 'Build the language before building the model.'],
  frontier: ['02', 'Research frontiers', 'Scaling, DNS, LES, and the question of where machine learning can help.'],
  data: ['03', 'Datasets & verification', 'Start with a reproducible observable, then test a clearly stated hypothesis.'],
  aero: ['04', 'The aerospace perspective', 'Connect canonical flow physics to heat loads, transition, and vehicle-scale prediction.'],
  math: ['05', 'Mathematical derivations', 'Keep the operators, assumptions, and unclosed terms visible.']
};
const formats = { book: 'Book', paper: 'Paper', reference: 'Reference', dataset: 'Dataset', preprint: 'Preprint', note: 'Study note' };
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const ids = new Set();
for (const r of resources) {
  for (const key of ['id', 'title', 'authors', 'year', 'venue', 'topic', 'format', 'access', 'url', 'description', 'scope', 'label']) {
    if (typeof r[key] !== 'string' || !r[key].trim()) throw new Error(`Missing ${key} in ${r.id}`);
  }
  if (!/^[a-z0-9-]+$/.test(r.id) || ids.has(r.id)) throw new Error(`Invalid or duplicate id: ${r.id}`);
  ids.add(r.id);
  if (!topics[r.topic] || !formats[r.format]) throw new Error(`Invalid taxonomy: ${r.id}`);
  if (!Array.isArray(r.tags) || r.tags.some(tag => typeof tag !== 'string')) throw new Error(`Invalid tags: ${r.id}`);
  if (!r.url.startsWith('https://') && !/^notes\/[a-z0-9-]+\.html$/.test(r.url)) throw new Error(`Invalid source URL: ${r.id}`);
}
let index = 0;
const sections = Object.entries(topics).map(([topic, [number, title, intro]]) => `<section class="library-section" id="${topic}" data-library-section>
  <div class="library-section-heading"><span class="section-number mono">${number}</span><div><h2>${title}</h2><p>${intro}</p></div></div>
  ${resources.filter(r => r.topic === topic).map(r => `<article class="resource-row" id="${r.id}" data-resource data-topic="${r.topic}" data-format="${r.format}" data-search="${escape([r.title, r.authors, r.venue, r.label, r.description, r.scope, ...r.tags].join(' '))}">
    <div class="resource-index mono">${String(++index).padStart(2, '0')}</div>
    <div class="resource-body"><div class="resource-meta"><span>${escape(r.label)}</span><span>${escape(r.year)}</span></div>
    <h3><a href="${escape(r.url)}">${escape(r.title)}<span class="outward" aria-hidden="true">${r.format === 'note' ? '→' : '↗'}</span></a></h3>
    <p class="resource-authors">${escape(r.authors)}</p><p class="resource-description">${escape(r.description)}</p>
    <details><summary>Scope &amp; reading cues</summary><div class="resource-detail"><p>${escape(r.scope)}</p><p class="source-meta">${escape(r.venue)}<br>${escape(r.access)}</p><a class="text-link" href="${escape(r.url)}">${r.format === 'note' ? 'Read the derivation' : 'Visit original source'} <span aria-hidden="true">${r.format === 'note' ? '→' : '↗'}</span></a></div></details></div>
    <div class="resource-format"><span class="format-label">${formats[r.format]}</span></div>
  </article>`).join('\n')}
</section>`).join('\n');
const pageURL = new URL('hct/index.html', root);
const page = await readFile(pageURL, 'utf8');
if (!page.includes('<!-- resources:start -->') || !page.includes('<!-- resources:end -->')) throw new Error('Library markers missing');
await writeFile(pageURL, page.replace(/<!-- resources:start -->[\s\S]*?<!-- resources:end -->/, `<!-- resources:start -->\n${sections}\n<!-- resources:end -->`).replace(/<span data-resource-total>\d+<\/span>/g, `<span data-resource-total>${resources.length}</span>`).replace(/\d+ resources available/, `${resources.length} resources available`));
console.log(`Built ${resources.length} attributed resources in five sections. Zero runtime dependencies.`);
