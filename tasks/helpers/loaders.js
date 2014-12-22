var fs   = require("fs");
var path = require("path");
var load = module.exports = {};


//! Loads a list of helpers into the hendlebars engine.
/*!
 * \param {!Array.<String>} files      The array of files to load.
 * \param {!Object}        handlebars The enginge to update.
 * \param {Number}         strip      Prefix length to remove.
 */
load.helpers = function(files, handlebars, strip) {
  for (var idx = 0; idx < files.length; idx++) {
    var helper = require(path.resolve(files[idx]));
    var ext    = path.extname(files[idx]);
    var name   = files[idx].replace(/\//g, "-");

    name = name.substring(strip || 0, name.length - ext.length);
    handlebars.registerHelper(name, helper);
  }
};


//! Loads a list of partials into the handlebars engine.
/*!
 * \param {!Array.<String>} files      The array of files to load.
 * \param {!Object}        handlebars The enginge to update.
 * \param {Number}         strip      Prefix length to remove.
 */
load.partials = function(files, handlebars, strip) {
  for (var idx = 0; idx < files.length; idx++) {
    var content = fs.readFileSync(files[idx], { encoding: "utf-8" });
    var ext     = path.extname(files[idx]);
    var name    = files[idx].replace(/\//g, "-");

    name = name.substring(strip || 0, name.length - ext.length);
    handlebars.registerPartial(name, content, { noEscape: true });
  }
};


//! Loads a list of templates into the handlebars engine.
/*!
 * \param {!Array.<String>} files      The array of files to load.
 * \param {!Object}        handlebars The enginge to update.
 * \param {Number}         strip      Prefix length to remove.
 */
load.templates = function(files, handlebars, strip) {
  for (var idx = 0; idx < files.length; idx++) {
    var content = fs.readFileSync(files[idx], { encoding: "utf-8" });
    var ext     = path.extname(files[idx]);
    var name    = files[idx].replace(/\//g, "-");

    name = name.substring(strip || 0, name.length - ext.length);
    handlebars.templates[name] = handlebars.compile(content, {
      noEscape: true
    });
  }
};
