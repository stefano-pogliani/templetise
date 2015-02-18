var assert = require("assert");
var Handelbars = require("handlebars");

var Templetise = require("../../templetise");


module.exports = function(handlebars, templetise) {
  assert(handlebars);
  assert(handlebars instanceof Object);
  assert(templetise instanceof Templetise);
};
