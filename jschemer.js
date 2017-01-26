#!/usr/bin/env node

// modules
const fs      = require('fs');
const hbs     = require('handlebars');
const md      = require('markdown').markdown;
const meta    = require('./package.json');
const Path    = require('path');
const program = require('commander');

// register the markdown helper
hbs.registerHelper('md', markdown => md.toHTML(markdown));

// default callback function to run when jschemer completes
const done = () => console.log('jschemer finished creating documentation.'); // eslint-disable-line no-console

// makes minor changes to the JSON Schemas so that they are easier to render in Handlebars
const preprocessSchema = schema => {

  const setTitle = (key, sch) => {
    const s = sch;
    s.title = s.title || key;
    s._key = key;
  };

  const setBooleanOrSchema = (prop, sch) => {

    const s = sch;

    if (typeof s[prop] === 'boolean') {

      s[prop] = { boolean: s[prop] };

    } else if (typeof s[prop] === 'object') {

      preprocessSchema(s[prop]);
      setTitle(prop, s[prop]);
      s[prop]._object = true;

    }

  };

  for (const prop in schema) {

    const s = schema;

    switch (prop) {

      case '$ref': {
        if (s.$ref.startsWith('#')) {
          s.$ref = s.$ref.replace('#/definitions/', '');
        }
        break;
      }

      case 'additionalItems': {
        setBooleanOrSchema(prop, s);
        break;
      }

      case 'additionalProperties': {
        setBooleanOrSchema(prop, s);
        break;
      }

      case 'default': {
        s.default = JSON.stringify(s.default, null, 2);
        break;
      }

      case 'dependencies': {
        for (const key in s.dependencies) {
          if (
            typeof s.dependencies[key] === 'object'
            && !Array.isArray(s.dependencies[key])
          ) {
            preprocessSchema(s.dependencies[key]);
            s.dependencies[key]._object = true;
          }
        }
        break;
      }

      case 'definitions': {
        for (const def in s.definitions) {
          setTitle(def, s.definitions[def]);
        }
        break;
      }

      case 'enum': {
        s.enum = s.enum.map(val => JSON.stringify(val, null, 2));
        break;
      }

      case 'items': {
        if (Array.isArray(s.items)) {
          s.items.forEach(preprocessSchema);
        } else if (typeof s.items === 'object') {
          preprocessSchema(s.items);
          s.items._object = true;
        }
        break;
      }

      case 'patternProperties': {
        for (const patt in s.patternProperties) {
          s.patternProperties[patt] = preprocessSchema(s.patternProperties[patt]);
          s.patternProperties[patt]._pattern = patt;
        }
        break;
      }

      case 'properties': {
        for (const key in s.properties) {
          s.properties[key] = preprocessSchema(s.properties[key]);
          setTitle(key, s.properties[key]);
        }
        break;
      }

      case 'uniqueItems': {
        s.uniqueItems = { boolean: String(s.uniqueItems) };
        break;
      }

      default: {
        break;
      }

    }

  }

  return schema;

};

// validate arguments to jschemer function
const validate = (path, options, cb) => {

  if (typeof path !== 'string') {
    throw new TypeError(`The 'path' argument must be a string.`);
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

  if (typeof cb !== 'function') {
    throw new TypeError(`The 'callback' argument must be a function.`);
  }

};

// generic error wrapper
const wrapError = (err, message) => {
  const e = new Error(message);
  e.inner = err;
  return e;
};

// the jschemer function exported by this module
const jschemer = (path, options = {}, cb = done) => {

  // validate arguments
  validate(path, options, cb);

  // changes base path for dev and testing
  const base = options.dev ? '.' : 'node_modules/jschemer';

  // initialize options and other function-scoped variables
  const cssPath = options.css || `${base}/src/jschemer.css`;
  const cssFilename = Path.parse(cssPath).base;
  const ignore = options.ignore || [];
  const outPath = options.out || 'out';
  const readmePath = options.readme || `${base}/src/readme.md`;
  const nav = [];
  const schemas = [];
  let schemaPath = path;

  // copy the CSS file into the /out directory
  const copyCss = () => new Promise((resolve, reject) => {
    const rs = fs.createReadStream(cssPath);
    const ws = fs.createWriteStream(`${outPath}/${cssFilename}`);

    rs.on('error', err => {
      const e = wrapError(err, `Unable to read from the CSS file.`);
      reject(e);
      cb(e);
    });

    ws.on('error', err => {
      const e = wrapError(err, `Unable to write to jschemer.css.`);
      reject(e);
      cb(e);
    });

    ws.on('finish', resolve);
    rs.pipe(ws);

  });

  // copy the JSON Schema logo into the /out directory
  const copyLogo = () => new Promise((resolve, reject) => {
    const rs = fs.createReadStream(`${base}/src/img/json-schema.svg`);
    const ws = fs.createWriteStream(`${outPath}/json-schema.svg`);

    rs.on('error', err => {
      const e = wrapError(err, 'Unable to read the json-schema.svg file.');
      reject(e);
      cb(e);
    });

    ws.on('error', err => {
      const e = wrapError(err, 'Unable to write the json-schema.svg file.');
      reject(e);
      cb(e);
    });

    ws.on('finish', resolve);
    rs.pipe(ws);

  });

  // copy the necessary source files into the /out directory
  const copySourceFiles = () => Promise.all([
    copyCss(),
    copyLogo(),
  ]);

  // creates the index.html page
  const createIndexPage = readme => new Promise((resolve, reject) => {
    fs.readFile(`${base}/src/templates/index.hbs`, 'utf8', (err, template) => {

      if (err) {
        const e = wrapError(err, 'Unable to read the contents of "index.hbs".');
        reject(e);
        return cb(e);
      }

      const convert = hbs.compile(template);

      const context = {
        css: cssFilename,
        nav,
        readme,
      };

      const html = convert(context);

      fs.writeFile(`${outPath}/index.html`, html, 'utf8', err => {

        if (err) {
          const e = wrapError(err, `Unable to write "index.html" file.`);
          reject(e);
          return cb(e);
        }

        resolve();

      });

    });
  });

  // create the '/out' directory
  const createOutFolder = () => new Promise((resolve, reject) => {
    fs.mkdir(outPath, err => {

      if (err && err.code !== 'EEXIST') {
        const e = wrapError(err, `Unable to create the output directory, "${outPath}".`);
        reject(e);
        return cb(e);
      }

      resolve();

    });
  });

  // create a documentation page for each schema
  const createSchemaPages = pageTemplate => Promise.all(
    schemas.map(schema => new Promise((resolve, reject) => {

      const convert = hbs.compile(pageTemplate);

      const html = convert({
        cssFilename,
        nav,
        schema,
      });

      const filename = schema._filename.includes('.json') ?
        schema._filename.replace('.json', '.html') :
        `${schema._filename}.html`;

      fs.writeFile(Path.join(outPath, 'schemas', filename), html, err => {

        if (err) {
          const e = wrapError(err, `Unable to create documentation page for the "${schema.title}" schema.`);
          reject(e);
          return cb(e);
        }

        resolve();

      });

    }))
  );

  // create the /out/schemas directory
  const createSchemasFolder = () => new Promise((resolve, reject) => {

    fs.mkdir(Path.join(outPath, 'schemas'), err => {

      if (err && !err.message.includes('EEXIST')) {
        const e = wrapError(err, `Unable to create the /schemas directory.`);
        reject(e);
        return cb(e);
      }

      resolve();

    });

  });

  // adds the list of files to convert to the filenames array
  const getFileNames = () => new Promise((resolve, reject) => {

    const filenames = [];

    const addFilename = filename => {
      if (!ignore.includes(filename)) filenames.push(filename);
    };

    // get info about "path" variable to determine whether it's a file or directory
    fs.stat(path, (err, stats) => {

      // reject on error
      if (err) {

        const e = wrapError(err, `Unable to retrieve information about the path "${path}".`);
        reject(e);
        return cb(e);

      // if the provided path is a file, add that path to filenames
      } else if (stats.isFile()) {

        const filename = Path.parse(path).base;
        const regexp = new RegExp(`${filename}$`);

        schemaPath = path.replace(regexp, '');
        addFilename(filename);
        resolve(filenames);

      // if the provided path is a directory, add each path + filename to the directory
      } else if (stats.isDirectory()) {

        fs.readdir(path, 'utf8', (err, files) => {

          if (err) {
            const e = wrapError(err, 'Unable to list the files in the provided directory.');
            reject(e);
            return cb(e);
          }

          files.forEach(addFilename);
          resolve(filenames);

        });

      } else {

        const e = new Error('Unable to determine whether the "path" argument is a file or directory.');
        reject(e);
        return cb(e);

      }

    });

  });

  // read the contents of the readme file
  const getReadme = () => new Promise((resolve, reject) => {
    fs.readFile(readmePath, 'utf8', (err, readme) => {

      if (err) {
        const e = wrapError(err, 'Unable to read the contents of the readme.');
        reject(e);
        return cb(e);
      }

      resolve(readme);

    });
  });

  const preprocessSchemas = () => schemas.forEach(schema => {

    nav.push({
      filename: schema._filename.replace('.json', '.html'),
      title:    schema.title,
    });

    preprocessSchema(schema);

  });

  // reads a file and adds its data to the schemas array
  const readSchema = filename => new Promise((resolve, reject) => {
    fs.readFile(Path.join(schemaPath, filename), 'utf8', (err, data) => {

      if (err) {
        const e = wrapError(err, `Error reading the schema file "${filename}".`);
        reject(e);
        return cb(e);
      }

      let schema = {};

      try {
        schema = JSON.parse(data);
      } catch (err) {
        const e = new SyntaxError(`Could not parse JSON data for the schema file "${filename}".`);
        reject(e);
        return cb(e);
      }

      schema._filename = filename;
      schemas.push(schema);

      resolve();

    });
  });

  // runs the readFile function for each filename in the filenames array
  const readSchemaFiles = filenames => Promise.all(filenames.map(readSchema));

  // gets the contents of schema-page.hbs
  const readSchemaPageTemplate = () => new Promise((resolve, reject) => {
    fs.readFile(`${base}/src/templates/schema-page.hbs`, 'utf8', (err, pageTemplate) => {

      if (err) {
        const e = wrapError(err, 'Unable to read the contents of schema-page.hbs.');
        reject(e);
        return cb(e);

      }

      resolve(pageTemplate);

    });
  });

  // get the contents of schema.hbs and register its as a Handlebars partial
  const readSchemaTemplate = () => new Promise((resolve, reject) => {
    fs.readFile(`${base}/src/templates/schema.hbs`, 'utf8', (err, schemaTemplate) => {

      if (err) {
        const e = wrapError(err, 'Unable to read contents of schema.hbs.');
        reject(e);
        return cb(e);

      }
      hbs.registerPartial('schemaTemplate', schemaTemplate);
      resolve();

    });
  });

  // run each task, in parallel if possible
  return Promise.all([
    createOutFolder().then(createSchemasFolder).then(copySourceFiles),
    getFileNames().then(readSchemaFiles).then(preprocessSchemas),
  ]).then(() => Promise.all([
    getReadme().then(createIndexPage),
    readSchemaTemplate().then(readSchemaPageTemplate).then(createSchemaPages),
  ])).then(() => cb());

};

// processes the arguments and options if jschemer is run from the command line
if (require.main === module) {

  const list = val => val.replace(/ /g, '').split(',');

  program
  .version(meta.version) // set version
  .arguments('<path>')   // set required <path> argument

  // set options
  .option('-c, --css <filename>', `The path to the CSS file to use for styling the documentation. Defaults to 'out/jschemer.css'.`)
  .option('-i, --ignore <filenames>', `A comma-separated (no spaces) list of filenames to ignore.`, list)
  .option('-o, --out <directory>', `The name of the directory to output files to. Defaults to 'out'.`)
  .option('-r, --readme <filename>', `A readme file (in Markdown) to include in the generated documentation.`)
  .option('--dev', `Allows jschemer to be run and tested within its own directory.`)

  // run this once the arguments are parsed
  .action(path => {

    // collect the options passed to the command line
    const options = {
      css:    program.css,
      dev:    program.dev,
      ignore: program.ignore,
      out:    program.out,
      readme: program.readme,
    };

    // run jschemer using the passed options
    jschemer(path, options).catch(console.err); // eslint-disable-line no-console

  })

  // parse the command line arguments
  .parse(process.argv);

  // throw an error if the <path> argument is missing
  if (!program.args.length) {
    throw new Error(`A <path> argument must be provided. The <path> argument may either be a single file or a directory.`);
  }

}

module.exports = jschemer;
