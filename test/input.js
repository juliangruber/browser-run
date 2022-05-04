var test = require('node-core-test');
var assert = require('assert');
var run = require('..');
var concat = require('concat-stream');

test('input=javascript (default)', function (t, done) {
  var browser = run();
  let eventCount = 0;

  browser.pipe(concat(function(data){
    assert.strictEqual('\n', data.toString());
    if (++eventCount === 2) done();
  }));

  browser.on('exit', function (code) {
    assert.strictEqual(code, 0, 'exit');
    if (++eventCount === 2) done();
  });

  browser.write('console.log(document.title);');
  browser.write('window.close();');
  browser.end();
});

test('input=html', function (t, done) {
  var browser = run({
    input: 'html'
  });
  let eventCount = 0;

  browser.pipe(concat(function(data){
    assert.strictEqual('FOO\n', data.toString());
    if (++eventCount === 2) done();
  }));

  browser.on('exit', function (code) {
    assert.strictEqual(code, 0, 'exit');
    if (++eventCount === 2) done();
  });

  browser.write('<title>FOO</title>');
  browser.write('<script>console.log(document.title);window.close()</script>');
  browser.end();
});
