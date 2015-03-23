var test = require('tap').test;
var run = require('..');

test('error', function (t) {
  var browser = run({ browser: 'foobar' });

  browser.on('error', function (err) {
    browser.stop();
    t.ok(err);
    t.end();
  });
});
