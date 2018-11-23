#!/usr/bin/env node

const jschemer                    = require(`./lib/jschemer`);
const { commander: parseOptions } = require(`./lib/helpers`);

if (require.main === module) {
  const opts = parseOptions();
  jschemer(opts);
}

module.exports = jschemer;
