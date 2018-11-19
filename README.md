# [jschemer][1]

[![npm version](https://img.shields.io/npm/v/jschemer.svg)][4]
[![Travis status](https://img.shields.io/travis/dwhieb/jschemer/master.svg)][5]
[![npm downloads](https://img.shields.io/npm/dt/jschemer.svg)][4]
[![GitHub issues](https://img.shields.io/github/issues/dwhieb/jschemer.svg)][6]
[![GitHub](https://img.shields.io/github/license/dwhieb/jschemer.svg)][7]

[![GitHub stars](https://img.shields.io/github/stars/dwhieb/jschemer.svg?label=Stars&style=social)][8]
[![GitHub forks](https://img.shields.io/github/forks/dwhieb/jschemer.svg?label=Fork&style=social)][8]

`jschemer` is a utility that generates documentation for JSON Schemas, providing end users with human-readable web pages instead of raw JSON documents. [See an example of generated `jschemer` documentation here][2]. `jschemer` accepts one or more JSON Schemas as input, and produces an HTML page for each schema, along with a landing page for the documentation. It can be run as a Node module or from the command line.

*Maintained by [Daniel W. Hieber][3]*

[View a demo of documentation generated with `jschemer`.][2]

<!-- screenshot here -->

## Contents
* [Report an Issue][9]
* [Installation & Usage](#installation--usage)
* [Options](#options)
* [Customizing](#customizing)

## Installation & Usage

### Installation

```sh
npm i -D jschemer # if installing as a dev dependency
npm i jschemer    # if installing as a core dependency
```

### Command Line Usage

```sh
# This example uses JSON schemas located in the /json folder to generate documentation in the /docs folder
jschemer --schemas json --out docs --readme README.md

# You can also just run jschemer with its defaults (/schemas -> /out)
jschemer
```

### Usage in Node

```js
const jschemer = require(`jschemer`);

// options (see additional options below)
const opts = {
  out:     `docs`,
  readme:  `README.md`,
  schemas: `schemas`,
};

// generate the documentation
jschemer(opts)
.then(/* code to run after documentation is generated */)
.catch(/* catch any errors */);

// jschemer may also be run with defaults
jschemer()
.then(/* code to run after documentation is generated */)
.catch(/* catch any errors */);
```

The `jschemer` module exposes a single function which accepts two arguments: the path to a directory of JSON schemas (defaults to `/schemas`), and an options object (see the [Options](#options) below). The `jschemer` function returns a promise that resolves when the documentation is done being generated.

## Options

Node      | Command Line      | Default     | Description
--------- | :---------------: | ----------- | -----------
`out`     | `‑o`, `‑‑out`     | `out`       | The path to the folder where the documentation will be generated. The folder will be created if it does not already exist.
`readme`  | `‑r`, `‑‑readme`  | —           | The path to a readme file to include in the generated documentation. This will be displayed on the landing page for the documentation (`index.html`). If no readme is provided, a placeholder readme is used.
`schemas` | `‑s`, `‑‑schemas` | `schemas`   | The path to the folder where the JSON schemas are located.

## Customizing

To customize the HTML used to generate the documentation, edit the `templates/index.hbs` file.

To customize the readme used on the landing page of the documentation, use the `readme` option.

[1]: https://github.com/dwhieb/jschemer#readme
[2]: http://dwhieb.github.io/jschemer/
[3]: https://github.com/dwhieb
[4]: https://www.npmjs.com/package/jschemer
[5]: https://travis-ci.org/dwhieb/jschemer
[6]: https://github.com/dwhieb/jschemer/issues
[7]: https://opensource.org/licenses/MIT
[8]: https://github.com/dwhieb/jschemer
[9]: https://github.com/dwhieb/jschemer/issues/new
