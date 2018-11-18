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

  describe(`defaults`, () => {

    beforeAll(async () => {
      await deleteOutFolder();
      await jschemer();
    });

    afterAll(deleteOutFolder);

    it(`generates a landing page`, async () => {
      const landingPage = await readFile(`out/index.html`, `utf8`);
      expect(landingPage).toBeDefined();
    });

  });

  describe(`options`, () => {

    beforeAll(deleteOutFolder);
    afterAll(deleteOutFolder);

    it(`out`, async () => {
      const out = `custom`;
      await jschemer({ out });
      const info = await stat(out);
      expect(info.isDirectory()).toBe(true);
      await removeDir(out);
    });

  });

});
