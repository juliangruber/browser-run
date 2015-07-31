var test = require('tap').test;
var run = require('..');

test('empty', function (t) {
  var browser = run();

  browser.on('data', function (data) {
    t.fail(data.toString());
  });

  browser.on('error', function (err) {
    browser.stop();
    t.ok(err);
    t.end();
  });

  browser.write('  ');
  browser.end();
});
