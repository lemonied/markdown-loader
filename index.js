const unified = require('unified');
const markdown = require('remark-parse');
const stringify = require('stringify-object');
const matter = require('gray-matter');
const toHast = require('mdast-util-to-hast');
const toHtml = require('hast-util-to-html');
const Prism = require('prismjs');
const visit = require('unist-util-visit');
const toString = require('hast-util-to-string');

function remarkParse(str) {
  return unified()
    .use(markdown)
    .parse(str);
}

module.exports = async function(source) {
  const callback = this.async();
  const { content, data } = matter(source);
  const mdast = remarkParse(content);
  visit(mdast, ['code'], (node) => {
    const value = node.value;
    const language = node.lang;
    if (language) {
      if (!Prism.languages[language]) {
        require(`prismjs/components/prism-${language}.js`);
      }
      const lang = Prism.languages[language];
      const str = Prism.highlight(value, lang);
      node.type = 'html';
      node.value =
        `<div class="language-${language}"><pre>${str}</pre></div>`;
    }
  });
  const hast = toHast(mdast, { allowDangerousHtml: true });
  const html = toHtml(hast, { allowDangerousHtml: true });
  return callback(
    null,
    `export const html = \`${html}\`;
    export const hast = ${stringify(hast)};
    export const mdast = ${stringify(mdast)};
    export const front = ${stringify(data)}`
  );
};
