/* eslint-disable
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
    expect(jschemer(schemaPath) instanceof Promise).toBe(true);
  });

  it('can be run twice consecutively', function(done) {
    jschemer(schemaPath)
    .then(() => jschemer(schemaPath))
    .then(done)
    .catch(fail);
  });

  it('validates arguments correctly', function() {

    const badOpts = () => jschemer(schemaPath, 'string');
    const badPath = () => jschemer({});
    const noArgs  = () => jschemer();
    const noOpts  = () => jschemer(schemaPath);
    const noPath  = () => jschemer(null, {});

    expect(badOpts).toThrow();
    expect(badPath).toThrow();
    expect(noArgs).toThrow();
    expect(noOpts).not.toThrow();
    expect(noPath).toThrow();

  });

  it('validates options correctly', function(done) {

    const emptyIgnore     = () => jschemer(schemaPath, { ignore: [] });
    const emptyOpts       = () => jschemer(schemaPath, {});
    const invalidCss      = () => jschemer(schemaPath, { css: 'does/not/exist' });
    const invalidIgnore   = () => jschemer(schemaPath, { ignore: ['notreal.json'] });
    const invalidReadme   = () => jschemer(schemaPath, { readme: 'notreal.md' });
    const wrongTypeCss    = () => jschemer(schemaPath, { css: true });
    const wrongTypeIgnore = () => jschemer(schemaPath, { ignore: true });
    const wrongTypeOut    = () => jschemer(schemaPath, { out: true });
    const wrongTypeReadme = () => jschemer(schemaPath, { readme: true });

    expect(emptyIgnore).not.toThrow();
    expect(emptyOpts).not.toThrow();
    expect(invalidIgnore).not.toThrow();
    expect(wrongTypeCss).toThrow();
    expect(wrongTypeIgnore).toThrow();
    expect(wrongTypeOut).toThrow();
    expect(wrongTypeReadme).toThrow();

    Promise.all([
      invalidReadme().then(fail).catch(done),
      invalidCss().then(fail).catch(done),
    ]).then(done);


  });

  xit('creates the documentation folder and files', function(done) {

    const checkCss = () => new Promise(resolve => {
      fs.stat('out/jschemer.css', err => {
        // TODO: CSS should contain a known rule from the default CSS
        if (err) fail(err);
        else resolve();
      });
    });

    const checkIndex = () => new Promise(resolve => {
      fs.stat('out/index.html', err => {
        // TODO: index.html should contain the default readme
        if (err) fail(err);
        else resolve();
      });
    });

    const checkOutFolder = () => new Promise(resolve => {
      fs.stat('out', err => {
        if (err) fail(err);
        else resolve();
      });
    });

    const checkSchema = () => new Promise(resolve => {
      fs.stat('out/schemas/schema.html', err => {
        // TODO: schema.html should contain the correct title
        if (err) fail(err);
        else resolve();
      });
    });

    const checkSchemasFolder = () => new Promise(resolve => {
      fs.stat('out/schemas', err => {
        if (err) fail(err);
        else resolve();
      });
    });

    jschemer(schemaPath)
    .then(checkOutFolder)
    .then(checkSchemasFolder)
    .then(checkCss)
    .then(checkIndex)
    .then(checkSchema)
    .then(done)
    .catch(fail);

  });

  xit('creates a custom CSS file', function(done) {
    // TODO: custom.css exists, and contains a rule from the original CSS file
  });

  xit('ignores files', function(done) {
    // TODO: schema-1.html exists but schema-2.html does not
  });

  xit('creates a custom /out folder', function(done) {
    // TODO: the folder should be called '/docs'
  });

  xit('includes a custom readme', function(done) {
    // TODO: index.html should include content from the custom readme
  });

  afterAll(deleteOutFolder);

});
