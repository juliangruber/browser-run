var test = require('tap').test;
var run = require('..');

test('window.close()', function (t) {
  t.plan(2);
  var browser = run();

  browser.on('data', function (data) {
    t.equal(data, 'foo\n', 'data');
  });

  browser.on('exit', function (code) {
    t.equal(code, 0, 'exit');
  });

  browser.end('console.log("foo");window.close()');
});
