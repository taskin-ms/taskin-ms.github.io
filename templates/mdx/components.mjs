import { h } from 'preact';
import katex from 'katex';
import { headingId } from '../../scripts/markdown.mjs';

// These components are rendered at build time; no framework is sent to readers.
export const components = {
  h2: ({children,...props}) => h('h2',{id:headingId(String(children)),...props},children),
  table: ({children,...props}) => h('table',{class:'note-table',...props},children),
  Callout: ({title,children}) => h('aside',{class:'note-callout'},title && h('strong',null,title),children),
  Disclosure: ({title,children}) => h('details',null,h('summary',null,title),children),
  Equation: ({tex}) => h('div',{class:'equation',tabIndex:0,role:'group','aria-label':'Mathematical expression',dangerouslySetInnerHTML:{__html:katex.renderToString(tex,{displayMode:true,output:'mathml',trust:false,throwOnError:true})}})
};
