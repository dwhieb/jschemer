const { copyFile } = require(`fs`).promises;
const path         = require(`path`);

/**
 * Copies the files from dependencies into the project folders as needed
 * @return {Promise}
 */
async function copyFiles() {

  const srcGFMPath  = path.join(__dirname, `../node_modules/github-markdown-css/github-markdown.css`);
  const destGFMPath = path.join(__dirname, `../css/markdown.css`);
  await copyFile(srcGFMPath, destGFMPath);

  const srcHighlightingCSSPath = path.join(__dirname, `../node_modules/highlight.js/styles/atom-one-light.css`);
  const destHighlightingCSSPath = path.join(__dirname, `../css/atom-one-light.css`);
  await copyFile(srcHighlightingCSSPath, destHighlightingCSSPath);

}

module.exports = copyFiles;
