const copyFiles         = require(`./copyFiles`);
const createLandingPage = require(`./createLandingPage`);
const createOutDir      = require(`./createOutDir`);
const createSpinner     = require(`ora`);
const path              = require(`path`);

const defaultReadmePath = path.join(__dirname, `../templates/README.md`);

/**
 * The top-level jschemer function
 * @param  {Object}  [options] An options Object
 * @return {Promise}           Returns a promise that resolves when the documentation is complete
 */
async function jschemer({
  out = `out`,
  readme,
} = {}) {

  // Start spinner in console
  const spinner = createSpinner(`Generating jschemer documentation`);
  spinner.start();

  // Create /out directory
  await createOutDir(out);

  // Copy files to /out folder
  await copyFiles(out);

  // Create documentation landing page, with readme
  await createLandingPage({
    outDir:     out,
    readmePath: readme || defaultReadmePath,
  });

  // End spinner in console
  spinner.succeed(`jschemer documentation successfully generated`);

}

module.exports = jschemer;
