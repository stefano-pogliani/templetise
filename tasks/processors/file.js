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
  var options  = {};

  if (spec.cwd) { options.cwd = spec.cwd;  }
  var sources = grunt.file.expand(options, spec.src);

  for (var idx = 0; idx < sources.length; idx++) {
    var source = sources[idx];
    var output = path.join(spec.dest, sources[idx]);

    if (spec.cwd) { source = path.join(spec.cwd, source); }
    var data = grunt.file.readJSON(source);

    utils.writeOutput(grunt, output, template, data);
  }
};
