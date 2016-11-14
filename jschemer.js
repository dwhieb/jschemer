#!/usr/bin/env node

const meta = require('./package.json');
const program = require('commander');

const jschemer = function(path, options = {}) {

  if (typeof path !== 'string') {
    throw new TypeError(`The 'path' argument must be a string.`);
  }

  if (typeof options !== 'object') {
    throw new TypeError(`The 'options' argument must be an object.`);
  }

};

// processes the arguments and options if jschemer is run from the command line
if (require.main) {

  const list = val => val.replace(/ /g, '').split(',');

  program
  .version(meta.version)
  .arguments('<path>')
  .option('-c, --css <filename>', `The path to the CSS file to use for styling the documentation. Defaults to 'out/jschemer.css'.`)
  .option('-i, --ignore <filenames>', `A list of filenames to ignore.`, list)
  .option('-o, --out <directory>', `The name of the directory to output files to. Defaults to 'out'.`)
  .option('-r, --readme <filename>', `A readme file (in Markdown) to include in the generated documentation.`)
  .action(path => {

    const options = {
      css:    program.css,
      ignore: program.ignore,
      out:    program.out,
      readme: program.readme,
    };

    jschemer(path, options);

  })
  .parse(process.argv);

}

module.exports = jschemer;
