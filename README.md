# [jschemer][1]

[![npm version](https://img.shields.io/npm/v/jschemer.svg)][4]
[![Travis status](https://img.shields.io/travis/dwhieb/jschemer/master.svg)][5]
[![npm downloads](https://img.shields.io/npm/dt/jschemer.svg)][4]
[![GitHub issues](https://img.shields.io/github/issues/dwhieb/jschemer.svg)][6]
[![GitHub](https://img.shields.io/github/license/dwhieb/jschemer.svg)][7]

[![GitHub stars](https://img.shields.io/github/stars/dwhieb/jschemer.svg?label=Stars&style=social)][8]
[![GitHub forks](https://img.shields.io/github/forks/dwhieb/jschemer.svg?label=Fork&style=social)][8]

`jschemer` is a utility that generates documentation for JSON Schemas, providing end users with human-readable web pages instead of raw JSON documents. [See an example of generated `jschemer` documentation here][2]. `jschemer` accepts one or more JSON Schemas as input, and produces an HTML page for each schema, along with a landing page for the documentation. It runs on the Node LTS line.

*Maintained by [Daniel W. Hieber][3]*

[View a demo of documentation generated with `jschemer`.][2]

<!-- screenshot here -->

## Contents
* [Report an Issue][9]
* [Installation & Usage](#installation--usage)
* [Options](#options)
* [Customizing](#customizing)

## Installation & Usage

Install with npm:

```sh
npm i -D jschemer # if installing as a dev dependency
npm i jschemer    # if installing as a core dependency
```

Use in Node:

```js
const jschemer = require(`jschemer`);

// path to your schemas directory
const schemasPath = `/schemas`;

// options
const opts = {
  out: `/docs`,
};

// generate the documentation
jschemer(schemasPath, opts)
.then(/* code to run after documentation is generated */)
.catch(/* catch any errors */);

// jschemer may also be run with defaults
jschemer()
.then(/* code to run after documentation is generated */)
.catch(/* catch any errors */);
```

The `jschemer` module exposes a single function which accepts two arguments: the path to a directory of JSON schemas (defaults to `/schemas`), and an options Object (see the [Options](#options) below). `jschemer` returns a Promise that resolves when the documentation is done being generated.

## Options

Option | Default | Description
------ | ------- | -----------
`out`  | `/out`  | The path to the folder where the documentation will be generated. The folder will be created if it does not already exist.

## Customizing

To customize the HTML used to generate the documentation, edit the `templates/index.html` file.

[1]: https://github.com/dwhieb/jschemer#readme
[2]: http://dwhieb.github.io/jschemer/
[3]: https://github.com/dwhieb
[4]: https://www.npmjs.com/package/jschemer
[5]: https://travis-ci.org/dwhieb/jschemer
[6]: https://github.com/dwhieb/jschemer/issues
[7]: https://opensource.org/licenses/MIT
[8]: https://github.com/dwhieb/jschemer
[9]: https://github.com/dwhieb/jschemer/issues/new
