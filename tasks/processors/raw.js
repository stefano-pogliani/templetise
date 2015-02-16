var raw = module.exports = {};


raw.single = function(grunt, name, spec, templetise) {
  grunt.file.write(spec.dest, templetise.apply(name, spec.data));
};

raw.multi = function(grunt, name, spec, templetise) {
  for (var idx = 0; idx < spec.data.length; idx++) {
    grunt.file.write(spec.dest[idx], templetise.apply(name, spec.data[idx]));
  }
};
