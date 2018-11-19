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
  afterAll(deleteOutFolder);

  describe(`defaults`, function() {

    it(`generates a landing page`, async () => {
      await jschemer();
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

    it(`readme`, async () => {
      const out    = `out`;
      const readme = `README.md`;
      await jschemer({ out, readme });
      const landingPage = await readFile(`out/index.html`, `utf8`);
      expect(landingPage.includes(`This is a test readme.`)).toBe(true);
      await removeDir(out);
    });

  });

});
