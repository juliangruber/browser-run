var test = require('test');
var assert = require('assert');
var run = require('..');

test('error', function (t, done) {
  var browser = run({ browser: 'foobar' });

  browser.on('error', function (err) {
    browser.stop();
    assert(err);
    done();
  });
});
