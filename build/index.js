const jschemer      = require(`../src`);
const createSpinner = require(`ora`);

void async function build() {

  const docsSpinner = createSpinner(`Generating jschemer documentation`);

  docsSpinner.start();

  try {
    await jschemer({ out: `docs` });
    docsSpinner.succeed();
  } catch (e) {
    docsSpinner.fail(e);
  }

}();
