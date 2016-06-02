'use strict';

module.exports = {
  is: function(object) {
    return !!object && typeof object.then === 'function';
  }
};
