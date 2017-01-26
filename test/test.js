/* eslint-disable
  consistent-return,
  func-names,
  max-nested-callbacks,
  max-statements,
  object-curly-newline,
  object-property-newline,
  prefer-arrow-callback,
  sort-keys,
*/

const exec = require('child_process').exec;
const fs = require('fs');
const jschemer = require('../jschemer');

describe('jschemer', function() {

  const schemaPath = 'test/test-schema.json';
  const deleteOutFolder = done => exec('rm -r out', done);

  beforeEach(deleteOutFolder);
  afterAll(deleteOutFolder);

  it('is a function that returns a Promise', function(done) {

    const run = jschemer(schemaPath, { dev: true }).then(done).catch(fail);

    expect(typeof jschemer).toBe('function');
    expect(run instanceof Promise).toBe(true);

  });

  it('can be run twice consecutively', function(done) {
    jschemer(schemaPath, { dev: true })
    .then(() => jschemer(schemaPath, { dev: true }))
    .then(done)
    .catch(fail);
  });

  it('validates arguments correctly', function(done) {

    const noOpts  = () => jschemer(schemaPath, { dev: true });

    const badOpts = () => jschemer(schemaPath, 'string');
    const badPath = () => jschemer({});
    const noArgs  = () => jschemer();
    const noPath  = () => jschemer(null, {});

    expect(badOpts).toThrow();
    expect(badPath).toThrow();
    expect(noArgs).toThrow();
    expect(noPath).toThrow();

    noOpts().then(done).catch(fail);

  });

  it('validates options correctly', function(done) {

    const emptyIgnore = () => new Promise((resolve, reject) => {
      jschemer(schemaPath, { ignore: [], dev: true }).then(resolve).catch(reject);
    });

    const emptyOpts = () => new Promise((resolve, reject) => {
      jschemer(schemaPath, { dev: true }).then(resolve).catch(reject);
    });

    const invalidCss = () => new Promise((resolve, reject) => {
      jschemer(schemaPath, { css: 'does/not/exist', dev: true }).then(reject).catch(resolve);
    });

    const invalidIgnore = () => new Promise((resolve, reject) => {
      jschemer(schemaPath, { ignore: ['notreal.json'], dev: true }).then(resolve).catch(reject);
    });

    const invalidReadme = () => new Promise((resolve, reject) => {
      jschemer(schemaPath, { readme: 'notreal.md', dev: true }).then(reject).catch(resolve);
    });

    const wrongTypeCss = () => jschemer(schemaPath, { css: true, dev: true });

    const wrongTypeIgnore = () => jschemer(schemaPath, { ignore: true, dev: true });

    const wrongTypeOut = () => jschemer(schemaPath, { out: true, dev: true });

    const wrongTypeReadme = () => jschemer(schemaPath, { readme: true, dev: true });

    expect(wrongTypeCss).toThrow();
    expect(wrongTypeIgnore).toThrow();
    expect(wrongTypeOut).toThrow();
    expect(wrongTypeReadme).toThrow();

    Promise.all([
      emptyIgnore(),
      emptyOpts(),
      invalidCss(),
      invalidIgnore(),
      invalidReadme(),
    ])
    .then(done)
    .catch(fail);

  });

  it('creates the documentation folder and files', function(done) {

    const checkCss = () => new Promise((resolve, reject) => {
      fs.readFile('out/jschemer.css', 'utf8', (err, data) => {
        if (err) return reject(err);
        const comment = 'default stylesheet for jschemer documentation pages';

        expect(data.includes(comment)).toBe(true);
        resolve();
      });
    });

    const checkIndex = () => new Promise((resolve, reject) => {
      fs.readFile('out/index.html', 'utf8', (err, data) => {
        if (err) return reject(err);
        const text = 'Click on any of the schemas in the menu to view its documentation.';
        expect(data.includes(text)).toBe(true);
        resolve();
      });
    });

    const checkLogo = () => new Promise((resolve, reject) => {
      fs.stat('out/json-schema.svg', err => {
        if (err) reject(err);
        else resolve();
      });
    });

    const checkOutFolder = () => new Promise((resolve, reject) => {
      fs.stat('out', err => {
        if (err) reject(err);
        else resolve();
      });
    });

    const checkSchema = () => new Promise((resolve, reject) => {
      fs.readFile('out/schemas/test-schema.html', 'utf8', (err, data) => {
        if (err) return reject(err);
        expect(data.includes('>Test Schema<')).toBe(true);
        resolve();
      });
    });

    const checkSchemasFolder = () => new Promise((resolve, reject) => {
      fs.stat('out/schemas', err => {
        if (err) reject(err);
        else resolve();
      });
    });

    jschemer(schemaPath, { dev: true })
    .then(checkOutFolder)
    .then(checkSchemasFolder)
    .then(checkCss)
    .then(checkLogo)
    .then(checkIndex)
    .then(checkSchema)
    .then(done)
    .catch(fail);

  });

  it('creates multiple schemas', function(done) {

    const checkSchema1 = () => new Promise((resolve, reject) => {
      fs.readFile('out/schemas/schema-1.html', 'utf8', (err, data) => {
        if (err) return reject(err);
        expect(data.includes('>Test Schema 1<')).toBe(true);
        resolve();
      });
    });

    const checkSchema2 = () => new Promise((resolve, reject) => {
      fs.readFile('out/schemas/schema-2.html', 'utf8', (err, data) => {
        if (err) return reject(err);
        expect(data.includes('>Test Schema 2<')).toBe(true);
        resolve();
      });
    });

    jschemer('test/schemas', { dev: true })
    .then(checkSchema1)
    .then(checkSchema2)
    .then(done)
    .catch(fail);

  });

  it('creates a custom CSS file', function(done) {

    const checkCustomCss = () => new Promise((resolve, reject) => {
      fs.readFile('out/custom.css', 'utf8', (err, data) => {
        if (err) return reject(err);
        expect(data.includes('color: yellow;')).toBe(true);
        resolve();
      });
    });

    const checkLinkPath = () => new Promise((resolve, reject) => {
      fs.readFile('out/index.html', 'utf8', (err, data) => {
        if (err) return reject(err);
        expect(data.includes('rel=stylesheet href="custom.css"')).toBe(true);
        resolve();
      });
    });

    jschemer(schemaPath, { css: 'test/custom.css', dev: true })
    .then(checkCustomCss)
    .then(checkLinkPath)
    .then(done)
    .catch(fail);

  });

  it('ignores files', function(done) {

    const checkSchema1 = () => new Promise((resolve, reject) => {
      fs.readFile('out/schemas/schema-1.html', 'utf8', (err, data) => {
        if (err) return reject(err);
        expect(data.includes('>Test Schema 1<')).toBe(true);
        resolve();
      });
    });

    const checkSchema2 = () => new Promise((resolve, reject) => {
      fs.stat('out/schemas/schema-2.html', err => {
        if (err && err.code.includes('ENOENT')) resolve();
        else reject(err);
      });
    });

    jschemer('test/schemas', { ignore: ['schema-2.json'], dev: true })
    .then(checkSchema1)
    .then(checkSchema2)
    .then(done)
    .catch(fail);

  });

  it('creates a custom /out folder', function(done) {

    const checkOutFolder = () => new Promise((resolve, reject) => {
      fs.stat('docs', err => {
        if (err) reject(err);
        else resolve();
      });
    });

    const deleteDocsFolder = () => new Promise(resolve => {
      exec('rm -r docs', resolve);
    });

    jschemer(schemaPath, { out: 'docs', dev: true })
    .then(checkOutFolder)
    .then(deleteDocsFolder)
    .then(done)
    .catch(fail);

  });

  it('includes a custom readme', function(done) {

    const checkReadme = () => new Promise((resolve, reject) => {
      fs.readFile('out/index.html', 'utf8', (err, data) => {
        if (err) return reject(err);
        expect(data.includes('Custom Readme')).toBe(true);
        resolve();
      });
    });

    jschemer(schemaPath, { readme: 'test/custom-readme.md', dev: true })
    .then(checkReadme)
    .then(done)
    .catch(fail);

  });

});
