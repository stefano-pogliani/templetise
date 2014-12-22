module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("../package.json"),

    "handlebars-expand": {
      test: {
        // Expand the main template.
        main: {
          data: { name: "some-test" },
          dest: "out/raw.txt",
          type: "raw"
        }
      }
    }

  });

  grunt.loadTasks("../tasks");
};
