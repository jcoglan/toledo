'use strict';

var Readable = require('stream').Readable,
    util     = require('util');

var Streamer = function(chunks, delay) {
  Readable.call(this);
  this._chunks = chunks;
  this._delay  = delay;
};
util.inherits(Streamer, Readable);

Streamer.prototype._read = function(size) {
  this._doNext();
};

Streamer.prototype._doNext = function() {
  var dequeue = function() { self._dequeue() },
      self    = this;

  if (this._delay)
    this._timer = this._timer || setTimeout(dequeue, this._delay);
  else
    process.nextTick(dequeue);
};

Streamer.prototype._dequeue = function() {
  clearTimeout(this._timer);
  delete this._timer;

  if (this._chunks.length === 0)
    return this.push(null);

  var chunk = this._chunks.shift();
  if (this.push(chunk)) this._doNext();
};

module.exports = function(chunks, delay) {
  return new Streamer(chunks, delay);
};
