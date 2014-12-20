module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    jshint: {
      options: {
        curly:    true,
        eqeqeq:   true,
        freeze:   true,
        immed:    true,
        indent:   2,
        latedef:  true,
        newcap:   true,
        noarg:    true,
        noempty:  true,
        nonbsp:   true,
        nonew:    true,
        quotmark: true,
        //undef:    true,  // Find out how to register globals firts.
        //unused:   true,  // Let closure optimize this?.
                           // Find how to ignore some cases?
        //strict:   true,  // Let Closure check this.
        trailing: true,
        maxlen:   80
      },
      all: [
        "tasks/**/*.js"
      ]
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.registerTask("default", "jshint");
};
