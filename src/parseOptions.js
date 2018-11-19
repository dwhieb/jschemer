const meta    = require(`../package.json`);
const program = require(`commander`);

/**
 * Reads the options passed to jschmer from the command line and returns them as an options Object
 * @return {Object} Returns the options Object for use with the jschemer method
 */
function parseOptions() {

  program
  .version(meta.version)
  .option(`-o, --out <directory>`, `The path to the folder where the documentation will be generated. The folder will be created if it does not already exist. Default: "out"`)
  .option(`-s, --schemas <schemas>`, `The path to the folder where the JSON schemas are located. Default: "schemas"`)
  .parse(process.argv);

  const {
    out,
    schemas,
  } = program;

  return {
    out,
    schemas,
  };

}

module.exports = parseOptions;
