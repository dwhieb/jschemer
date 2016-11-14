var schema;
var file = 'data.json';

var cb = function(err, data) {

  if (err) {
    throw err;
  }

  schema = data;

};

fs.readFileSync(file, 'utf8', cb);
console.log(schema);
