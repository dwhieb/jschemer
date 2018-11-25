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

<!-- TODO: screenshot here -->

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

To customize the readme used on the landing page of the documentation, use the `readme` option to specify the path to a different readme.

To customize the HTML or CSS used to generate the documentation, edit the files in the `/components` folder. The HTML templates are written using [Handlebars][11]. The CSS for the documentation is written in [LESS][12].

In the HTML, each schema and subschema is wrapped in a `<section class=schema>` element. Each keyword in the JSON Schema is wrapped in a single element (typically a `<div>` or `<p>`) with two CSS classes: the name of the keyword (e.g. `minimum`, `additional-items`, etc.) and `prop`. Keywords are converted from camelCase to param-case for class names.

For example, here is the HTML for JSON Schema's `minimum` keyword. If a JSON Schema has the `minimum` keyword in it, it will use the following Handlebars code.

```hbs
{{#if minimum}}
  <p class='minimum prop'><strong>Minimum:</strong> <code>{{minimum}}</code></p>
{{/if}}
```

## Notes

* Each schema is validated using [ajv][10] when the documentation is generated. If a schema cannot be parsed as JSON, or is not a valid schema, it will be ignored, and a warning will be shown in the console.

* When using the `$ref` keyword, you may provide additional keywords in the referencing schema as well, and jschemer will include them in the documentation. This is useful so that your end users don't need to visit the referenced schema to see information about it. If both the referencing schema and the referenced schema have the same keyword, the value of the referencing schema will be used. This is most useful when you would like to provide specific notes (usually in the `description` property) about how an external schema should be used or interpreted in the context of the current schema.

[1]: https://github.com/dwhieb/jschemer#readme
[2]: http://dwhieb.github.io/jschemer/
[3]: https://github.com/dwhieb
[4]: https://www.npmjs.com/package/jschemer
[5]: https://travis-ci.org/dwhieb/jschemer
[6]: https://github.com/dwhieb/jschemer/issues
[7]: https://opensource.org/licenses/MIT
[8]: https://github.com/dwhieb/jschemer
[9]: https://github.com/dwhieb/jschemer/issues/new
[10]: https://www.npmjs.com/package/ajv
[11]: http://handlebarsjs.com/
[12]: http://lesscss.org/
