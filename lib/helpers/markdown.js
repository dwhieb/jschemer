const hljs     = require(`./highlight`);
const Markdown = require(`markdown-it`);

/**
 * The highlight method for use with markdown-it. Uses highlight.js.
 * @param  {String} str  HTML string to highlight
 * @param  {String} lang The language to use for highlighting
 * @return {String}
 */
function highlight(str, lang) {

  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, str).value;
    } catch (e) {
      return ``;
    }
  }

  return ``;

}

const md = new Markdown({
  highlight,
  html:        true,
  linkify:     true,
  typographer: true,
});

module.exports = md;
