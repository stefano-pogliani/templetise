/*
 *  Process:
 *    * Scan the templates directory and make list all .temp or .part files.
 *    * Divide them in templates and partials based on extention.
 *    * Create new Handlebars engine.
 *    * Load and register all partials (name from file).
 *    * Load and compile all templates (name from file).
 *    * Look at the `expand` map, it maps {template name => data spec}.
 *
 *    Data Spec:
 *      The data spcecifiction is an object with the following required fields:
 *        * type: the type of the specification.
 *        * dest: the output file for the expanded template.
 *
 *      Other fields depend on the type.
 *
 *      * "raw" type:
 *        The raw type gets the data from the `data` attribute of the
 *        specification itself.
 *        `dest` must be a file path.
 */


module.exports = function(grunt) {
  var fs         = require("fs");
  var path       = require("path");
  var Handelbars = require("handlebars");


  //! Loads a list of partials into the handlebars engine.
  /*!
   * \param {!Array.<String>} files      The array of files to load.
   * \param {!Object}        handlebars The enginge to update.
   * \param {Number}         strip      Prefix length to remove.
   */
  var loadPartials = function(files, handlebars, strip) {
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
  var loadTemplates = function(files, handlebars, strip) {
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


  //! Recursively scans a directory for files.
  /*!
   * \param {!String} root The path to the directory to scan.
   * \param {!String} type The extention of files to consider.
   * \returns {Array.<String>} The list of files.
   */
  var scanDirectory = function(root, type) {
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
        files.push.apply(files, scanDirectory(full_name, type));
      }
    }

    return files;
  };


  //! Writes content to a file.
  /*!
   * \param {!String}   dest     The location for the resulting file.
   * \param {!Function} template The template to apply.
   * \param {!Object}   data     The data to fill the template with.
   */
  var writeOutput = function(dest, template, data) {
    grunt.file.write(dest, template(data));
  };


  //*** Start of processing methods ***//
  var process_raw = function(name, spec, handelbars) {
    var template = handelbars.templates[name];
    writeOutput(spec.dest, template, spec.data);
  };

  var process_multi_raw = function(name, spec, handelbars) {
    var template = handelbars.templates[name];

    for (var idx = 0; idx < spec.data.length; idx++) {
      writeOutput(spec.dest[idx], template, spec.data[idx]);
    }
  };


  // Map of expand types to expand function.
  var EXPAND_TYPES = {
    raw: process_raw,

    "multi-raw": process_multi_raw
  };


  grunt.registerMultiTask(
      "handlebars-expand",
      "A grunt task to compile and run handlebars templates offline.",
      function() {
    var helpers   = scanDirectory("helpers",   "js");
    var partials  = scanDirectory("partials",  "part");
    var templates = scanDirectory("templates", "temp");

    var handlebars = Handelbars.create();
    handlebars.templates = {};

    //loadHelpers(helpers, handlebars.registerHelper, handlebars);
    loadPartials(partials, handlebars, 9);
    loadTemplates(templates, handlebars, 10);

    var data = this.data || {};
    var map  = data.expand || data;

    for (var name in map) {
      if (!map.hasOwnProperty(name)) { continue; }

      var spec = map[name];
      EXPAND_TYPES[spec.type](name, spec, handlebars);
    }
  });

};
