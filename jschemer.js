#!/usr/bin/env node
/* eslint-disable no-sync */

// modules
const fs = require('fs');
const meta = require('./package.json');
const program = require('commander');

const jschemer = function(path, options = {}) {

  if (typeof path !== 'string') {
    throw new TypeError(`The 'path' argument must be a string.`);
  }

  if (typeof options !== 'object') {
    throw new TypeError(`The 'options' argument must be an object.`);
  }

  if (!fs.existsSync(path)) {
    throw new Error(`A file or folder with the name "${path}" was not found.`);
  }

  ['css', 'readme'].forEach(opt => {
    if (options[opt] && !fs.existsSync(options[opt])) {
      throw new Error(`A file with the name "${options[opt]}" was not found.`);
    }
  });

  fs.mkdir(options.out || 'out', () => {

    // TODO: create a /schemas folder within the /out folder
    // TODO: copy jschemer.css or file specified in css option into /out folder
    // TODO: if no readme option was provided, generate a generic readme (as a string); otherwise, read the data from the readme file into memory
    // TODO: read the schema / directory of schemas into memory
    // - use fs.lstat and stats.isDirectory to check for directory
    // TODO: preprocess each schema
    // TODO: generate index.html using Handlebars
    // TODO: generate a page for each schema using Handlebars, and place them in the /schemas folder

    // TODO: export a method for generating only the HTML for a single schema

  });

};

// processes the arguments and options if jschemer is run from the command line
if (require.main) {

  const list = val => val.replace(/ /g, '').split(',');

  program
  .version(meta.version) // set version
  .arguments('<path>')   // set required <path> argument

  // set options
  .option('-c, --css <filename>', `The path to the CSS file to use for styling the documentation. Defaults to 'out/jschemer.css'.`)
  .option('-i, --ignore <filenames>', `A list of filenames to ignore.`, list)
  .option('-o, --out <directory>', `The name of the directory to output files to. Defaults to 'out'.`)
  .option('-r, --readme <filename>', `A readme file (in Markdown) to include in the generated documentation.`)

  // run this once the arguments are parsed
  .action(path => {

    // collect the options passed to the command line
    const options = {
      css:    program.css,
      ignore: program.ignore,
      out:    program.out,
      readme: program.readme,
    };

    // run jschemer using the passed options
    jschemer(path, options);

  })

  // parse the command line arguments
  .parse(process.argv);

  // throw an error if the <path> argument is missing
  if (!program.args.length) {
    throw new Error(`A <path> argument must be provided. The <path> argument may either be a single file or a directory.`);
  }

}

module.exports = jschemer;

// Schema preprocessing:

// Global context (for both index.hbs and schema-page.hbs)
// * css: The name (not path) of the css file
// * nav: An array of object containing information about each schema
//   - fileName
//   - title

// Context required for index.hbs
// - readme:  The text of the readme, in markdown

// Context required for schema-page.hbs
// - A single schema object to create a page for
