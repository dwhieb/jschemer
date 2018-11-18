const { copyFile } = require(`fs`).promises;
const path         = require(`path`);

const landingPagePath = path.join(__dirname, `../templates/index.html`);

/**
 * Creates the landing page for the generated documentation
 * @param  {String}  outDir The path to the directory where the landing page should be generated in
 * @return {Promise}        Returns a Promise that resolves when the landing page is generated
 */
async function createLandingPage(outDir) {
  const outPath = path.join(outDir, `index.html`);
  await copyFile(landingPagePath, outPath);
}

module.exports = createLandingPage;
