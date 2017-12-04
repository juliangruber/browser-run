var test = require('tap').test;
var run = require('..');
var fs = require('fs');

test('static', function (t) {
  var browser = run({ static: __dirname });

  browser.on('data', function (data) {
    t.equal(data.trim(), fs.readFileSync(`${__dirname}/static.js`).toString().trim());
    t.end();
  });

  browser.write('fetch("/static.js").then(res => res.text()).then(body => {console.log(body); window.close()})');
  browser.end();
});
