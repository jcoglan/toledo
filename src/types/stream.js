'use strict';

var concat = require('concat-stream');

module.exports = {
  is: function(object) {
    return !!object && typeof object.pipe === 'function';
  },

  toPromise: function(stream) {
    return new Promise(function(resolve, reject) {
      stream.pipe(concat(resolve));
      stream.on('error', reject);
    });
  }
};
