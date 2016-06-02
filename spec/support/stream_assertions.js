var concat = require("concat-stream")

module.exports = {
  assertStreamEqual: function(result, stream, resume) { with(this) {
    stream.pipe(concat(function(value) {
      resume(function() { assertEqual(result, value.toString()) })
    }))

    stream.on('error', resume)
  }}
};
