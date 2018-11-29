// IMPORTS
const { handlebars: hbs } = require(`../helpers`);
const path                = require(`path`);

const {
  readFile,
  writeFile,
} = require(`fs`).promises;

// VARIABLES
const templatePath = path.join(__dirname, `../../components/schema-page/schema-page.hbs`);

/**
 * Creates a page in the generated documentation for each schema
 * @param  {Array}   schemas     An array of schemas to create pages for
 * @param  {String}  schemasPath The path to the folder where the schema pages should be generated
 * @return {Promise}             Resolves when the pages are done being generated
 */
async function createSchemaPages(schemas, schemasPath) {

  const template        = await readFile(templatePath, `utf8`);
  const convertTemplate = hbs.compile(template, { preventIndent: true });

  const createSchemaPage = async ({ schema, filename }) => {
    const html    = convertTemplate({ filename, schema, schemas });
    const outPath = path.join(schemasPath, filename);
    await writeFile(outPath, html, `utf8`);
  };

  await Promise.all(schemas.map(createSchemaPage));

}

module.exports = createSchemaPages;
