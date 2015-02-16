var fs    = require("fs");
var path  = require("path");
var utils = module.exports = {};


/**
 * Converts a file name into a partial or helper name.
 * 
 * @param {!String} name    The name to escape.
 * @param {!Number} ext_len Length of the extention in the name being escaped.
 * @param {Number}  strip   Optional number of chars to strip at the front.
 * 
 * @returns {!String} A name that is usable as handlebars identifier.
 */
utils.escapeName = function escapeName(name, ext_len, strip) {
  name = name.replace(/[\/+]/g, "-");
  return name.substring(strip || 0, name.length - ext_len);
};

/**
 * TODO(stefano): document.
 * @param {!Array}    array    The array to iterate over.
 * @param {!Function} callback The function to call with each item.
 * @param {Object}    context  The this context for the callback.
 * @param {...}       var_args  Other arguments are passed to the callback.
 */
utils.forEachInArray = function forEachInArray(
    array, callback, context, var_args
) {
  var static_args = Array.prototype.slice.call(arguments, 3);

  for (var idx = 0; idx < array.length; idx++) {
    var args = [];
    args.push(array[idx]);
    args.push.apply(args, static_args);
    callback.apply(context, args);
  }
};

/**
 * Recursively scans a directory for files.
 * @param {!String} root The path to the directory to scan.
 * @param {!String} type The extention of files to consider.
 * @returns {Array.<String>} The list of files.
 */
utils.scanDirectory = function scanDirectory(root, type) {
  if (!fs.existsSync(root)) {
    return [];
  }

  var content = fs.readdirSync(root);
  var files   = [];

  for (var idx = 0; idx < content.length; idx++) {
    var full_name = path.join(root, content[idx]);
    var stats     = fs.statSync(full_name);

    // Append to list.
    if (stats.isFile() && path.extname(full_name) === "." + type) {
      files.push(full_name);
    }

    // Start recursion.
    else if (stats.isDirectory()) {
      files.push.apply(files, utils.scanDirectory(full_name, type));
    }
  }

  return files;
};
