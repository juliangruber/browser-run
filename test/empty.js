var test = require('node-core-test');
var assert = require('assert');
var run = require('..');

test('empty', function (t, done) {
  var browser = run();

  browser.on('data', function (data) {
    throw new Error(data.toString());
  });

  browser.on('error', function (err) {
    browser.stop();
    assert(err);
    done();
  });

  browser.write('  ');
  browser.end();
});
