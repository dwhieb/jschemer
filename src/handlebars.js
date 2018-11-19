const handlebars = require(`handlebars`);
const md         = require(`./markdown`);

// Register markdown helper
handlebars.registerHelper(`md`, (markdown = ``) => md.render(markdown));

module.exports = handlebars;
