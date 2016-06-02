'use strict';

var concat = require('concat-stream');

module.exports = {
  is: function(object) {
    return !!object && typeof object.pipe === 'function';
  }
};
