var assert = require("assert");
var Mocha  = require("mocha");

var Templetise = require("../templetise");


suite("Templetise", function() {

  suite("constructor", function() {
    test("uses defaults", function() {
      var t = new Templetise();
      assert.equal("helpers",   t._options.helpers_dir);
      assert.equal("templates", t._options.partials_dir);
      assert.equal("plugins",   t._options.plugins_dir);
      assert.equal("templates", t._options.templates_dir);

      assert.equal("part", t._options.partials_ext);
      assert.equal("temp", t._options.templates_ext);

      assert.equal(".",  t._options.base_dir);
      assert.equal(true, t._options.no_escape);

      assert.equal("function", typeof t._log);
      assert.equal("object",   typeof t._handlebars);
      assert.deepEqual({}, t._templates);
    });
  });

  suite("loaders", function() {
    setup(function() {
      this.templetise = new Templetise({ base_dir: "test" });
    });

    test("helper", function() {
      this.templetise.loadHelper("./test/helpers/demo", 15);
      var template = this.templetise._handlebars.compile("{{demo}}");
      assert.equal("Called Hendlebars helper.", template({}));
    });

    test("partial", function() {
      this.templetise.loadPartial("./test/templates/header.part", 17);
      var template = this.templetise._handlebars.compile("{{>header}}");
      assert.equal(
          "This is a test header for partial test.\n",
          template({ name: "partial test" })
      );
    });

    test("plugin", function() {
      // Note that asserts are in the plugin itself.
      this.templetise.loadPlugin("./test/plugins/test.js");
    });

    test("template", function() {
      this.templetise.loadTemplate("./test/templates/temps/other.temp", 17);
      var template = this.templetise._templates["temps-other"];
      assert.equal("function", typeof template);
      assert.equal("Some other template\n", template({}));
    });
  });

  test("end-to-end", function() {
    var templetise = new Templetise({ base_dir: "test" });
    templetise.initialise();
    assert.equal(
        "This is a test header for partial test.\n" +
        "Called Hendlebars helper.\n\n",
        templetise.apply("main", { name: "partial test" })
    );
  });

});
