const createLandingPage = require(`./createLandingPage`);
const createOutDir      = require(`./createOutDir`);
const createSpinner     = require(`ora`);

/**
 * The top-level jschemer function
 * @param  {Object}  [options] An options Object
 * @return {Promise}           Returns a Promise that resolves when the documentation is complete
 */
async function jschemer({
  out = `out`,
  schemas = `schemas`,
} = {}) {
  const spinner = createSpinner(`Generating jschemer documentation`);
  spinner.start();
  await createOutDir(out);
  await createLandingPage(out);
  spinner.succeed();
}

module.exports = jschemer;
