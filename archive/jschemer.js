/* eslint-disable */

for (var prop in schema) {

  if (prop === 'patternProperties') {
    for (var patt in schema.patternProperties) {
      schema.patternProperties[patt].pattern = patt;
      schema.patternProperties[patt] = preprocess(schema.patternProperties[patt]);
    }
  } else if (prop === 'items' && schema.items instanceof Object) {
    schema.items = preprocess(schema.items);
  } else if (prop === 'definitions') {
    for (let key in schema.definitions) {
      schema.definitions[key].title = schema.definitions[key].title || key;
      schema.definitions[key]._key = key;
      schema.definitions[key] = preprocess(schema.definitions[key]);
    }
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
