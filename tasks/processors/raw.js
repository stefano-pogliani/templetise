var raw = module.exports = {};


raw.single = function(grunt, spec, templetise) {
  grunt.file.write(spec.dest, templetise.apply(spec.template, spec.data));
};

raw.multi = function(grunt, spec, templetise) {
  for (var idx = 0; idx < spec.data.length; idx++) {
    grunt.file.write(
        spec.dest[idx], templetise.apply(spec.template, spec.data[idx])
    );
  }
};
