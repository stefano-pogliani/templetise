var fs    = require("fs");
var path  = require("path");
var utils = module.exports = {};


//! Recursively scans a directory for files.
/*!
 * \param {!String} root The path to the directory to scan.
 * \param {!String} type The extention of files to consider.
 * \returns {Array.<String>} The list of files.
 */
utils.scanDirectory = function(root, type) {
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


//! Writes content to a file.
/*!
 * \param {!Object}   grunt    Instance of the Grunt object.
 * \param {!String}   dest     The location for the resulting file.
 * \param {!Function} template The template to apply.
 * \param {!Object}   data     The data to fill the template with.
 */
utils.writeOutput = function(grunt, dest, template, data) {
  grunt.file.write(dest, template(data));
};
