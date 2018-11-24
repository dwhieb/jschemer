const AJV      = require(`ajv`);
const jschemer = require(`../lib/jschemer`);
const schema   = require(`./schemas/schema`);

const {
  readdir: readDir,
  readFile,
  stat,
} = require(`fs`).promises;

const {
  deleteOutFolder,
  removeDir,
} = require(`./utilities`);

const ajv = new AJV();

describe(`jschemer`, () => {

  beforeAll(deleteOutFolder);
  afterAll(deleteOutFolder);

  describe(`defaults`, () => {

    it(`generates a landing page`, async () => {
      await jschemer();
      const landingPage = await readFile(`out/index.html`, `utf8`);           // landing page exists
      expect(landingPage.includes(`This is a jschemer project.`)).toBe(true); // landing page contains the readme file
      await removeDir(`out`);
    });

    it(`generates a page for each schema`, async () => {
      await jschemer();
      const files = await readDir(`out/schemas`);
      expect(files[0]).toBe(`schema.html`);
      await removeDir(`out`);
    });

    it(`can be run twice consecutively`, async () => {
      await jschemer();
      await jschemer();
      await removeDir(`out`);
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

describe(`sample data`, () => {

  it(`is a valid JSON schema`, () => {
    try {
      ajv.addSchema(schema);
    } finally {
      if (ajv.errors) console.error(ajv.errors);
      expect(ajv.errors).toBe(null);
    }
  });

});
