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

  fdescribe(`defaults`, function() {

    beforeAll(async () => {
      await deleteOutFolder();
      await jschemer();
    });

    afterAll(deleteOutFolder);

    it(`generates a landing page`, async function() {
      const landingPage = await readFile(`out/index.html`, `utf8`); // landing page exists
      expect(landingPage.includes(`Installation`)).toBe(true);      // landing page contains the readme file
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
