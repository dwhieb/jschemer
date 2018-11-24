const { mkdir } = require(`fs`).promises;

/**
 * Creates a folder if it does not already exist
 * @param  {String}  dir The path to the new folder
 * @return {Promise}     Returns a promise when the folder is created
 */
async function createDir(dir) {
  try {
    await mkdir(dir);
  } catch (e) {
    if (!e.code === `EEXIST`) throw e;
  }
}

module.exports = createDir;
