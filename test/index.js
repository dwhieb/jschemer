const { deleteOutFolder } = require(`./utilities`);
const jschemer            = require(`../src`);
const { readFile }        = require(`fs`).promises;

describe(`jschemer`, function() {

  // SETUP
  beforeAll(async () => {

    // Remove /out folder before each test
    await deleteOutFolder();

    // Run jschemer
    await jschemer();

  });

  // TEARDOWN

  // Remove /out folder after all tests are run
  afterAll(deleteOutFolder);

  // TESTS

  it(`generates a landing page`, async function() {
    const index = await readFile(`out/index.html`, `utf8`);
    expect(index).toBeDefined();
  });

});
