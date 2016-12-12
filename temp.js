const fs = require('fs');

const p = () => new Promise((resolve, reject) => {
  fs.readFile('hello', (err, data) => {
    if (err) reject(err);
    console.log(data);
    resolve('hello');
  });
});

p().then(res => console.log(res)).catch(err => console.log(err));
