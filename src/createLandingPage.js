const hbs  = require(`./handlebars`);
const path = require(`path`);

const {
  readFile,
  writeFile,
} = require(`fs`).promises;

/**
 * Creates the landing page for the generated documentation
 * @param  {String}  outDir The path to the directory where the landing page should be generated in
 * @return {Promise}        Returns a promise that resolves when the landing page is generated
 */
async function createLandingPage({ outDir, readmePath }) {

  const readme          = await readFile(readmePath, `utf8`);
  const templatePath    = path.join(__dirname, `../templates/index.hbs`);
  const template        = await readFile(templatePath, `utf8`);
  const convertTemplate = hbs.compile(template);
  const html            = convertTemplate({ readme });
  const outPath         = path.join(outDir, `index.html`);

  await writeFile(outPath, html, `utf8`);

}

module.exports = createLandingPage;
