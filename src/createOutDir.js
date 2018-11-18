const { mkdir } = require(`fs`).promises;

/**
 * Creates the /out folder in the directory that jschemer was run in
 * @param  {String}  outDir The path to the directory where the documentation will be generated. The folder will be created if it does not already exist.
 * @return {Promise}        Returns a Promise when the folder is created
 */
async function createOutDir(outDir) {
  try {
    await mkdir(outDir);
  } catch (e) {
    if (!e.code === `EEXIST`) throw e;
  }
}

module.exports = createOutDir;
