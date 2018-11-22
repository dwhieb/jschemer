const handlebars   = require(`handlebars`);
const markdown     = require(`./markdown`);
const path         = require(`path`);
const { readFile } = require(`fs`).promises;

/**
 * A Markdown helper for Handlebars
 * @param  {String} text     The Markdown text to render as HTML
 * @param  {String} [inline] If set to `inline`, the Markdown text is rendered inline
 * @return {String}          Returns an HTML string
 */
function md(text, inline) {
  if (!text) return ``;
  const method = inline === `inline` ? `renderInline` : `render`;
  return new handlebars.SafeString(markdown[method](text));
}

// Register markdown helper
handlebars.registerHelper(`md`, md);

/**
 * This method loads each of the jschemer Handlebars partials and registers them to the Handlebars instance
 * @return {Promise}
 */
handlebars.registerPartials = async () => {
  const navPartialPath = path.join(__dirname, `../templates/nav.hbs`);
  const navPartial     = await readFile(navPartialPath, `utf8`);
  handlebars.registerPartial(`nav`, navPartial);
};

module.exports = handlebars;
