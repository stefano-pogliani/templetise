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
?

### Grunt task
?


Features
--------
Templetise supports the following features:

  * Handlebars based.
  * Support for helpers and partials.
  * Merged data sources.
  * JSON and inline JSON data sources.
  * Environmnet variables override.
