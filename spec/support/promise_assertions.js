module.exports = {
  assertPromiseEqual: function(result, promise, resume) { with(this) {
    promise.then(function(value) {
      resume(function() { assertEqual(result, value) })
    }, resume)
  }},

  assertPromiseRejected: function(promise, resume) { with(this) {
    promise.then(function(value) {
      resume(function() { flunk("Promise unexpectedly resolved") })
    }, function(error) {
      resume(function() { assert(error) })
    })
  }}
}
