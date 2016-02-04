var test = require('tap').test;
var run = require('..');

test('electron-stream', function (t) {
  var browser = run({
    browser: {
      name: 'electron',
      options: {
        height: 500
      }
    }
  });

  browser.on('data', function (data) {
    browser.stop();
    t.equal(data, '500\n', 'correct stdout');
    t.end();
  });

  browser.end('console.log(window.outerHeight);');
});

