Templetise
==========
Convert any file into a template.


Motivation
----------
If you ever used (FluentD)[http://www.fluentd.org/] you might have noticed
that the configuration files tend to be repetitive.
For example all file inputs will have more or less the same structure
but you have to write it repeatedly.

Another example is (Apache)[http://httpd.apache.org/] VirtualHost configuration.
If all of your virtual hosts share the same basic options why would you
create them multiple times?


Features
--------
Handlebars offers three ways to write your templates, to which I added plug-ins.
These options are all described below with an example of how to write each
piece and why it was introduced.

### Helpers
Helpers are a way to extend your options with Handlebars built in helper
support.
Helper modules are Node.JS modules that export the helper function.

For example, if file `helpers/if-equals.js` contains
```javascript
module.exports = function(left, right, options) {
  if (left === right) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};
```
Will result in the `if-equals` block helper to be available to Handlebars.

### Plugins
Helpers should cover most of the common cases but sometimes it is needed to
have access to the Handlebars instance that will be used to parse templates
and partials.

Plugins are Node.JS modules that export a function that will receive the
current Handlebars instance and can do as they please with it.

This example is taken from another project so it includes more details
than an essential example:
```javascript
/*
 * Handlebars-Expander Plug-in to make the regular expressions from
 * regexes.txt available as partials to your templates, partials and
 * other regular expressions in the file itself.
 *
 * The regular expressions are stored one for each line with the following
 * schema: `NAME:REGEX`.
 *
 * Other RegExes can be used in `REGEX` as regular Handlebars templates:
 * `NAME:{{> Number}} + {{> Number}}`.
 */
var fs = require("fs");


module.exports = function(handlebars) {
  var raw_file = fs.readFileSync("./regexes.txt", { encoding: "utf-8" });
  var lines    = raw_file.split("\n");

  for (var idx = 0; idx < lines.length; idx++) {
    var line  = lines[idx].split(":", 1);
    var regex = line[1];
    var name  = line[0];
    handlebars.registerPartial(name, regex);
  }
};
```

### Partials
Partials provide access to Handlebars standard `partials` feature.
A lot of information about partials is provided everywhere on the internet
so I will not discuss them.

Partials are named after the file that contains their definition and its path
relative to the `partials` directory.
As names cannot contain `/` characters these are replaced by `-`.
For example a file in `partials/debug/outputs.part` would result in a
partial called `debug-outputs`.

### Templates
Templates are the starting point of every use.
Like partials, templates are just Handlebars templates that are loaded
and complied for you to use.

Template naming follows the same rules as partials.


Usage
-----
You can use Templetise as a library within your code in just four lines:
```javascript
var Templetise = require("templetise");

var templetise = new Templetise();
templetise.initialise();

var content = templetise.apply("template-name", data_object);
```

You will need to extend this with your data generation/loading code
and you could customise the instance by passing options to the constructor
but for basic usage this is it.

### Supported options:
  * `helpers_dir` [default="helpers"]
    directory to scan looking for helpers.

  * `partials_dir` [default="templates"]
    directory to scan looking for partial templates.

  * `plugins_dir` [default="plugins"]
    directory to scan looking for plug-ins.

  * `templates_dir` [default="templates"]
    directory to scan looking for templates.

  * `partials_ext` [default="part"]
    extension to filter partial templates by.

  * `templates_ext` [default="temp"]
    extension to filter templates by.

  * `base_dir` [default="."]
    Prefix this path to all directories.

  * `no_escape` [default=true]
    configure Handlebars to avoid escaping of HTML.

  * `log` [log=NoOp]
    function used to log loading of helpers, partials, plugins and
    templates.
    By default this function does nothing.


Using as Grunt Task
-------------------
If what you are trying to do is build configuration files writing
a Node.JS program to use a library is not a good approach.

For that reason a much simpler approach is available: using a Grunt task.
This library comes with a Grunt (multi-)task that will allow you to
process dynamically generated data or JSON files with your templates.

For example, the following slice of Gruntfile configuration will fill the
`debug-host` template with the data from files matching the `data/*.conf` glob:
```javascript
"templetiser": {
  "debug": [{
    "cwd":      "data/",
    "dest":     "out/",
    "src":      ["*.conf"],
    "template": "debug-host",
    "type":     "multi-file"
  }]
}
```

### Types and structures.
Several type of data specifications (`type`s) are available and the arguments
depend on such type but all data specifications have the following attributes:

| Attribute | Description                                                    |
| --------- | -------------------------------------------------------------- |
| template  | The name of the template to use.                               |
| type      | The type of data specification associated. See the lest below. |
| dest      | The destination for the result. The actual value of this       |
|           | attribute depends on the type of attribute itself.             |

What follows is a list of supported types and the parameters
they expect and support.

  * `file`
    Requires a `src` string parameter with the path to a
    JSON file with the input data.
    The `dest` attribute is a string parameter with the
    path to the output file.

  * `raw`
    The data for the template is found in the mandatory `data` attribute.
    As for `file`, the `dest` attribute is a string with the path to the
    output file.

  * `multi-file`
    Similar to `file` but acting over multiple files.

    This time the `src` parameter is processed by `grunt.file.expand`
    which means that multiple files and patterns can be passed.
    The optional `cwd` attribute can be used to specify the path
    to the base directory for the values in `src`.

    The `dest` parameter is now the path to a directory where the output
    files should be stored.
    Keep in mind that the full structure (relative to `cwd` is duplicated).

  * `multi-data`
    Similar to `data` but where the `data` attribute is an array.
    Each item in the array is passed to the template and used
    to generate a different file.

    The `dest` attribute is a list of strings, one for each item
    in the `data` array, which are paths to the output files.
