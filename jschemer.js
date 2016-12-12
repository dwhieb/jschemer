#!/usr/bin/env node

// modules
const fs = require('fs');
const meta = require('./package.json');
const path = require('path');
const program = require('commander');

const throwError = (err, message) => {
  console.error(err);
  throw new Error(message);
};

// the jschemer function exported by this module
const jschemer = (schemaPath, options = {}) => {

  // validate arguments
  // TODO: (Alyanna) validate other arguments (commander only validates them when run from the command line)

  if (typeof schemaPath !== 'string') {
    throw new TypeError(`The 'schemaPath' argument must be a string.`);
  }

  if (typeof options !== 'object') {
    throw new TypeError(`The 'options' argument must be an object.`);
  }

  const schemas = [];
  const cssPath = options.css || 'src/jschemer.css';
  const cssFilename = path.parse(cssPath).base;
  const filenames = [];
  const nav = [];
  let readme = ''; // eslint-disable-line no-unused-vars

  // copy the CSS file into the /out directory
  const copyCSS = () => new Promise(resolve => {

    const rs = fs.createReadStream(cssPath);
    const ws = fs.createWriteStream(`out/${cssFilename}`);

    rs.on('error', err => throwError(err, `Unable to read from the CSS file.`));
    ws.on('error', err => throwError(err, `Unable to write to jschemer.css.`));
    ws.on('finish', resolve);
    rs.pipe(ws);

  });

  // creates the index.html page
  const createIndexPage = () => new Promise(resolve => {
    // TODO: Alyanna
    // Context:
    // - css
    // - nav
    // - readme
  });

  // create the '/out' directory
  const createOutFolder = () => new Promise(resolve => {
    fs.mkdir(options.out || 'out', err => {
      if (err) throwError(err, `Unable to create the output directory, "${options.out || 'out'}".`);
      resolve();
    });
  });

  // create a documentation page for each schema
  const createSchemaPages = () => Promise.all(schemas.map(schema => new Promise(resolve => {
    // TODO: Alyanna
    // Context (for each page):
    // - css
    // - nav
    // - schema
  })));

  // create the /out/schemas directory
  const createSchemasFolder = () => new Promise(resolve => {

    fs.mkdir(path.join(options.out || 'out', 'schemas'), err => {

      if (err && !err.message.includes('EEXIST')) {
        throwError(err, `Unable to create the /schemas directory.`);
      }

      resolve();

    });

  });

  // adds the list of files to convert to the filenames array
  const getFileNames = () => new Promise(resolve => {

    // get info about "schemaPath" variable to determine whether it's a file or directory
    fs.stat(schemaPath, (err, stats) => {

      if (err) throwError(err, `Unable to retrieve information about the path "${schemaPath}".`);

      // if the provided path is a file, add that path to filenames
      if (stats.isFile()) {

        const filename = path.parse(schemaPath).base;

        filenames.push(filename);
        resolve();

      // if the provided path is a directory, add each path + filename to the directory
      } else if (stats.isDirectory()) {

        fs.readdir(schemaPath, 'utf8', (err, files) => {
          if (err) throwError(err, 'Unable to list the files in the provided directory.');
          files.forEach(filename => filenames.push(path.join(schemaPath, filename)));
          resolve();
        });

      } else {

        throw new Error('Unable to determine whether the "schemaPath" argument is a file or directory.');

      }

    });

  });

  // read the contents of the readme file
  const getReadme = () => new Promise(resolve => {
    fs.readFile(options.readme || 'src/readme.md', 'utf8', (err, res) => {
      if (err) throwError(err, `Unable to read the contents of the readme.`);
      readme = res;
      resolve();
    });
  });

  // makes minor changes to the JSON Schemas so that they are easier to render in Handlebars
  // (also populates the nav array)
  const preprocessSchemas = () => schemas.forEach(function preprocess(schema) {

    nav.push({
      title:    schema.title,
      filename: schema._filename,
    });

    // TODO: Danny

    // The preprocess function should be called recursively on any subschemas

    // NB: The "_filename" attribute was already added during the readFile step

    return schema;

  });

  // reads a file and adds its data to the schemas array
  const readFile = filename => new Promise(resolve => {
    fs.readFile(filename, 'utf8', (err, data) => {

      if (err) throwError(err, `Error reading the schema file "${filename}".`);

      let schema = {};

      try {
        schema = JSON.parse(data);
      } catch (err) {
        throw new SyntaxError(`Could not parse JSON data for the schema file "${filename}".`);
      }

      schema._filename = filename;
      schemas.push(schema);

      resolve();

    });
  });

  // runs the readFile function for each filename in the filenames array
  const readFiles = () => Promise.all(filenames.map(readFile));

  // [
  //   createOutFolder => [createSchemasFolder, copyCSS]
  //   getFileNames => readFiles => preprocessSchemas
  //   getReadme
  // ]
  // createContext
  // [
  //   createIndexPage
  //   createSchemaPages
  // ]

};

// processes the arguments and options if jschemer is run from the command line
if (require.main) {

  const list = val => val.replace(/ /g, '').split(',');

  program
  .version(meta.version)     // set version
  .arguments('<schemaPath>') // set required <schemaPath> argument

  // set options
  .option('-c, --css <filename>', `The path to the CSS file to use for styling the documentation. Defaults to 'out/jschemer.css'.`)
  .option('-i, --ignore <filenames>', `A comma-separated (no spaces) list of filenames to ignore.`, list)
  .option('-o, --out <directory>', `The name of the directory to output files to. Defaults to 'out'.`)
  .option('-r, --readme <filename>', `A readme file (in Markdown) to include in the generated documentation.`)

  // run this once the arguments are parsed
  .action(schemaPath => {

    // collect the options passed to the command line
    const options = {
      css:    program.css,
      ignore: program.ignore,
      out:    program.out,
      readme: program.readme,
    };

    // run jschemer using the passed options
    jschemer(schemaPath, options);

  })

  // parse the command line arguments
  .parse(process.argv);

  // throw an error if the <schemaPath> argument is missing
  if (!program.args.length) {
    throw new Error(`A <schemaPath> argument must be provided. The <schemaPath> argument may either be a single file or a directory.`);
  }

}

module.exports = jschemer;
