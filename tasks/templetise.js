module.exports = function(grunt) {
  var Promise = require("bluebird");
  var Templetise = require("..");

  var task = function() {
    var options = this.options({
      data:    [],
      inline:  [],
      helpers: [],
      partial: []
    });
    
    var templetise = new Templetise();
    this.data.forEach(function(file) {
      templetise.data(file);
    });
    this.inline.forEach(function(string) {
      templetise.inline(string);
    });
    this.helpers.forEach(function(helpers) {
      templetise.helpers(helpers);
    });
    this.partial.forEach(function(input) {
      templetise.partial(input.name, input.path);
    });

    var tasks = this.files.forEach(function(pair) {
      var src  = pair.src[0];
      var dest = pair.dest;
      return templetise.renderTemplate(src).then(function(output) {
        grunt.file.write(dest, output);
      });
    });

    var done = this.async();
    Promise.all(tasks).then(done).catch(done);
  };
  grunt.registerMultiTask("templetise", "Generate files from templates", task);
};
