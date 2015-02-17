module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("../../package.json"),

    "templetise": {
      options: { partials_dir: "partials" },

      test: [{
        data:     { name: "some-test" },
        dest:     "out/raw.txt",
        template: "main",
        type:     "raw"
      }],

      multifile: [{
        cwd:      "sources/",
        dest:     "out/",
        src:      ["*.txt"],
        template: "main",
        type:     "multi-file"
      }]
    }

  });

  grunt.loadTasks("../../tasks");
};
