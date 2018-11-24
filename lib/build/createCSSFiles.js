const less = require(`less`);
const path = require(`path`);

const {
  readFile,
  writeFile,
} = require(`fs`).promises;

const componentsDir = path.join(__dirname, `../../components`);

/**
 * Creates the CSS files for the generated documentation using LESS
 * @param  {String}  outDir The path to the /out directory
 * @return {Promise}
 */
async function createCSSFiles(outDir) {

  const pageDir = path.join(componentsDir, `page`);

  // Create CSS file for home page
  const homeLessPath     = path.join(componentsDir, `home/home.less`);
  const readmeDir        = path.join(componentsDir, `readme`);
  const homeLess         = await readFile(homeLessPath, `utf8`);
  const { css: homeCSS } = await less.render(homeLess, { paths: [pageDir, readmeDir] });
  const homeCSSPath      = path.join(outDir, `home.css`);
  await writeFile(homeCSSPath, homeCSS, `utf8`);

  // Create CSS file for schema pages
  const schemaPageLessPath     = path.join(__dirname, `../../components/schema-page/schema-page.less`);
  const schemaPageLess         = await readFile(schemaPageLessPath, `utf8`);
  const { css: schemaPageCSS } = await less.render(schemaPageLess, { paths: [pageDir] });
  const schemaCSSPath          = path.join(outDir, `schema-page.css`);
  await writeFile(schemaCSSPath, schemaPageCSS, `utf8`);

}

module.exports = createCSSFiles;
