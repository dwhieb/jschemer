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

    const throwError = err => { throw err; };
    const rs = fs.createReadStream(options.css || 'src/jschemer.css');
    const ws = fs.createWriteStream('out/jschemer.css');

    rs.on('error', throwError);
    ws.on('error', throwError);
    rs.pipe(ws);

    fs.mkdir('out/schemas', err => {

      if (err) throw err;

      fs.readFile(options.readme || 'src/readme.md', 'utf8', (err, readme) => {

        if (err) throw err;

        const schemas = [];

        const readFile = filename => {
          // read the file (using fs.readFile)
          // add the contents of the file to the schemas array (using .push)
          // the schemas array will wind up being an array of strings
        };

        fs.stat(path, (err, stats) => {

          if (stats.isFile()) {

            // read the file
            readFile(path);

          } else if (stats.isDirectory()) {

            // gets list of files in the directory, and runs the readFile function for each one
            fs.readdir(path, 'utf8', (err, filenames) => filenames.forEach(readFile));

          } else {

            throw new Error('Unable to determine whether the "path" argument is a file or directory.');

          }

        });

        // TODO: read the schema / directory of schemas into memory
          //find out what the user path variable points to file or directory
          // - use fs.stat and stats.isDirectory to check for directory
          //problems to solve: determine whether user gave file or folder in path variable
        // TODO: preprocess each schema
        // TODO: generate index.html using Handlebars
        // TODO: generate a page for each schema using Handlebars, and place them in the /schemas folder
        // TODO: export a method for generating only the HTML for a single schema

      });

    });

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
