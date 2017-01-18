#!/usr/bin/env node

// modules
const fs = require('fs');
const hbs = require('handlebars');
const meta = require('./package.json');
const Path = require('path');
const program = require('commander');

hbs.registerHelper('md', () => {
  return '';
});

const wrapError = (err, message) => {

  const e = new Error(message);

  e.inner = err;
  return e;

};

// the jschemer function exported by this module
const jschemer = (path, options = {}, cb = function() {}) => {

  // validate arguments
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

  // initialize options and other function-scoped variables
  const cssPath = options.css || 'src/jschemer.css';
  const cssFilename = Path.parse(cssPath).base;
  const ignore = options.ignore || [];
  const outPath = options.out || 'out';
  const readmePath = options.readme || 'src/readme.md';
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
    const rs = fs.createReadStream('src/img/json-schema.svg');
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

  const context = ({
    css: cssPath,
    nav: nav,
    readme: readmePath,
  });

  const createIndexPage = readme => new Promise((resolve, reject) => {
    fs.readFile("src/templates/index.hbs", 'utf8', (err, template) =>{
      const convert = hbs.compile(template);
      const html = convert(context);
      fs.writeFile(`${outPath}/index.html`, html, 'utf8', (err, html) => {
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
  const createSchemaPages = pageTemplate => Promise.all(schemas.map(schema => {
    return new Promise((resolve, reject) => {

      const convert = hbs.compile(pageTemplate);

      const html = convert({
        cssFilename,
        nav,
        schema,
      });

      const filename = schema._filename.includes('.json') ?
        schema._filename.replace('.json', '.html')
        : `${schema._filename}.html`;

      fs.writeFile(Path.join(outPath, 'schemas', filename), html, err => {

        if (err) {
          const e = wrapError(err, `Unable to create documentation page for the "${schema.title}" schema.`);
          reject(e);
          return cb(e);
        }

        resolve();

      });

    });
  }));

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

  // makes minor changes to the JSON Schemas so that they are easier to render in Handlebars
  // (also populates the nav array)
  const preprocess = schema => {

    const setTitle = (key, sch) => {
      sch.title = sch.title || key;
      sch._key = key;
    };

    const setBooleanOrSchema = (prop, sch) => {
      if (typeof sch[prop] === 'boolean') {
        sch[prop] = { boolean: sch[prop] };
      } else if (typeof sch[prop] === 'object') {
        preprocess(sch[prop]);
        setTitle(prop, sch[prop]);
        sch[prop]._object = true;
      }
    };

    for (const prop in schema) {

      switch (prop) {

        case '$ref': {
          if (schema.$ref.startsWith('#')) {
            schema.$ref = schema.$ref.replace('#/definitions/', '');
          }
          break;
        }

        case 'additionalItems': {
          setBooleanOrSchema(prop, schema);
          break;
        }

        case 'additionalProperties': {
          setBooleanOrSchema(prop, schema);
          break;
        }

        case 'default': {
          schema.default = JSON.stringify(schema.default, null, 2);
          break;
        }

        case 'dependencies': {
          for (const key in schema.dependencies) {
            if (
              typeof schema.dependencies[key] === 'object'
              && !Array.isArray(schema.dependencies[key])
            ) {
              preprocess(schema.dependencies[key]);
              schema.dependencies[key]._object = true;
            }
          }
          break;
        }

        case 'definitions': {
          for (const def in schema.definitions) {
            setTitle(def, schema.definitions[def]);
          }
          break;
        }

        case 'enum': {
          schema.enum = schema.enum.map(val => JSON.stringify(val, null, 2));
          break;
        }

        case 'items': {
          if (Array.isArray(schema.items)) {
            schema.items.forEach(preprocess);
          } else if (typeof schema.items === 'object') {
            preprocess(schema.items);
            schema.items._object = true;
          }
          break;
        }

        case 'patternProperties': {
          for (const patt in schema.patternProperties) {
            schema.patternProperties[patt] = preprocess(schema.patternProperties[patt]);
            schema.patternProperties[patt]._pattern = patt;
          }
          break;
        }

        case 'properties': {
          for (const key in schema.properties) {
            schema.properties[key] = preprocess(schema.properties[key]);
            setTitle(key, schema.properties[key]);
          }
          break;
        }

        case 'uniqueItems': {
          schema.uniqueItems = { boolean: String(schema.uniqueItems) };
          break;
        }

        default: {
          break;
        }

      }

    }

    return schema;

  };

  const preprocessSchemas = () => schemas.forEach(schema => {

    nav.push({
      filename: schema._filename,
      title:    schema.title,
    });

    preprocess(schema);

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
    fs.readFile('src/templates/schema-page.hbs', 'utf8', (err, pageTemplate) => {

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
    fs.readFile('src/templates/schema.hbs', 'utf8', (err, schemaTemplate) => {

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
    jschemer(path, options).catch(console.err);

  })

  // parse the command line arguments
  .parse(process.argv);

  // throw an error if the <path> argument is missing
  if (!program.args.length) {
    throw new Error(`A <path> argument must be provided. The <path> argument may either be a single file or a directory.`);
  }

}

module.exports = jschemer;
