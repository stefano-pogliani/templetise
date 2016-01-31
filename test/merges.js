var assert = require("assert");
var mocha = require("mocha");
var Templetise = require("..");

var ONE_PATH = "test/fixture/one.json";
var TWO_PATH = "test/fixture/two.json";


suite("Merges", function() {
  setup(function() {
    this.templateise = new Templetise();
  });

  test("inlineJSON", function() {
    this.templateise.inline('{"x": 1, "y": 2}');
    this.templateise.inline('{"y": 3, "z": 2}');
    var op = this.templateise.renderInline("{{x}}.{{y}}.{{z}}");
    return op.then(function(data) {
      assert.equal("1.3.2", data);
    });
  });

  test("JSON", function() {
    this.templateise.data(ONE_PATH);
    this.templateise.data(TWO_PATH);
    var op = this.templateise.renderInline("{{x}}.{{y}}.{{z}}");
    return op.then(function(data) {
      assert.equal("1.3.2", data);
    });
  });
});
