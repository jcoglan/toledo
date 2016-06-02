'use strict';

var Mutex = function() {
  this._busy  = false;
  this._queue = [];
};

Mutex.prototype.synchronize = function(task) {
  var self = this;

  return new Promise(function(resolve, reject) {
    self._queue.push([task, resolve, reject]);
    if (!self._busy) self._dequeue();
  });
};

Mutex.prototype._dequeue = function() {
  this._busy = true;
  var next = this._queue.shift();

  if (next)
    this._execute(next);
  else
    this._busy = false;
};

Mutex.prototype._execute = function(record) {
  var task    = record[0],
      resolve = record[1],
      reject  = record[2],
      self    = this;

  var promise = task.call(),
      dequeue = function() { self._dequeue() };

  promise.then(resolve, reject)
         .then(dequeue, dequeue);
};

module.exports = Mutex;
