const hljs       = require(`highlight.js/lib/highlight`);
const javascript = require(`highlight.js/lib/languages/javascript`);
const shell      = require(`highlight.js/lib/languages/shell`);

hljs.registerLanguage(`javascript`, javascript);
hljs.registerLanguage(`shell`, shell);

module.exports = hljs;
