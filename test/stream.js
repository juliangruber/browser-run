var test = require('test');
var assert = require('assert');
var run = require('..');

test('stream', function (t, done) {
  var browser = run();

  browser.on('data', function (data) {
    browser.stop();
    assert.strictEqual(data, 'foo\n', 'correct stdout');
    done();
  });

  browser.end('console.log("foo")');
});
