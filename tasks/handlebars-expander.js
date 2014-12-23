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
  var Handelbars = require("handlebars");
  var load       = require("./helpers/loaders");
  var utils      = require("./helpers/utils");

  // Map of expand types to expand function.
  var file = require("./processors/file");
  var raw  = require("./processors/raw");
  var EXPAND_TYPES = {
    file: file.single,
    raw:  raw.single,

    "multi-file": file.multi,
    "multi-raw":  raw.multi
  };


  grunt.registerMultiTask(
      "handlebars-expand",
      "A grunt task to compile and run handlebars templates offline.",
      function() {
    var options = this.options({
      helpers_dir:   "helpers",
      partials_dir:  "partials",
      partials_ext:  "part",
      plugins_dir:   "plugins",
      templates_dir: "templates",
      templates_ext: "temp"
    });

    var helpers_dir   = options.helpers_dir;
    var partials_dir  = options.partials_dir;
    var partials_ext  = options.partials_ext;
    var plugins_dir   = options.plugins_dir;
    var templates_dir = options.templates_dir;
    var templates_ext = options.templates_ext;

    var helpers   = utils.scanDirectory(helpers_dir,   "js");
    var partials  = utils.scanDirectory(partials_dir,  partials_ext);
    var plugins   = utils.scanDirectory(plugins_dir,   "js");
    var templates = utils.scanDirectory(templates_dir, templates_ext);

    var handlebars = Handelbars.create();
    handlebars.templates = {};

    load.helpers(helpers, handlebars, helpers_dir.length + 1);
    load.plugins(plugins, handlebars);

    load.partials(partials,   handlebars, partials_dir.length + 1);
    load.templates(templates, handlebars, templates_dir.length + 1);

    var data = this.data || {};
    var map  = data.expand || data;

    for (var name in map) {
      if (!map.hasOwnProperty(name)) { continue; }

      var spec = map[name];
      EXPAND_TYPES[spec.type](grunt, name, spec, handlebars);
    }
  });

};
