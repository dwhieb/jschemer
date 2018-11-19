const path      = require(`path`);
const removeDir = require(`./removeDir`);

const outDir = path.join(__dirname, `../out`);

/**
 * Removes the /out folder from the project root
 * @return {Promise} Returns a promise when complete
 */
async function deleteOutFolder() {
  await removeDir(outDir);
}

module.exports = deleteOutFolder;
