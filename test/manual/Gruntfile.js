module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("../../package.json"),

    "handlebars-expand": {
      test: {
        main: {
          data: { name: "some-test" },
          dest: "out/raw.txt",
          type: "raw"
        }
      },

      multifile: {
        main: {
          dest: "out/",
          src:  ["sources/*.txt"],
          type: "multi-file"
        }
      }
    }

  });

  grunt.loadTasks("../../tasks");
};
