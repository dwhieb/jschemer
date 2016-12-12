#!/usr/bin/env node

// modules
const fs = require('fs');
const meta = require('./package.json');
const path = require('path');
const program = require('commander');

const wrapError = (err, message) => {
  const e = new Error(message);
  e.inner = err;
  return e;
};

// the jschemer function exported by this module
const jschemer = (schemaPath, options = {}) => {

  // validate arguments
  if (typeof schemaPath !== 'string') {
    throw new TypeError(`The 'schemaPath' argument must be a string.`);
  }

  if (typeof options !== 'object') {
    throw new TypeError(`The 'options' argument must be an object.`);
  }

  if (options.css && typeof options.css !== 'string') {
    throw new TypeError(`The 'css' option must be a string.`);
  }

  if (options.ignore && !(
    Array.isArray(options.ignore)
    && options.ignore.every(item => typeof item === 'string')
  )) {
    throw new TypeError(`The 'ignore' option must be an array of filenames.`);
  }

  if (options.out && typeof options.out !== 'string') {
    throw new TypeError(`The 'out' option must be a string.`);
  }

  if (options.readme && typeof options.readme !== 'string') {
    throw new TypeError(`The 'readme' option must be a string.`);
  }

  // initialize options and other function-scoped variables
  const cssPath = options.css || 'src/jschemer.css';
  const cssFilename = path.parse(cssPath).base;
  const filenames = [];
  const ignore = options.ignore || [];
  const outPath = options.out || 'out';
  const nav = [];
  const readmePath = options.readme || 'src/readme.md';
  const schemas = [];
  let readme = ''; // eslint-disable-line no-unused-vars

  // copy the CSS file into the /out directory
  const copyCSS = () => new Promise((resolve, reject) => {

    const rs = fs.createReadStream(cssPath);
    const ws = fs.createWriteStream(`${outPath}/${cssFilename}`);

    rs.on('error', err => reject(wrapError(err, `Unable to read from the CSS file.`)));
    ws.on('error', err => reject(wrapError(err, `Unable to write to jschemer.css.`)));
    ws.on('finish', resolve);
    rs.pipe(ws);

  });

  // creates the index.html page
  const createIndexPage = () => new Promise((resolve, reject) => {
    // TODO: Alyanna
    // Context:
    // - css
    // - nav
    // - readme
  });

  // create the '/out' directory
  const createOutFolder = () => new Promise((resolve, reject) => {
    fs.mkdir(outPath, err => {

      if (err && err.code !== 'EEXIST') {
        reject(wrapError(err, `Unable to create the output directory, "${outPath}".`));
      }

      resolve();

    });
  });

  // create a documentation page for each schema
  const createSchemaPages = () => Promise.all(schemas.map(schema => new Promise((resolve, reject) => {
    // TODO: Alyanna
    // Context (for each page):
    // - css
    // - nav
    // - schema
  })));

  // create the /out/schemas directory
  const createSchemasFolder = () => new Promise((resolve, reject) => {

    fs.mkdir(path.join(outPath, 'schemas'), err => {

      if (err && !err.message.includes('EEXIST')) {
        reject(wrapError(err, `Unable to create the /schemas directory.`));
      }

      resolve();

    });

  });

  // adds the list of files to convert to the filenames array
  const getFileNames = () => new Promise((resolve, reject) => {

    // TODO: ignore any files in the ignore array

    // get info about "schemaPath" variable to determine whether it's a file or directory
    fs.stat(schemaPath, (err, stats) => {

      // reject on error
      if (err) {

        reject(wrapError(err, `Unable to retrieve information about the path "${schemaPath}".`));

      // if the provided path is a file, add that path to filenames
      } else if (stats.isFile()) {

        filenames.push(schemaPath);
        resolve();

      // if the provided path is a directory, add each path + filename to the directory
      } else if (stats.isDirectory()) {

        fs.readdir(schemaPath, 'utf8', (err, files) => {
          if (err) {
            reject(wrapError(err, 'Unable to list the files in the provided directory.'));
          } else {
            files.forEach(filename => filenames.push(path.join(schemaPath, filename)));
            resolve();
          }
        });

      } else {

        throw new Error('Unable to determine whether the "schemaPath" argument is a file or directory.');

      }

    });

  });

  // read the contents of the readme file
  const getReadme = () => new Promise((resolve, reject) => {
    fs.readFile(readmePath, 'utf8', (err, res) => {
      if (err) {
        reject(wrapError(err, `Unable to read the contents of the readme.`));
      } else {
        readme = res;
        resolve();
      }

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
  const readFile = filename => new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {

      if (err) {
        reject(wrapError(err, `Error reading the schema file "${filename}".`));
      } else {

        let schema = {};

        try {
          schema = JSON.parse(data);
        } catch (err) {
          throw new SyntaxError(`Could not parse JSON data for the schema file "${filename}".`);
        }

        schema._filename = filename;
        schemas.push(schema);

        resolve();

      }

    });
  });

  // runs the readFile function for each filename in the filenames array
  const readFiles = () => Promise.all(filenames.map(readFile));

  // run each task, in parallel if possible
  return Promise.all([
    createOutFolder().then(createSchemasFolder).then(copyCSS),
    getFileNames().then(readFiles).then(preprocessSchemas),
    getReadme(),
  ]).then(Promise.all([
    createIndexPage(),
    createSchemaPages(),
  ]));

};

// processes the arguments and options if jschemer is run from the command line
if (require.main === module) {

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
