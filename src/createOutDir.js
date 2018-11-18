const { mkdir } = require(`fs`).promises;

/**
 * Creates the /out folder in the directory that jschemer was run ing
 * @return {Promise} Returns a Promise when the folder is created
 */
async function createOutDir() {
  try {
    await mkdir(`out`);
  } catch (e) {
    if (!e.code === `EEXIST`) throw e;
  }
}

module.exports = createOutDir;
