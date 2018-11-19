const copyFiles     = require(`./copyFiles`);
const createDocs    = require(`./createDocs`);
const createSpinner = require(`ora`);

void async function build() {

  const spinner = createSpinner(`Building project`);
  spinner.start();

  await copyFiles();
  await createDocs();

  spinner.succeed(`Project built successfully`);

}();
