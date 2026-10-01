import MarkdownIt from 'markdown-it';
import katex from 'katex';

export const markdown = new MarkdownIt({ html: false, linkify: true });
markdown.inline.ruler.after('escape', 'math_inline', (state, silent) => {
  if (state.src[state.pos] !== '$' || state.src[state.pos + 1] === '$') return false;
  const end = state.src.indexOf('$', state.pos + 1);
  if (end < 0 || end === state.pos + 1 || state.src.slice(state.pos + 1, end).includes('\n')) return false;
  if (!silent) {
    const token = state.push('math_inline', 'math', 0);
    token.content = state.src.slice(state.pos + 1, end);
  }
  state.pos = end + 1;
  return true;
});
markdown.renderer.rules.math_inline = (tokens, index) => katex.renderToString(tokens[index].content, { output: 'mathml', throwOnError: true, trust: false });
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

export const guideSections = source => {
  const tokens = markdown.parse(source || '', {});
  const starts = tokens.flatMap((token, index) => token.type === 'heading_open' && token.tag === 'h2' ? [index] : []);
  return starts.map((start, index) => {
    const heading = tokens[start + 1].content;
    const match = /^(\d{2})\s+—\s+(.+)$/.exec(heading);
    const number = match?.[1];
    const title = match?.[2] || heading;
    return { number, title, id: number ? `section-${number}` : headingId(title), html: markdown.renderer.render(tokens.slice(start + 3, starts[index + 1] ?? tokens.length), markdown.options, {}) };
  });
};
