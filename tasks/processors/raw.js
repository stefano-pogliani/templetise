var utils = require("../helpers/utils");
var raw   = module.exports = {};


raw.single = function(grunt, name, spec, handelbars) {
  var template = handelbars.templates[name];
  utils.writeOutput(grunt, spec.dest, template, spec.data);
};

raw.multi = function(grunt, name, spec, handelbars) {
  var template = handelbars.templates[name];

  for (var idx = 0; idx < spec.data.length; idx++) {
    utils.writeOutput(grunt, spec.dest[idx], template, spec.data[idx]);
  }
};
