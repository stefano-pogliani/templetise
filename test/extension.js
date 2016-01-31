var assert = require("assert");
var mocha = require("mocha");
var Templetise = require("..");


suite("Extension", function() {
  setup(function() {
    this.templateise = new Templetise();
  });

  test("helpers", function() {
    this.templateise.helpers(require("./fixture/helpers"));
    var op = this.templateise.renderInline('Test {{helper}}');
    return op.then(function(data) {
      assert.equal("Test helper", data);
    });
  });

  test("partial", function() {
    this.templateise.partial("part", "test/fixture/part.conf");
    var op = this.templateise.renderInline('Test {{> part}} b');
    return op.then(function(data) {
      assert.equal("Test part\n b", data);
    });
  });
});
