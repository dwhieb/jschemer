/* eslint-disable
  max-statements,
*/

const AJV         = require(`ajv`);
const { compare } = require(`../utilities`);
const path        = require(`path`);

const {
  readdir: readDir,
  readFile,
} = require(`fs`).promises;

const ajv = new AJV();

/**
 * Reads a JSON Schema file, parses the JSON, and validates the schema.
 * If any error is thrown, null is returned, and a warning logged to the console.
 * @param  {String}          schemasPath The path to the /schemas directory
 * @param  {String}          filename    The filename for the schema
 * @return {Promise<Object>}             Resolves to a JSON Schema, as a JavaScript object
 */
async function parseSchema(schemasPath, filename) {

  let json;

  try {
    json = await readFile(path.join(schemasPath, filename), `utf8`);
  } catch (e) {
    console.warn(`Unable to read file ${filename}. Skipping file.`);
    console.info(e);
    return null;
  }

  let schema;

  try {
    schema = JSON.parse(json);
  } catch (e) {
    console.warn(`Unable to parse JSON for file ${filename}. Skipping file.`);
    console.info(e);
    return null;
  }

  try {
    ajv.validateSchema(schema);
  } catch (e) {
    console.warn(`Invalid JSON Schema for file ${filename}. Skipping file.`);
    console.info(e);
    return null;
  }

  const ext = path.extname(filename);
  const _jschemerFilename = filename.replace(ext, `.html`);
  schema._jschemerFilename = _jschemerFilename;

  return schema;

}

/**
 * Retrieves all the schemas from the /schemas directory and returns them as an array
 * @param  {String} schemasPath The path to the /schemas folder
 * @return {Promise<Array>}
 */
async function getSchemas(schemasPath) {

  const dirEnts = await readDir(schemasPath, {
    encoding:      `utf8`,
    withFileTypes: true,
  });

  const filenames = dirEnts
  .filter(item => item.isFile())
  .map(file => file.name);

  const promises = filenames.map(filename => parseSchema(schemasPath, filename));
  const schemas  = await Promise.all(promises);

  return schemas
  .filter(schema => schema)
  .sort((a, b) => compare(a.title, b.title));

}

module.exports = getSchemas;
