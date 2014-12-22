var path  = require("path");
var utils = require("../helpers/utils");
var file  = module.exports = {};


file.single = function(grunt, name, spec, handelbars) {
  var template = handelbars.templates[name];
  var data     = grunt.file.readJSON(spec.src);
  utils.writeOutput(grunt, spec.dest, template, data);
};

file.multi = function(grunt, name, spec, handelbars) {
  var template = handelbars.templates[name];
  var sources  = grunt.file.expand(spec.src);

  for (var idx = 0; idx < sources.length; idx++) {
    var data = grunt.file.readJSON(sources[idx]);
    var output = path.join(spec.dest, sources[idx]);
    utils.writeOutput(grunt, output, template, data);
  }
};
