const fs = require('fs');

var schema;
var cb = function(err, data) {
  schema = data;
  console.log('first' + schema);
};

fs.readFile('data.json', 'utf8', cb);

console.log('second' + schema);
