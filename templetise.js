var fs   = require("fs");
var path = require("path");

var Handelbars = require("handlebars");

var utils = require("./utils");


/**
 * @class Templetise
 * Convert any file into a template.
 * 
 * A Templatise instance manages an Handlebars engine and
 * manages the process of applying data to the templates.
 * 
 * @param {Object} options Options used to configure the instance.
 */
var Templetise = module.exports = function Templetise(options) {
  options = options || {};
  this._options = {
    helpers_dir:   options.helpers_dir   || "helpers",
    partials_dir:  options.partials_dir  || "templates",
    plugins_dir:   options.plugins_dir   || "plugins",
    templates_dir: options.templates_dir || "templates",

    partials_ext:  options.partials_ext  || "part",
    templates_ext: options.templates_ext || "temp",

    base_dir:  options.base_dir || ".",
    no_escape: typeof options.no_escape === "boolean" ? options.no_escape : true
  };

  this._log = options.log || function () {};
  this._handlebars = Handelbars.create();
  this._templates  = {};
};

/**
 * Applies the given data to the requested template.
 * @param {!String} template_name The name of the template to use.
 * @param {!Object} data          The data to apply to the template.
 * @returns {!String} The expanded template.
 */
Templetise.prototype.apply = function(template_name, data) {
  if (!(template_name in this._templates)) {
    throw new Error("Unable to apply unkown template '" + template_name + "'.");
  }
  return this._templates[template_name](data);
};

/** Initialise the instance with templates, helpers, plugns and partials. */
Templetise.prototype.initialise = function initialise() {
  var opts  = this._options;
  var hdir  = path.resolve(path.join(opts.base_dir, opts.helpers_dir));
  var padir = path.join(opts.base_dir, opts.partials_dir);
  var pldir = path.resolve(path.join(opts.base_dir, opts.plugins_dir));
  var tdir  = path.join(opts.base_dir, opts.templates_dir);

  // Find files.
  var helpers   = utils.scanDirectory(hdir,  "js");
  var partials  = utils.scanDirectory(padir, opts.partials_ext);
  var plugins   = utils.scanDirectory(pldir, "js");
  var templates = utils.scanDirectory(tdir,  opts.templates_ext);

  // Load them into the engine.
  utils.forEachInArray(helpers, this.loadHelper, this, hdir.length + 1);
  utils.forEachInArray(plugins, this.loadPlugin, this);

  utils.forEachInArray(partials,  this.loadPartial,  this, padir.length + 1);
  utils.forEachInArray(templates, this.loadTemplate, this, tdir.length + 1);
};

/**
 * Loads an helper into the hendlebars engine.
 * @param {!String} file_name The path to the file to load.
 * @param {Number}  strip     Prefix length to remove from the file name.
 */
Templetise.prototype.loadHelper = function loadHelper(file_name, strip) {
  var helper = require(file_name);
  var ext    = path.extname(file_name);
  var name   = utils.escapeName(file_name, ext.length, strip);
  this._handlebars.registerHelper(name, helper);
  this._log("Loaded helper '%s' from file '%s'.", name, file_name);
};

/**
 * Loads a partial template into the hendlebars engine.
 * @param {!String} file_name The path to the file to load.
 * @param {Number}  strip     Prefix length to remove from the file name.
 */
Templetise.prototype.loadPartial = function loadPartial(file_name, strip) {
  var content = fs.readFileSync(file_name, { encoding: "utf-8" });
  var ext    = path.extname(file_name);
  var name   = utils.escapeName(file_name, ext.length, strip);
  this._handlebars.registerPartial(name, content, {
    noEscape: this._options.no_escape
  });
  this._log("Loaded partial '%s' from file '%s'.", name, file_name);
};

/**
 * Loads a pluing and uses it to extend the hendlebars engine.
 * @param {!String} file_name The path to the file to load.
 */
Templetise.prototype.loadPlugin = function loadPlugin(file_name) {
  var plugin = require(file_name);
  plugin(this._handlebars, this);
  this._log("Loaded plugin file '%s'.", file_name);
};

/**
 * Loads a template into the hendlebars engine.
 * @param {!String} file_name The path to the file to load.
 * @param {Number}  strip     Prefix length to remove from the file name.
 */
Templetise.prototype.loadTemplate = function loadTemplate(file_name, strip) {
  var content = fs.readFileSync(file_name, { encoding: "utf-8" });
  var ext    = path.extname(file_name);
  var name   = utils.escapeName(file_name, ext.length, strip);
  this._templates[name] = this._handlebars.compile(content, {
    noEscape: this._options.no_escape
  });
  this._log("Loaded template '%s' from file '%s'.", name, file_name);
};
