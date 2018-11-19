const { copyFile } = require(`fs`).promises;
const path         = require(`path`);

/**
 * Copies all the necessary files into the /out folder
 * @param  {String} outDir The path to the /out folder
 * @return {Promise}
 */
async function copyFiles(outDir) {

  const srcMarkdownCSSPath  = path.join(__dirname, `../css/markdown.css`);
  const destMarkdownCSSPath = path.join(outDir, `markdown.css`);
  await copyFile(srcMarkdownCSSPath, destMarkdownCSSPath);

  const srcHighlightingCSSPath  = path.join(__dirname, `../css/atom-one-light.css`);
  const destHighlightingCSSPath = path.join(outDir, `atom-one-light.css`);
  await copyFile(srcHighlightingCSSPath, destHighlightingCSSPath);

}

module.exports = copyFiles;
