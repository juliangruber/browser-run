var test = require('tap').test;
var run = require('..');
var concat = require('concat-stream');

test('electron', function (t) {
  t.test('nodeIntegration off by default', function (t) {
    t.plan(2);
    var browser = run({
      browser: 'electron'
    });

    browser.pipe(concat(function(data){
      t.notOk(/electron\.asar/.test(data.toString()));
    }));

    browser.on('exit', function (code) {
      t.equal(code, 0, 'exit');
    });

    browser.write('console.log(__dirname);');
    browser.write('window.close();');
    browser.end();
  });
  t.test('nodeIntegration on', function (t) {
    t.plan(2);
    var browser = run({
      browser: 'electron',
      nodeIntegration: true
    });

    browser.pipe(concat(function(data){
      t.ok(/browser-run/.test(data.toString()));
    }));

    browser.on('exit', function (code) {
      t.equal(code, 0, 'exit');
    });

    browser.write('console.log(__dirname);');
    browser.write('window.close();');
    browser.end();
  });
  t.test('basedir option', function (t) {
    t.plan(2);
    var browser = run({
      browser: 'electron',
      nodeIntegration: true,
      basedir: __dirname + '/../'
    });

    browser.pipe(concat(function(data){
      t.ok(/^true\n$/.test(data.toString()));
    }));

    browser.on('exit', function (code) {
      t.equal(code, 0, 'exit');
    });

    browser.write('console.log(!!require.resolve("tap"));');
    browser.write('window.close();');
    browser.end();
  });
  t.end();
});
