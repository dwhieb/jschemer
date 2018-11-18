const createOutDir = require(`./createOutDir`);

/**
 * The top-level jschemer function
 * @return {Promise} Returns a Promise that resolves when the documentation is complete
 */
async function jschemer() {
  await createOutDir();
  // await createLandingPage();
}

module.exports = jschemer;
