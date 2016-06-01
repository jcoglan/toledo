'use strict';

var compiler = require('./compiler'),
    Template = require('./template');

module.exports = {
  compileTemplate: function(source) {
    var tree = compiler.parse(source);
    return new Template(tree);
  }
};
