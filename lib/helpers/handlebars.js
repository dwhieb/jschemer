const handlebars   = require(`handlebars`);
const markdown     = require(`./markdown`);
const path         = require(`path`);
const { readFile } = require(`fs`).promises;

/**
 * A list of JSON Schema annotation and meta keywords
 * @type {Array}
 */
const metaKeys = [
  `$comment`,
  `$id`,
  `$schema`,
  `description`,
  `default`,
  `examples`,
  `readOnly`,
  `writeOnly`,
];

/**
 * A Handlebars helper to check whether an item is an array
 * @param  {Any}    item    The item to check
 * @param  {Object} options Handlebars options
 * @return {String}
 */
function isArray(item, options) {
  return Array.isArray(item) ? options.fn(this) : options.inverse(this);
}

/**
 * A Handlebars helper to check whether an item is a boolean
 * @param  {Any}    item    The item to check
 * @param  {Object} options Handlebars options
 * @return {String}
 */
function isBoolean(item, options) {
  return typeof item === `boolean` ? options.fn(this) : options.inverse(this);
}

/**
 * A Handlebars helper to check whether an item is defined
 * @param  {Any}    item    The item to check
 * @param  {Object} options Handlebars options
 * @return {String}
 */
function isDefined(item, options) {
  return typeof item === `undefined` ? options.inverse(this) : options.fn(this);
}

/**
 * A Handlebars helper to check whether an item is equal to the value true
 * @param  {Any}    item    The item to check
 * @param  {Object} options Handlebars options
 * @return {String}
 */
function isTrue(item, options) {
  return item === true ? options.fn(this) : options.inverse(this);
}

/**
 * A Handlebars helper to check whether a schema is an empty schema
 * @param  {Object}  schema  The schema to check
 * @param  {Object}  options Handlebars options
 * @return {Boolean}
 */
function emptySchema(schema, options) {

  const isEmptySchema = Object.keys(schema)
  .filter(key => !metaKeys.includes(key))
  .length === 0;

  return isEmptySchema ? options.fn(this) : options.inverse(this);

}

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
handlebars.registerHelper({
  emptySchema,
  isArray,
  isBoolean,
  isDefined,
  isTrue,
  json,
  md,
});

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
