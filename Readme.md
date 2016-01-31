Templetise
==========
Templates for configuration files.


Quick start
-----------
```bash
npm install --global --production templetise
templetise --data=vars.json --inline='{ "override": true }' template.conf
```


Usage
-----
Templetise can be used as a command line tool or as a grunt task.

### CLI
The command line interface is useful to script the generation of files or
for one-off or testing.

The following options are supported:
```
Usage: node templetise

  -h, --help                display this help
  -d, --data=FILE+          load json data from FILE
  -i, --inline=JSON+        load json data from string
      --helpers=FILE+       register helpers module FILE
      --partial=NAME,FILE+  register partial NAME with content of FILE
```

### Grunt task
```javascript
templetise: {
  main: {
    files: [{
      src: ["template1"],
      dest: "out/template1"
    }, {
      src: ["template2"],
      dest: "out/template2"
    }],

    options: {
      data:    ["data/file1.json", "data/file2.json"],
      inline:  [JSON.stringify({ manual: "override" })],
      helpers: [require("./path/to/helpers")],
      partial: [{ name: "part", path: "path/to/partial" }]
    }
  }
}
```


Features
--------
Templetise supports the following features:

  * Handlebars based.
  * Support for helpers and partials.
  * Merged data sources.
  * JSON and inline JSON data sources.
  * Environmnet variables override.
