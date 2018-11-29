const hljs       = require(`highlight.js/lib/highlight`);
const handlebars = require(`highlight.js/lib/languages/handlebars`);
const javascript = require(`highlight.js/lib/languages/javascript`);
const shell      = require(`highlight.js/lib/languages/shell`);

hljs.registerLanguage(`handlebars`, handlebars);
hljs.registerLanguage(`javascript`, javascript);
hljs.registerLanguage(`shell`, shell);

module.exports = hljs;
