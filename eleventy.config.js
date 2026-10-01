import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { markdown, headings, guideSections } from './scripts/markdown.mjs';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'preact/jsx-runtime';
import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { components } from './templates/mdx/components.mjs';

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
  config.addFilter('guideSections', guideSections);
  config.addGlobalData('copyrightYear', () => new Date().getFullYear());
  config.addGlobalData('stylesVersion', () => createHash('sha256').update(readFileSync(new URL('./styles.css', import.meta.url))).digest('hex').slice(0,12));
  config.addCollection('publishedNotes', api => api.getFilteredByTag('notes').filter(item => !item.data.draft).sort((a,b) => a.data.title.localeCompare(b.data.title)));
  config.ignores.add('content/START-HERE.md');
  config.ignores.add('content/examples/**');
  config.addDataExtension('yaml', parse);
  config.addPassthroughCopy({ assets:'assets', 'styles.css':'styles.css', '.nojekyll':'.nojekyll' });
  return { dir:{input:'content',includes:'../templates',data:'settings',output:'_site'}, markdownTemplateEngine:false, templateFormats:['md','mdx','njk'] };
}
