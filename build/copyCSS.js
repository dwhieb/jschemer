const { copyFile } = require(`fs`).promises;
const path         = require(`path`);

const inputGFMPath  = path.join(__dirname, `../node_modules/github-markdown-css/github-markdown.css`);
const outputGFMPath = path.join(__dirname, `../css/markdown.css`);

/**
 * Copies the GitHub Markdown CSS from github-markdown-css into the /css folder
 * @return {Promise}
 */
function copyCSS() {
  return copyFile(inputGFMPath, outputGFMPath);
}

module.exports = copyCSS;
