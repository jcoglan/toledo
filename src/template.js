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

Template.prototype._eval_block = function(scope, lineno, statements) {
  var self = this;

  return new Promise(function(resolve, reject) {
    var chunks = statements.map(function(el) { return self._eval(scope, el) });
    Promise.all(chunks).then(function(results) { resolve(results.join('')) });
  });
};

Template.prototype._eval_insert = function(scope, lineno, expression) {
  return this._eval(scope, expression);
};

Template.prototype._eval_name = function(scope, lineno, name) {
  if (scope.hasOwnProperty(name))
    return scope[name];
  else
    throw new Error('Line ' + lineno + ': Unknown variable: ' + name);
};

Template.prototype._eval_literal = function(scope, lineno, string) {
  return string;
};

module.exports = Template;
