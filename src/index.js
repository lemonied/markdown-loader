const unified = require('unified');
const markdown = require('remark-parse');
const stringify = require('stringify-object');
const matter = require('gray-matter');
const toHast = require('mdast-util-to-hast');
const Prism = require('prismjs');
const visit = require('unist-util-visit');
const removePosition = require('unist-util-remove-position');

function remarkParse(str) {
  return unified()
    .use(markdown)
    .parse(str);
}

module.exports = async function loader(source) {
  const callback = this.async();
  const { content, data } = matter(source);
  const mdast = remarkParse(content);
  visit(mdast, ['code', 'image'], (node) => {
    switch (node.type) {
      case 'code':
        const value = node.value;
        const language = node.lang;
        if (language) {
          if (!Prism.languages[language]) {
            require(`prismjs/components/prism-${language}.js`);
          }
          const lang = Prism.languages[language];
          const str = Prism.highlight(value, lang);
          node.type = 'html';
          node.value = `<div class="language-${language}"><pre>${str}</pre></div>`;
        }
        break;
      case 'image':
        node.url = `require('${node.url}')`;
        break;
      default:
    }
  });
  const hast = removePosition(
    toHast(mdast, { allowDangerousHtml: true }),
    true,
  );

  return callback(
    null,
    `export const hast = ${stringify(hast, {
      transform: (obj, prop, originalResult) => {
        if (prop === 'src') {
          return originalResult.replace(/^'require\(\\'(.+)\\'\)'$/, `require('$1').default`);
        }
        return originalResult;
      },
    })};
    export const front = ${stringify(data)}`
  );
};
module.exports.raw = true;
