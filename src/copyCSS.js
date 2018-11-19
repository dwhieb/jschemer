const { copyFile } = require(`fs`).promises;
const path         = require(`path`);

/**
 * Copies the markdown.css file from the /css folder to the /out folder
 * @param  {String} outDir The path to the /out folder
 * @return {Promise}
 */
function copyCSS(outDir) {

  const inputCSSPath  = path.join(__dirname, `../css/markdown.css`);
  const outputCSSPath = path.join(outDir, `markdown.css`);

  return copyFile(inputCSSPath, outputCSSPath);

}

module.exports = copyCSS;
