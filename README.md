# toledo

A template language that understands concurrent JavaScript constructs like
streams and promises. Such values can be interpolated into templates that stream
output out as soon as it's ready, and all in the right order.

```js
var streamer = require('./spec/support/streamer'),
    toledo   = require('.');


var template = toledo.compileTemplate(
  'Hi {{ name }}, welcome to {{ city }}!\n' +
  'Happy {{ task }} :)\n'
);

var stream = template.evaluate({
  name: streamer('jcoglan'.split(''), 500),
  city: streamer('Edinburgh'.split(''), 200),
  task: Promise.resolve('JavaScripting')
});

stream.pipe(process.stdout);
```
