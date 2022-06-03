var test = require('test');
var assert = require('assert');
var run = require('..');

test('window.close()', function (t, done) {
  var browser = run();
  var eventCount = 0;

  browser.on('data', function (data) {
    assert.strictEqual(data, 'foo\n', 'data');
    if (++eventCount === 2) done();
  });

  browser.on('exit', function (code) {
    assert.strictEqual(code, 0, 'exit');
    if (++eventCount === 2) done();
  });

  browser.write('console.log("foo");');
  browser.write('window.close();');
  browser.end();
});
