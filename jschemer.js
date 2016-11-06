function jschemer(path, options) {
  // TODO: make sure path is a string. if not a string, it should throw a typed error
  // TODO: make sure options is an object. if options doesn't exist, set to default. if it does exist, make sure it's an object. if not an object, it will have a typed error.
  if (typeof path !== "string") {
    throw new TypeError ("Make sure the path is a string.");
  }
}

module.exports = jschemer;
