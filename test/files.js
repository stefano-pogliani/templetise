var assert = require("assert");
var mocha = require("mocha");
var Templetise = require("..");

var ARRAY_PATH = "test/fixture/array.json";
var DATA_PATH  = "test/fixture/one.json";
var NULL_PATH  = "test/fixture/null.json";
var STRING_PATH   = "test/fixture/string.json";
var TEMPLATE_PATH = "test/fixture/template.conf";


var assert_fails = function assert_fails(promise, error) {
  return promise.catch(function(err) {
    assert.equal(err.message, error);
    return { _test_passed: true };

  }).then(function(result) {
    try { if (result._test_passed) { return; } }
    catch (ex) { }
    assert.equal("This promise should have been rejected", "");

  });
};


suite("Files", function() {
  setup(function() {
    this.templateise = new Templetise();
  });

  test("template", function() {
    var op = this.templateise.renderTemplate(TEMPLATE_PATH);
    return op.then(function(data) {
      assert.equal("Hello \n", data);
    });
  });

  suite("JSON", function() {
    test("load", function() {
      this.templateise.data(DATA_PATH);
      var op = this.templateise.renderTemplate(TEMPLATE_PATH);
      return op.then(function(data) {
        assert.equal("Hello template\n", data);
      });
    });

    test("cannot be an array", function() {
      this.templateise.data(ARRAY_PATH);
      var op = this.templateise.renderTemplate(TEMPLATE_PATH);
      return assert_fails(op, "JSON must be an object");
    });

    test("cannot be null", function() {
      this.templateise.data(NULL_PATH);
      var op = this.templateise.renderTemplate(TEMPLATE_PATH);
      return assert_fails(op, "JSON must be an object");
    });

    test("cannot be a string", function() {
      this.templateise.data(STRING_PATH);
      var op = this.templateise.renderTemplate(TEMPLATE_PATH);
      return assert_fails(op, "JSON must be an object");
    });
  });
});
