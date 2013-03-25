var test = require('tap').test;
var run = require('..');

test('stream', function (t) {
  var browser = run();

  browser.on('data', function (data) {
    browser.stop();
    t.equal(data, 'foo\n');
    t.end();
  });

  browser.write('console.log("foo")');
  browser.end();
});
