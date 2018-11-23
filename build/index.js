const copyFiles     = require(`./copyFiles`);
const createDocs    = require(`./createDocs`);
const createSpinner = require(`ora`);

void async function build() {

  const spinner = createSpinner(`Building project`);
  spinner.start();

  try {
    await copyFiles();
    await createDocs();
  } catch (e) {
    spinner.fail(e.message);
    return console.error(e);
  }

  spinner.succeed(`Project built successfully`);

}();
