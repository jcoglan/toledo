'use strict';

var Output = require('./output');

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
  var chunks = statements.map(function(el) {
    return this._eval(scope, el);
  }, this);

  return new Output(chunks);
};

Template.prototype._eval_cond = function(scope, lineno, condition, thenBlock, elseBlock) {
  if (this._eval(scope, condition))
    return this._eval(scope, thenBlock);
  else
    return elseBlock ? this._eval(scope, elseBlock) : '';
};

Template.prototype._eval_insert = function(scope, lineno, expression) {
  return this._eval(scope, expression);
};

Template.prototype._eval_access = function(scope, lineno, expression, field) {
  return Promise.resolve(this._eval(scope, expression)).then(function(object) {
    if (object && object.hasOwnProperty(field))
      return object[field];
    else
      throw new Error('Line ' + lineno[0] + ': Object has no property: ' + field);
  });
};

Template.prototype._eval_name = function(scope, lineno, name) {
  if (scope.hasOwnProperty(name))
    return scope[name];
  else
    return new Error('Line ' + lineno[0] + ': Unknown variable: ' + name);
};

Template.prototype._eval_literal = function(scope, lineno, string) {
  return string;
};

module.exports = Template;
