const meta    = require(`../package.json`);
const program = require(`commander`);

/**
 * Reads the options passed to jschmer from the command line and returns them as an options object
 * @return {Object} Returns the options Object for use with the jschemer method
 */
function parseOptions() {

  program
  .version(meta.version)
  .option(`-o, --out <directory>`, `The path to the folder where the documentation will be generated. The folder will be created if it does not already exist. Default: "out"`)
  .option(`-r, --readme <path>`, `The path to a readme file to include in the generated documentation. This will be displayed on the landing page for the documentation. If no readme is provided, a placeholder readme is used.`)
  .option(`-s, --schemas <schemas>`, `The path to the folder where the JSON schemas are located. Default: "schemas"`)
  .parse(process.argv);

  const {
    out,
    readme,
    schemas,
  } = program;

  return {
    out,
    readme,
    schemas,
  };

}

module.exports = parseOptions;
