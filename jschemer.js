function jschemer(path, options = {}) {

  if (typeof path !== "string") {
    throw new TypeError ("Make sure the path is a string.");
  }

  if (typeof options !== "object") {
    throw new TypeError ("Make sure options is an object.");
  }

};

module.exports = jschemer;
