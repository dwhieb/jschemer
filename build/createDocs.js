const jschemer = require(`../src`);

const opts = {
  out:     `docs`,
  readme:  `README.md`,
  schemas: `test/schemas`,
};

/**
 * Creates the jschemer project documentation in the /docs folder
 * @return {Promise}
 */
function createDocs() {
  return jschemer(opts);
}

module.exports = createDocs;
