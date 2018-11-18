const jschemer = require(`../src`);

void async function build() {
  await jschemer({ out: `docs` });
}();
