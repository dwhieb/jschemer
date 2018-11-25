const handlebars   = require(`handlebars`);
const markdown     = require(`./markdown`);
const path         = require(`path`);
const { readFile } = require(`fs`).promises;

/**
 * A Handlebars helper that JSON stringifies an object
 * @param  {Any}    data The JavaScript object to stringify
 * @return {String}      Returns a JSON string
 */
function json(data) {
  return JSON.stringify(data, null, 2);
}

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

// Register helpers
handlebars.registerHelper({ json, md });

/**
 * This method loads each of the jschemer Handlebars partials and registers them to the Handlebars instance
 * @return {Promise}
 */
handlebars.registerPartials = async () => {

  const navPartialPath = path.join(__dirname, `../../components/nav/nav.hbs`);
  const navPartial     = await readFile(navPartialPath, `utf8`);

  const schemaPartialPath = path.join(__dirname, `../../components/schema/schema.hbs`);
  const schemaPartial     = await readFile(schemaPartialPath, `utf8`);

  handlebars.registerPartial({
    nav:    navPartial,
    schema: schemaPartial,
  });

};

module.exports = handlebars;
