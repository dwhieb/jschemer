const copyFiles         = require(`./copyFiles`);
const createLandingPage = require(`./createLandingPage`);
const createOutDir      = require(`./createOutDir`);
const createSpinner     = require(`ora`);
const getSchemas        = require(`./getSchemas`);
const hbs               = require(`./handlebars`);
const path              = require(`path`);

const defaultReadmePath = path.join(__dirname, `../templates/README.md`);

/**
 * The top-level jschemer function
 * @param  {Object}  [options] An options Object
 * @return {Promise}           Returns a promise that resolves when the documentation is complete
 */
async function jschemer({
  out: outDir = `out`,
  readme: readmePath = defaultReadmePath,
  schemas: schemasPath = `schemas`,
} = {}) {

  // Start spinner in console
  const spinner = createSpinner(`Generating jschemer documentation`);
  spinner.start();

  // Create /out directory
  await createOutDir(outDir);

  // Copy files to /out folder
  await copyFiles(outDir);

  // Register Handlebars partials
  await hbs.registerPartials();

  // Retrieve schemas from schemas folder
  const schemas = await getSchemas(schemasPath);

  // Create documentation landing page, with readme
  await createLandingPage({
    outDir,
    readmePath,
    schemas,
  });

  // End spinner in console
  spinner.succeed(`jschemer documentation successfully generated`);

}

module.exports = jschemer;
