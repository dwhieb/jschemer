function jschemer(path, options) {
  // TODO: make sure options is an object. if options doesn't exist, set to default. if it does exist, make sure it's an object. if not an object, it will have a typed error.
  if (typeof path !== "string") {
    throw new TypeError ("Make sure the path is a string.");
  };
  if (typeof options !== "object") {
    throw new TypeError ("Make sure options is an object.");
  }
}

module.exports = jschemer;
