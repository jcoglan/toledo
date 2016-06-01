'use strict';

var Template = function(parseTree) {
  this._parseTree = parseTree;
};

Template.prototype.evaluate = function(locals) {
  return this._eval(this._parseTree, locals);
};

Template.prototype._eval = function(node, scope) {
  return this['_eval_' + node[0]](node, scope);
};

Template.prototype._eval_block = function(block, scope) {
  return block[1].map(function(el) {
    return this._eval(el, scope);
  }, this).join('');
};

Template.prototype._eval_insert = function(insert, scope) {
  return this._eval(insert[1], scope);
};

Template.prototype._eval_name = function(varname, scope) {
  return scope[varname[1]];
};

Template.prototype._eval_literal = function(literal, scope) {
  return literal[1];
};

module.exports = Template;
