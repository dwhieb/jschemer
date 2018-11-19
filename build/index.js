const copyCSS       = require(`./copyCSS`);
const createDocs    = require(`./createDocs`);
const createSpinner = require(`ora`);

void async function build() {

  const spinner = createSpinner(`Building project`);
  spinner.start();

  await copyCSS();
  await createDocs();

  spinner.succeed(`Project built successfully`);

}();
