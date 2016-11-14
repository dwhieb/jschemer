function jschemer(path, options = {}) {

  if (typeof path !== "string") {
    throw new TypeError ("Make sure the path is a string.");
  }

  if (typeof options !== "object") {
    throw new TypeError ("Make sure options is an object.");
  }

  const file = 'data.json';

  // TODO: read the file using the 'file' variable (above), and save it to the 'schema variable'
  // test it by logging the 'schema' variable to the console

};

module.exports = jschemer;
