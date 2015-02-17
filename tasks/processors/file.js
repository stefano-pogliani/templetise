var path  = require("path");
var file  = module.exports = {};


file.single = function(grunt, spec, templetise) {
  var data = grunt.file.readJSON(spec.src);
  grunt.file.write(spec.dest, templetise.apply(spec.template, data));
};

file.multi = function(grunt, spec, templetise) {
  var options = {};
  if (spec.cwd) { options.cwd = spec.cwd;  }
  var sources = grunt.file.expand(options, spec.src);

  for (var idx = 0; idx < sources.length; idx++) {
    var source = sources[idx];
    var output = path.join(spec.dest, sources[idx]);

    if (spec.cwd) { source = path.join(spec.cwd, source); }
    var data = grunt.file.readJSON(source);
    grunt.file.write(output, templetise.apply(spec.template, data));
  }
};
