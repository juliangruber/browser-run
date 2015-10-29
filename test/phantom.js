var test = require('tap').test;
var run = require('..');
var concat = require('concat-stream');

test('phantomjs', function (t) {
  t.plan(2);
  var browser = run({ browser: 'phantom' });

  browser.pipe(concat(function(data){
    t.equal(data.toString(), 'foo\n', 'data');
  }));

  browser.on('exit', function (code) {
    t.equal(code, 0, 'exit');
  });

  browser.write('console.log("foo");');
  browser.write('window.close();');
  browser.end();
});
