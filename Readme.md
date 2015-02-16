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
TODO

Using as Grunt Task
-----
As this is a Grunt (multi-)task you will need a `Gruntfile.js` file and
all the magic will happen in the target configuration.

For example, the following will fill the `debug-host` template with the
data from files matching the `data/*.conf` glob:
```javascript
"handlebars-expand": {
  debug: {
    "debug-host": {
      cwd:  "data/",
      dest: "out/",
      src:  ["*.conf"],
      type: "multi-file"
    }
  }
}
```

The `debug-host` template is associated to a data specification
that describes the file or files fed to the template and used to
generate the final files.

### Types and structures.
Several type of data specifications (`type`s) are available and the arguments
depend on such type but all data specifications have the following attributes:

| Attribute | Description                                                    |
| --------- | -------------------------------------------------------------- |
| type      | The type of data specification associated. See the lest below. |
| dest      | The destination for the result. The actual value of this       |
| :         | attribute depends on the type of attribute itself.             |
