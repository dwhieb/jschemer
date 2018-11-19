const jschemer      = require(`../src`);
const createSpinner = require(`ora`);

void async function build() {
  const spinner = createSpinner(`Building project`);
  spinner.start();
  await jschemer({ out: `docs` });
  spinner.succeed(`Project built successfully`);
}();
