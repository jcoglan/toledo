'use strict';

var grammar = require('./grammar');

module.exports = {
  parse: function(source) {
    return grammar.parse(source, {actions: this});
  },

  _block: function(text, start, end, elements) {
    return ['block', elements];
  },

  _insert: function(text, start, end, elements) {
    return ['insert', elements[2]];
  },

  _varname: function(text, start, end, elements) {
    return ['name', text.substring(start, end)];
  },

  _literal: function(text, start, end, elements) {
    return ['literal', text.substring(start, end)];
  }
};
