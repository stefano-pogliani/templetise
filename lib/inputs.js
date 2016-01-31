var fs = require("fs");
var Promise = require("bluebird");


/** Deal with data loading performing async operations. */
var Inputs = module.exports = {};

/**
 * Loads an object from a JSON string.
 * @param {!String} raw The data to load.
 * @returns {!Promise} A promise that fullfils to the loaded data.
 */
Inputs.inlineJson = function inlineJson(raw) {
  return new Promise.resolve(null).then(function() {
    var data = JSON.parse(raw);
    var fail = false;
    fail |= typeof data !== "object";
    fail |= Array.isArray(data);
    fail |= data === null;

    if (fail) {
      throw Error("JSON must be an object");
    }
    return data;
  });
};

/**
 * Loads an object from a JSON file.
 * @param {!String} path The path to the JSON file to load.
 * @returns {!Promise} A promise that fullfils to the loaded data.
 */
Inputs.json = function json(path) {
  var readFile = Promise.promisify(fs.readFile);
  return readFile(path, "utf8").then(Inputs.inlineJson);
};

/**
 * Loads a blob from a file.
 * @param {!String} path The path to the file to load.
 * @returns {!Promise} A promise that fullfils to the loaded data.
 */
Inputs.text = function test(path) {
  var readFile = Promise.promisify(fs.readFile);
  return readFile(path, "utf8");
};
