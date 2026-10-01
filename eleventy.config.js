import { basename } from 'node:path';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { markdown, headings } from './scripts/markdown.mjs';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'preact/jsx-runtime';
import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { components } from './templates/mdx/components.mjs';
import { compareResources } from './scripts/resources.mjs';

export default function(config) {
  config.setLibrary('md', markdown);
  config.addExtension('mdx', {
    outputFileExtension:'html',
    compile:async (source,inputPath) => {
      const {default:Content} = await evaluate(source,{...runtime,baseUrl:pathToFileURL(resolve(inputPath))});
      return async () => render(h(Content,{components}));
    }
  });
  config.setNunjucksEnvironmentOptions({ autoescape: true, throwOnUndefined: true });
  config.addFilter('markdown', text => markdown.render(text || ''));
  config.addFilter('inlineMarkdown', text => markdown.renderInline(text || ''));
  config.addFilter('lines', text => String(text).split('\n'));
  config.addFilter('headings', headings);
  config.addFilter('resourceSearch', r => [r.title,r.authors,r.venue,r.label,r.summary,r.notes,...(r.keywords || [])].join(' '));
  config.addFilter('formatLabel', value => ({book:'Book',paper:'Paper',preprint:'Preprint',dataset:'Dataset',reference:'Reference',note:'Study note'})[value]);
  config.addGlobalData('copyrightYear', () => new Date().getFullYear());
  config.addGlobalData('stylesVersion', () => createHash('sha256').update(readFileSync(new URL('./styles.css', import.meta.url))).digest('hex').slice(0,12));
  config.addCollection('resources', api => {
    const ids = new Set();
    return api.getFilteredByTag('resources').filter(item => !item.data.draft).map(item => {
      const r = {...item.data};
      r.id = basename(item.inputPath,'.md').replace(/^\d+-/,'');
      r.topic = item.inputPath.replaceAll('\\','/').split('/').at(-2);
      // Content has no template syntax; Markdown stays literal and portable.
      r.notes = item.data.page.rawInput;
      const fail = message => { throw new Error(`${item.inputPath}: ${message}. See content/START-HERE.md.`); };
      for(const field of ['title','authors','source','summary']) if(typeof r[field] !== 'string' || !r[field].trim()) fail(`Fill in ${field}`);
      r.year = String(r.year || 'Undated');
      r.format = r.format || (r.topic === 'data' ? 'dataset' : 'reference');
      if(!['theory','frontier','data','aero','math'].includes(r.topic)) fail('Put this file in one of the five resource folders');
      if(!['book','paper','preprint','dataset','reference','note'].includes(r.format)) fail('Choose a supported format');
      if(!/^[a-z0-9-]+$/.test(r.id) || ids.has(r.id)) fail('Use a unique lowercase filename with hyphens');
      if(!/^https:\/\//.test(r.source) && !/^\/hct\/notes\/[a-z0-9-]+\.html$/.test(r.source)) fail('Use a complete https source URL or a local note URL');
      if(r.keywords && (!Array.isArray(r.keywords) || r.keywords.some(k => typeof k !== 'string'))) fail('keywords must be a list of words in quotes');
      ids.add(r.id);
      return {...r,label:r.label || r.format,venue:r.venue || '',access:r.access || 'Visit original source'};
    }).concat(api.getFilteredByTag('notes').filter(item => !item.data.draft).filter(item => !api.getFilteredByTag('resources').some(r => !r.data.draft && r.data.source === `/hct/notes/${item.data.page.fileSlug}.html`)).map(item => ({
      id:item.data.page.fileSlug,topic:'math',format:'note',title:item.data.title.replace(/\n/g,' '),authors:item.data.site.name,year:String(item.data.year || 'Study note'),source:`/hct/notes/${item.data.page.fileSlug}.html`,summary:item.data.intro,notes:'',label:'Worked derivation',venue:'Research notes',access:'Read on this site',keywords:[]
    }))).sort(compareResources);
  });
  config.ignores.add('content/START-HERE.md');
  config.ignores.add('content/examples/**');
  config.addDataExtension('yaml', parse);
  config.addPassthroughCopy({ assets:'assets', 'styles.css':'styles.css', 'script.js':'script.js', '.nojekyll':'.nojekyll' });
  return { dir:{input:'content',includes:'../templates',data:'settings',output:'_site'}, markdownTemplateEngine:false, templateFormats:['md','mdx','njk'] };
}
