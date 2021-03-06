'use strict';

var grammar = require('./grammar');

var Parser = function(template) {
  this._template = template;
  this._lines    = template.split(/\n/);

  this._offsets = this._lines.reduce(function(list, line) {
    var last = list[list.length - 1];
    return list.concat(last + line.length + 1);
  }, [0]);
};

Parser.prototype.parse = function() {
  return grammar.parse(this._template, {actions: this});
};

Parser.prototype._lineno = function(start) {
  var line = 1;
  while (start >= this._offsets[line]) line += 1;
  return [line, 1 + start - this._offsets[line - 1]];
};

Parser.prototype._block = function(text, start, end, elements) {
  return ['block', this._lineno(start), elements];
};

Parser.prototype._condition = function(text, start, end, elements) {
  return ['cond', this._lineno(start), elements[3], elements[5], elements[6].block];
};

Parser.prototype._insert = function(text, start, end, elements) {
  return ['insert', this._lineno(start), elements[1]];
};

Parser.prototype._access_chain = function(text, start, end, elements) {
  var self = this;

  return elements[1].elements.reduce(function(node, next) {
    var field = next.varname;
    return ['access', field[1], node, field[2]];
  }, elements[0]);
};

Parser.prototype._varname = function(text, start, end, elements) {
  return ['name', this._lineno(start), text.substring(start, end)];
};

Parser.prototype._literal = function(text, start, end, elements) {
  return ['literal', this._lineno(start), text.substring(start, end)];
};

module.exports = {
  parse: function(source) {
    return new Parser(source).parse();
  }
};
