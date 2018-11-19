const Markdown = require(`markdown-it`);

const md = new Markdown({
  html:        true,
  linkify:     true,
  typographer: true,
});

module.exports = md;
