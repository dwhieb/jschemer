const createLandingPage = require(`./createLandingPage`);
const createOutDir      = require(`./createOutDir`);

/**
 * The top-level jschemer function
 * @param  {Object}  [options] An options Object
 * @return {Promise}           Returns a Promise that resolves when the documentation is complete
 */
async function jschemer({
  out,
  schemas,
} = {
  out:     `out`,
  schemas: `schemas`,
}) {
  await createOutDir(out);
  await createLandingPage(out);
}

module.exports = jschemer;
