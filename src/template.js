'use strict';

var Template = function(parseTree) {
  this._parseTree = parseTree;
};

Template.prototype.evaluate = function(locals) {
  return this._eval(locals, this._parseTree);
};

Template.prototype._eval = function(scope, node) {
  var args = [scope].concat(node.slice(1));
  return this['_eval_' + node[0]].apply(this, args);
};

Template.prototype._eval_block = function(scope, statements) {
  return statements.map(function(el) {
    return this._eval(scope, el);
  }, this).join('');
};

Template.prototype._eval_insert = function(scope, expression) {
  return this._eval(scope, expression);
};

Template.prototype._eval_name = function(scope, name) {
  if (scope.hasOwnProperty(name))
    return scope[name];
  else
    throw new Error('Unknown variable: ' + name);
};

Template.prototype._eval_literal = function(scope, string) {
  return string;
};

module.exports = Template;
