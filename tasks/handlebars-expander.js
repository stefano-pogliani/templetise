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
  var raw = require("./processors/raw");
  var EXPAND_TYPES = {
    raw: raw.single,

    "multi-raw": raw.multi
  };


  grunt.registerMultiTask(
      "handlebars-expand",
      "A grunt task to compile and run handlebars templates offline.",
      function() {
    var helpers   = utils.scanDirectory("helpers",   "js");
    var partials  = utils.scanDirectory("partials",  "part");
    var templates = utils.scanDirectory("templates", "temp");

    var handlebars = Handelbars.create();
    handlebars.templates = {};

    load.helpers(helpers, handlebars, 8);
    load.partials(partials, handlebars, 9);
    load.templates(templates, handlebars, 10);

    var data = this.data || {};
    var map  = data.expand || data;

    for (var name in map) {
      if (!map.hasOwnProperty(name)) { continue; }

      var spec = map[name];
      EXPAND_TYPES[spec.type](grunt, name, spec, handlebars);
    }
  });

};
