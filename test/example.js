const fs  = require('fs');
const hbs = require('handlebars');

fs.readFile('test/schema.json', 'utf8', (err, data) => {

  if (err) throw err;

  const schema = JSON.parse(data);

  fs.readFile('src/schema.hbs', 'utf8', (err, data) => {

    if (err) throw err;

    hbs.registerPartial('schema', data);

    fs.readFile('src/schema-page.hbs', 'utf8', (err, data) => {

      if (err) throw err;

      const convert = hbs.compile(data);
      const html = convert({ schema });

      fs.writeFile('example/schema.html', html, err => {
        if (err) throw err;
      });

    });

  });

});
