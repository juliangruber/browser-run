var test = require('tap').test;
var run = require('..');
var fs = require("fs");

test('opts', function (t) {
  var browser = run({
    getRoot: function(req, res) {
      fs.createReadStream(__dirname + '/fixtures/index.html').pipe(res);
    }
  });

  browser.on('data', function (data) {
    browser.stop();
    t.match(data, "Custom index.html");
    t.end();
  });

  browser.end('console.log(document.title)');
});