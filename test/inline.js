var assert = require("assert");
var mocha = require("mocha");
var Templetise = require("..");


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


suite("Inline", function() {
  setup(function() {
    this.templateise = new Templetise();
  });

  test("template", function() {
    var op = this.templateise.renderInline("ABC");
    return op.then(function(data) {
      assert.equal("ABC", data);
    });
  });

  suite("JSON", function() {
    test("load", function() {
      this.templateise.inline('{"world": "template"}');
      var op = this.templateise.renderInline("Hello {{ world }}");
      return op.then(function(data) {
        assert.equal("Hello template", data);
      });
    });

    test("cannot be an array", function() {
      this.templateise.inline('[]');
      var op = this.templateise.renderInline("");
      return assert_fails(op, "JSON must be an object");
    });

    test("cannot be null", function() {
      this.templateise.inline('null');
      var op = this.templateise.renderInline("");
      return assert_fails(op, "JSON must be an object");
    });

    test("cannot be a string", function() {
      this.templateise.inline('"abc"');
      var op = this.templateise.renderInline("");
      return assert_fails(op, "JSON must be an object");
    });
  });
});
