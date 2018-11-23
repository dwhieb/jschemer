const less = require(`less`);
const path = require(`path`);

const {
  readFile,
  writeFile,
} = require(`fs`).promises;

/**
 * Creates the CSS files for the generated documentation using LESS
 * @param  {String}  outDir The path to the /out directory
 * @return {Promise}
 */
async function createCSSFiles(outDir) {

  // Create CSS file for home page
  const homeLessPath     = path.join(__dirname, `../../components/home/home.less`);
  const readmePath       = path.join(__dirname, `../../components/readme`);
  const homeLess         = await readFile(homeLessPath, `utf8`);
  const { css: homeCSS } = await less.render(homeLess, { paths: [readmePath] });
  const homeCSSPath      = path.join(outDir, `home.css`);
  await writeFile(homeCSSPath, homeCSS, `utf8`);

}

module.exports = createCSSFiles;
