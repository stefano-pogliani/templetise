module.exports = function(grunt) {
  var Templetise = require("../templetise");

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
      "templetise", "Template anything with Handlebars.",
      function() {
    var data = this.data || [];
    var map  = data.expand || data;
    var templetise = new Templetise(this.options({
      log: grunt.log.verbose.ok
    }));

    templetise.initialise();

    for (var idx = 0; idx < map.length; idx++) {
      try {
        var spec = map[idx];
        EXPAND_TYPES[spec.type](grunt, spec, templetise);
      } catch (ex) {
        console.error(ex.stack);
        throw ex;
      }
    }
  });

};
