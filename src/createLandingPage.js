const { copyFile } = require(`fs`).promises;
const path         = require(`path`);

const landingPagePath = path.join(__dirname, `../templates/index.html`);

/**
 * Creates the landing page for the generated documentation
 * @return {Promise} Returns a Promise that resolves when the landing page is generated
 */
async function createLandingPage() {
  await copyFile(landingPagePath, `out/index.html`);
}

module.exports = createLandingPage;
