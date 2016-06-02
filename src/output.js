'use strict';

var Duplex  = require('stream').Duplex,
    util    = require('util'),
    Mutex   = require('./mutex'),
    promise = require('./types/promise'),
    stream  = require('./types/stream');

var Output = function(chunks) {
  Duplex.call(this);
  this._chunks = chunks;
  this._mutex  = new Mutex();
};
util.inherits(Output, Duplex);

Output.prototype._read = function(size) {
  this._dequeue();
};

Output.prototype._write = function(chunk, encoding, callback) {
  this.push(chunk);
  callback();
};

Output.prototype._dequeue = function() {
  var self = this;

  this._mutex.synchronize(function() {
    return new Promise(function(resolve, reject) {
      var chunk = self._chunks.shift();
      self._doChunk(chunk, resolve, reject);
    });
  }).then(function(pushed) {
    if (pushed) self._dequeue();
  }, function() {
    self._chunks = [];
    self.push(null);
  });
};

Output.prototype._doChunk = function(chunk, resolve, reject) {
  var self = this;

  if (chunk === undefined) {
    this.push(null);
    resolve(false);
  }
  else if (chunk instanceof Error) {
    reject(chunk);
    this.emit('error', chunk);
  }
  else if (stream.is(chunk)) {
    chunk.pipe(this, {end: false});
    chunk.on('end', function() { resolve(true) });
    chunk.on('error', function(error) {
      reject(error);
      self.emit('error', error);
    });
  }
  else if (promise.is(chunk)) {
    chunk.then(function(value) {
      resolve(self.push(value));
    }, reject);
  }
  else {
    resolve(this.push(chunk));
  }
};

module.exports = Output;
