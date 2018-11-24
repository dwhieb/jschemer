const createSpinner       = require(`ora`);
const { handlebars: hbs } = require(`./helpers`);
const path                = require(`path`);
const { createDir }       = require(`./utilities`);

const {
  createCSSFiles,
  createHomePage,
  getSchemas,
} = require(`./build`);

const defaultReadmePath = path.join(__dirname, `../components/readme/README.md`);

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

  try {

    // Create /out directory
    await createDir(outDir);

    // Register Handlebars partials
    await hbs.registerPartials();

    // Retrieve schemas from schemas folder
    const schemas = await getSchemas(schemasPath);

    // Create documentation landing page, with readme
    await createHomePage({
      outDir,
      readmePath,
      schemas,
    });

    // Create folder for schema pages
    const schemaPagesPath = path.join(outDir, `schemas`);
    await createDir(schemaPagesPath);

    // Create CSS files using LESS
    await createCSSFiles(outDir);

  } catch (e) {

    spinner.fail(e.message);
    console.error(e);

  }

  // End spinner in console
  spinner.succeed(`jschemer documentation successfully generated`);

}

module.exports = jschemer;
