//readfile gogauchos.hbs ('template') + data.json ('data')
// save readfile into var
//then compile template which hands back function
//run given back function on data var which will return html string (writefile)
//save html string into file index.html

const fs = require('fs');
const hbs = require('handlebars');

fs.readFile('learning/data.json', 'utf8', function(err, res) {
    const data = JSON.parse(res);

    fs.readFile('learning/gogauchos.hbs', 'utf8', function(err, template) {
      const convert = hbs.compile(template);
      fs.writeFile('learning/index.html', convert(data), function(err) {
        console.log('done');
      });
   });
});
