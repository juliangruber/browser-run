var test = require('tap').test;
var run = require('..');
var concat = require('concat-stream');

test('input=javascript (default)', function (t) {
  t.plan(2);
  var browser = run();

  browser.pipe(concat(function(data){
    t.equal('\n', data.toString());
  }));

  browser.on('exit', function (code) {
    t.equal(code, 0, 'exit');
  });

  browser.write('console.log(document.title);');
  browser.write('window.close();');
  browser.end();
});

test('input=html', function (t) {
  t.plan(2);
  var browser = run({
    input: 'html'
  });

  browser.pipe(concat(function(data){
    t.equal('FOO\n', data.toString());
  }));

  browser.on('exit', function (code) {
    t.equal(code, 0, 'exit');
  });

  browser.write('<title>FOO</title>');
  browser.write('<script>console.log(document.title);window.close()</script>');
  browser.end();
});
