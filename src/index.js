#!/usr/bin/env node

const jschemer     = require(`./jschemer`);
const parseOptions = require(`./parseOptions`);

if (require.main) {
  const opts = parseOptions();
  jschemer(opts);
}

module.exports = jschemer;
