module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("../../package.json"),

    "templetise": {
      options: { partials_dir: "partials" },

      test: {
        main: {
          data: { name: "some-test" },
          dest: "out/raw.txt",
          type: "raw"
        }
      },

      multifile: {
        main: {
          cwd:  "sources/",
          dest: "out/",
          src:  ["*.txt"],
          type: "multi-file"
        }
      }
    }

  });

  grunt.loadTasks("../../tasks");
};
