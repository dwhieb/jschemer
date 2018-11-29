const rimraf        = require(`rimraf`);
const { promisify } = require(`util`);

const removeDir = promisify(rimraf);

module.exports = removeDir;
