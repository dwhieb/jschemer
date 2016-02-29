# JSchemer
A simple utility for generating clean HTML from JSON Schema data.

## WARNING
This package is not yet production-ready, although the HTML generation is stable. The version number will be incremented to 1.0.0 once the package is production-ready.

## Install
`npm install --save jschemer`

## Usage
`const jschemer = require('jschemer')`;

## API
The JSchemer exposes a single method, `convert`, which takes the JSON Schema data as its single argument, in either JSON or string format. `convert` returns a string containing the generated HTML. The returned HTML consists of a single `<section></section>`, not an entire HTML page.

## CSS
JSchemer comes with a default CSS file, `jschemer.css`, which you can link into your generated HTML document. You can easily customize this file, or edit its source, `jschemer.less`, and use LESS to regenerate the CSS. The HTML generated by JSchemer is also designed to be easy to style: each type of object and property is given an easily-identifiable class, such as `additional-items` or `description`, so that you can create your own stylesheet using these classes. CSS class names follow these conventions:

* Each JSON Schema keyword/attribute is associated with exactly one HTML element in the generated documentation, which is given the CSS class for that keyword (e.g. `class=max-length`). This element may contain other elements that may or may not have CSS classes, but which can be targeted using CSS child selectors.

* camelCase keywords in JSON Schema are given a hyphen-separated CSS class name, e.g. `max-items`.

* HTML elements in the generated documentation are also given CSS classes labeling the data type they apply to: `array-prop`, `numeric-prop`, `object-prop`, `string-prop`. Attributes that apply to any data type, such as `type`, are just given the class `prop`. Metadata keywords such as `title` are given the class `meta-prop`.

* An example:
```
<div class='additional-items array-prop'>
  <h2>Additional Items</h2>
  <code>true</code>
</div>
```

If you would prefer the properties of a schema to display in a different order, I recommend using CSS3 Flexbox's `order` property to change their order. Note that this must then be set on all the sibling elements as well.

## Notes
* JSchemer assumes your JSON data is valid according to v4 of the JSON Schema specification. You should validate your JSON Schema data before running JSchemer.
* [Default values for keywords]

## Technical Notes
* HTML is generated using Handlebars
* CSS is generated using LESS
* This package was developed using Node
