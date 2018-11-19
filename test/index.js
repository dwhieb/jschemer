const jschemer = require(`../src`);

const {
  readFile,
  stat,
} = require(`fs`).promises;

const {
  deleteOutFolder,
  removeDir,
} = require(`./utilities`);

describe(`jschemer`, function() {

  beforeAll(deleteOutFolder);
  afterEach(deleteOutFolder);

  describe(`defaults`, function() {

    beforeAll(jschemer);

    it(`generates a landing page`, async function() {
      const landingPage = await readFile(`out/index.html`, `utf8`);           // landing page exists
      expect(landingPage.includes(`This is a jschemer project.`)).toBe(true); // landing page contains the readme file
    });

  });

  describe(`options`, () => {

    it(`out`, async () => {
      const out = `custom`;
      await jschemer({ out });
      const info = await stat(out);
      expect(info.isDirectory()).toBe(true);
      await removeDir(out);
    });

  });

});
