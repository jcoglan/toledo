'use strict';

var Readable = require('stream').Readable,
    util     = require('util');

var Streamer = function(chunks) {
  Readable.call(this);
  this._chunks = chunks;
};
util.inherits(Streamer, Readable);

Streamer.prototype._read = function(size) {
  var self = this;
  process.nextTick(function() { self._dequeue() });
};

Streamer.prototype._dequeue = function() {
  if (this._chunks.length === 0)
    return this.push(null);

  var chunk = this._chunks.shift(),
      self  = this;

  if (this.push(chunk))
    process.nextTick(function() { self._dequeue() });
};

module.exports = function(chunks) {
  return new Streamer(chunks);
};
