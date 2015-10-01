var test = require('tap').test;
var run = require('..');
var babel = require('babel');

test('babel', function (t) {
  t.plan(2);
  var browser = run();

  browser.on('data', function (data) {
    t.equal(data, 'foo\n', 'data');
  });

  browser.on('exit', function (code) {
    t.equal(code, 0, 'exit');
  });

  var code = babel.transform('console.log("foo");window.close()').code;
  browser.end(code);
});
