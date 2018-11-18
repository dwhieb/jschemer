const jschemer     = require(`../src`);
const { readFile } = require(`fs`).promises;

describe(`jschemer`, function() {

  it(`generates a landing page`, async function() {
    const index = await readFile(`../out/index.html`, `utf8`);
    expect(index).toBeDefined();
  });

});
