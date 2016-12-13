/* eslint-disable
  consistent-return,
  func-names,
  max-nested-callbacks,
  max-statements,
  prefer-arrow-callback
*/

const exec = require('child_process').exec;
const fs = require('fs');
const jschemer = require('../jschemer');

describe('jschemer', function() {

  const schemaPath = 'test/schema.json';
  const deleteOutFolder = done => exec('rm -r out', done);

  beforeEach(deleteOutFolder);

  it('is a function that returns a Promise', function() {
    expect(typeof jschemer).toBe('function');
    // expect(jschemer(schemaPath).catch(fail) instanceof Promise).toBe(true);
  });

  it('can be run twice consecutively', function(done) {
    jschemer(schemaPath)
    .then(() => jschemer(schemaPath))
    .then(done)
    .catch(fail);
  });

  it('validates arguments correctly', function() {

    const badOpts = () => jschemer(schemaPath, 'string').catch(fail);
    const badPath = () => jschemer({}).catch(fail);
    const noArgs  = () => jschemer().catch(fail);
    const noOpts  = () => jschemer(schemaPath).catch(fail);
    const noPath  = () => jschemer(null, {}).catch(fail);

    expect(badOpts).toThrow();
    expect(badPath).toThrow();
    expect(noArgs).toThrow();
    expect(noOpts).not.toThrow();
    expect(noPath).toThrow();

  });

  it('validates options correctly', function(done) {

    const emptyIgnore     = () => jschemer(schemaPath, { ignore: [] }).catch(fail);
    const emptyOpts       = () => jschemer(schemaPath, {}).catch(fail);
    const invalidIgnore   = () => jschemer(schemaPath, { ignore: ['notreal.json'] }).catch(fail);
    const wrongTypeCss    = () => jschemer(schemaPath, { css: true }).catch(fail);
    const wrongTypeIgnore = () => jschemer(schemaPath, { ignore: true }).catch(fail);
    const wrongTypeOut    = () => jschemer(schemaPath, { out: true }).catch(fail);
    const wrongTypeReadme = () => jschemer(schemaPath, { readme: true }).catch(fail);

    expect(emptyIgnore).not.toThrow();
    expect(emptyOpts).not.toThrow();
    expect(invalidIgnore).not.toThrow();
    expect(wrongTypeCss).toThrow();
    expect(wrongTypeIgnore).toThrow();
    expect(wrongTypeOut).toThrow();
    expect(wrongTypeReadme).toThrow();

    const invalidCss    = () => jschemer(schemaPath, { css: 'does/not/exist' });
    const invalidReadme = () => jschemer(schemaPath, { readme: 'notreal.md' });

    invalidCss()
    .then(fail, () => invalidReadme().then(fail, done))
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

    const checkOutFolder = () => new Promise((resolve, reject) => {
      fs.stat('out', err => {
        if (err) reject(err);
        else resolve();
      });
    });

    const checkSchema = () => new Promise((resolve, reject) => {
      fs.readFile('out/schemas/schema.html', 'utf8', (err, data) => {
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

    jschemer(schemaPath)
    .then(checkOutFolder)
    .then(checkSchemasFolder)
    .then(checkCss)
    // .then(checkIndex) TODO: enable this
    // .then(checkSchema) TODO: enable this
    .then(done)
    .catch(fail);

  });

  xit('creates multiple schemas', function(done) {

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

    jschemer('test/schemas')
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
      fs.readFile('out/index.hbs', 'utf8', (err, data) => {
        if (err) return reject(err);
        expect(data.includes('out/custom.css')).toBe(true);
        resolve();
      });
    });

    jschemer(schemaPath, { css: 'test/custom.css' })
    .then(checkCustomCss)
    // .then(checkLinkPath) TODO: enable this
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
      fs.stat('out/schemas/schema-2.html', 'utf8', err => {
        if (err && err.code === 'ENOENT') return resolve();
        reject(err);
      });
    });

    jschemer('test/schemas', { ignore: ['schema-2.json'] })
    // .then(checkSchema1) TODO: enable this
    // .then(checkSchema2) TODO: enable this
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

    jschemer(schemaPath, { out: 'docs' })
    .then(checkOutFolder)
    .then(deleteDocsFolder)
    .then(done)
    .catch(fail);

  });

  xit('includes a custom readme', function(done) {

    const checkReadme = () => new Promise((resolve, reject) => {
      fs.readFile('out/index.html', 'utf8', (err, data) => {
        if (err) return reject(err);
        expect(data.includes('>Custom Readme>')).toBe(true);
        resolve();
      });
    });

    jschemer(schemaPath, { readme: 'test/custom-readme.md' })
    .then(checkReadme)
    .then(done)
    .catch(fail);

  });

  afterAll(deleteOutFolder);

});
