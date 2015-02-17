var assert = require("assert");
var Mocha  = require("mocha");
var utils  = require("../utils");


suite("Utilites", function() {

  suite("escapeName", function() {
    test("escapes paths", function() {
      assert.equal("a-b-c", utils.escapeName("a/b/c", 0));
      assert.equal("a-b-c", utils.escapeName("a/b-c", 0));
    });

    test("escapes pluses", function() {
      assert.equal("a-b-c", utils.escapeName("a+b+c", 0));
      assert.equal("a-b-c", utils.escapeName("a-b+c", 0));
    });

    test("escapes all", function() {
      assert.equal("a-b-c", utils.escapeName("a/b+c", 0));
    });

    test("fails without required parameters", function() {
      assert.throws(function() {
        utils.escapeName();
      }, Error, "Missing parameter: name to escape.");

      assert.throws(function() {
        utils.escapeName("a-b-c");
      }, Error, "Missing parameter: extension length.");
    });

    test("ignores extention", function() {
      assert.equal("a-b-", utils.escapeName("a+b+c", 1));
      assert.equal("a-b",  utils.escapeName("a-b+c", 2));
    });

    test("ignores prefix", function() {
      assert.equal("-b-c", utils.escapeName("a+b+c", 0, 1));
      assert.equal("b-c",  utils.escapeName("a-b+c", 0, 2));
    });

    test("ignores extension and prefix", function() {
      assert.equal("-b-", utils.escapeName("a+b+c", 1, 1));
      assert.equal("b-",  utils.escapeName("a-b+c", 1, 2));
      assert.equal("-b",  utils.escapeName("a+b+c", 2, 1));
      assert.equal("b",   utils.escapeName("a-b+c", 2, 2));
    });
  });

  suite("forEachInArray", function() {
    test("iterates over all items", function() {
      var count = 0;
      utils.forEachInArray([1, 2, 3, 4, 5], function(item) { count += item; });
      assert.equal(15, count);
    });

    test("uses context", function() {
      var context = { count: 0 };
      utils.forEachInArray(
          [1, 2, 3, 4, 5], function(item) { this.count += item; }, context
      );
      assert.equal(15, context.count);
    });

    test("uses context and args", function() {
      var context = { count: 0 };
      utils.forEachInArray(
          [1, 2, 3, 4, 5], function(item, arg) { this.count += item + arg; },
          context, 2
      );
      assert.equal(25, context.count);
    });

    test("works over empty array", function() {
      var count = 0;
      utils.forEachInArray([], function(item) { count += item; });
      assert.equal(0, count);
    });
  });

  suite("scanDirectory", function() {
    test("deals with missing paths", function() {
      assert.deepEqual([], utils.scanDirectory("some/fake/path", ""));
    });

    test("empty from filter by extension", function() {
      assert.deepEqual([], utils.scanDirectory(".", "not-existing-ext"));
    });

    test("filters by extension", function() {
      assert.deepEqual(
          ["test/templates/main.temp","test/templates/temps/other.temp"],
          utils.scanDirectory("test/templates", "temp")
      );
    });
  });

});
