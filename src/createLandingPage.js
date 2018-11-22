const hbs  = require(`./handlebars`);
const path = require(`path`);

const {
  readFile,
  writeFile,
} = require(`fs`).promises;

/**
 * Creates the landing page for the generated documentation
 * @param  {Object}  An arguments hash
 * @return {Promise} Resolves when the landing page is generated
 */
async function createLandingPage({ outDir, readmePath, schemas }) {

  const readme          = await readFile(readmePath, `utf8`);
  const templatePath    = path.join(__dirname, `../templates/index.hbs`);
  const template        = await readFile(templatePath, `utf8`);
  const convertTemplate = hbs.compile(template);
  const html            = convertTemplate({ home: true, readme, schemas });
  const outPath         = path.join(outDir, `index.html`);

  await writeFile(outPath, html, `utf8`);

}

module.exports = createLandingPage;
