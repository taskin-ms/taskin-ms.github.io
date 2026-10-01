import MarkdownIt from 'markdown-it';
import katex from 'katex';

export const markdown = new MarkdownIt({ html: false, linkify: true });
export const headingId = title => title.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
const fence = markdown.renderer.rules.fence;
markdown.renderer.rules.fence = (tokens, index, options, env, renderer) => {
  if (tokens[index].info.trim() !== 'math') return fence(tokens, index, options, env, renderer);
  const equation = katex.renderToString(tokens[index].content.trim(), { displayMode: true, output: 'mathml', throwOnError: true, trust: false });
  return `<div class="equation" tabindex="0" role="group" aria-label="Mathematical expression">${equation}</div>\n`;
};
markdown.renderer.rules.heading_open = (tokens, index, options, env, renderer) => {
  tokens[index].attrSet('id', headingId(tokens[index+1].content));
  return renderer.renderToken(tokens, index, options);
};
const table = markdown.renderer.rules.table_open;
markdown.renderer.rules.table_open = (tokens, index, options, env, renderer) => {
  tokens[index].attrSet('class', 'note-table');
  return table ? table(tokens, index, options, env, renderer) : renderer.renderToken(tokens, index, options);
};
export const headings = source => {
  const tokens = markdown.parse(source || '', {});
  return tokens.flatMap((token,index) => token.type === 'heading_open' && token.tag === 'h2' ? [{title:tokens[index+1].content,id:headingId(tokens[index+1].content)}] : []);
};
