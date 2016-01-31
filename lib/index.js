var fs = require("fs");

var Handlebars = require("handlebars");
var Promise = require("bluebird");
var Inputs  = require("./inputs");


/**
 * Merges a list of objects into one.
 * The objects at the end of the list override the objects at the front.
 * @param {!Array<Object>} objects The list of objects to merge.
 * @returns {!Object} The merged object.
 */
var mergeObjects = function mergeObjects(objects) {
  var data = {};
  objects.forEach(function(object) {
    Object.keys(object).forEach(function(key) {
      data[key] = object[key];
    });
  });
  return data;
};


/**
 * @class Templetise
 * Process templates to generate configuration files.
 */
var Templetise = module.exports = function() {
  this._engine  = Handlebars.create();
  this._files   = [];
  this._inlines = [];
};


/**
 * Loads inline and file data objects into the context.
 * Performs needed merges too.
 * @returns {!Promise} A promise that resolves to the context.
 */
Templetise.prototype._context = function _context() {
  // Load all inline data sources.
  var inlines = Promise.all(this._inlines.map(Inputs.inlineJson));
  inlines = inlines.then(mergeObjects);

  // Load all file data sources.
  var files = Promise.all(this._files.map(Inputs.json));
  files = files.then(mergeObjects);

  return Promise.all([inlines, files]).then(mergeObjects);
};


/**
 * Adds a file data object.
 * @param {!String} path The path to the file to load.
 */
Templetise.prototype.data = function data(path) {
  this._files.push(path);
};

/**
 * Adds an inline data object.
 * @param {!String} raw The string to load.
 */
Templetise.prototype.inline = function inline(raw) {
  this._inlines.push(raw);
};

/**
 * Registers a set of helpers.
 * All attributes are registered as helpers!
 * @param {!Object} helpers Map from helper name to function.
 */
Templetise.prototype.helpers = function helper(helpers) {
  this._engine.registerHelper(helpers);
};

/**
 * Registers a partial template.
 * @param {!String} name The name of the partial to register.
 * @param {!String} path The path to the partial file to load.
 */
Templetise.prototype.partial = function partial(name, path) {
  var part = fs.readFileSync(path, "utf-8");
  this._engine.registerPartial(name, part);
};

/**
 * Renders a template from file.
 * @param {!String} path The path to the template file.
 * @returns {!Promise} A promise that fullfils to the rendered template.
 */
Templetise.prototype.renderTemplate = function renderTemplate(path) {
  var _this = this;
  var promise = Promise.all([this._context(), Inputs.text(path)]);
  return promise.then(function(inputs) {
    var template = _this._engine.compile(inputs[1]);
    return template(inputs[0]);
  });
};

/**
 * Render an inline template.
 * @param {!String} raw The inline template to render.
 * @returns {!Promise} A promise that fullfils to the rendered template.
 */
Templetise.prototype.renderInline = function renderInline(raw) {
  var _this = this;
  return this._context().then(function(context) {
    var template = _this._engine.compile(raw);
    return template(context);
  });
};
