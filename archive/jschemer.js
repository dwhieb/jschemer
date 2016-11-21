const fs = require('fs');
const hbs = require('handlebars');
const markdown = require('markdown').markdown;
const path = require('path');

const preprocess = schema => {
  schema = JSON.parse(JSON.stringify(schema));

  for (var prop in schema) {

    if (prop === 'patternProperties') {
      for (var patt in schema.patternProperties) {
        schema.patternProperties[patt].pattern = patt;
        schema.patternProperties[patt] = preprocess(schema.patternProperties[patt]);
      }
    } else if (prop === 'items' && schema.items instanceof Object) {
      schema.items = preprocess(schema.items);
    } else if (prop === 'properties') {
      for (let key in schema.properties) {
        schema.properties[key].title = schema.properties[key].title || key;
        schema.properties[key]._key = key;
        schema.properties[key] = preprocess(schema.properties[key]);
      }
    } else if (prop === 'default') {
      schema.default = JSON.stringify(schema.default, null, 2);
    } else if (prop === 'definitions') {
      for (let key in schema.definitions) {
        schema.definitions[key].title = schema.definitions[key].title || key;
        schema.definitions[key]._key = key;
        schema.definitions[key] = preprocess(schema.definitions[key]);
      }
    } else if (prop === '$ref' && schema.$ref.startsWith('#/definitions')) {
      schema.$ref = schema.$ref.replace('/definitions/', '');
    }

    const noobj = [
      'additionalProperties',
      'definitions',
      'dependencies',
      'patternProperties',
      'properties'
    ];

    if (typeof schema[prop] === 'boolean') {
      schema[prop] = { boolean: String(schema[prop]) };
    } else if (schema[prop] instanceof Object && !noobj.includes(prop)) {
      schema[prop]._object = true;
    }

  }

  return schema;

};

/**
 * The JSchemer object.
 * @type {Object}
 * @param config                                      A config hash.
 * @param {String} config.template=./template.hbs     The path to the JSchemer Handlebars template. Defaults to <code>./template.hbs</code>.
 */
module.exports = config => {
  config = config || {};
  const template = fs.readFileSync(config.template || path.join(__dirname, '/schema.hbs'), 'utf8');
  const converter = hbs.compile(template);

  hbs.registerPartial('schema', template);
  hbs.registerHelper('md', function (text) {
    const html = markdown.toHTML(text).replace(/^<p>/, '').replace(/<\/p>$/, '');
    return new hbs.SafeString(html);
  });

  return {
    convert: jschema => {
      jschema = preprocess(jschema);
      jschema = typeof jschema === 'string' ? converter(JSON.parse(jschema)) : converter(jschema);
      return jschema;
    }
  };
};
