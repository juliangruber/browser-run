var test = require('node-core-test');
var assert = require('assert');
var run = require('..');
var concat = require('concat-stream');

test('electron', async function (t) {
  await t.test('nodeIntegration off by default', function (t, done) {
    var browser = run({
      browser: 'electron'
    });
    let eventCount = 0;

    browser.pipe(concat(function(data){
      assert(!/electron\.asar/.test(data.toString()));
      if (++eventCount === 2) done();
    }));

    browser.on('exit', function (code) {
      assert.strictEqual(code, 0, 'exit');
      if (++eventCount === 2) done();
    });

    browser.write('console.log(__dirname);');
    browser.write('window.close();');
    browser.end();
  });
  await t.test('nodeIntegration on', function (t, done) {
    var browser = run({
      browser: 'electron',
      nodeIntegration: true
    });
    let eventCount = 0;

    browser.pipe(concat(function(data){
      assert(/browser-run/.test(data.toString()));
      if (++eventCount === 2) done();
    }));

    browser.on('exit', function (code) {
      assert.strictEqual(code, 0, 'exit');
      if (++eventCount === 2) done();
    });

    browser.write('console.log(__dirname);');
    browser.write('window.close();');
    browser.end();
  });
  await t.test('basedir option', function (t, done) {
    var browser = run({
      browser: 'electron',
      node: true,
      basedir: __dirname + '/../'
    });
    let eventCount = 0;

    browser.pipe(concat(function(data){
      assert(/^true\n$/.test(data.toString()));
      if (++eventCount === 2) done();
    }));

    browser.on('exit', function (code) {
      assert.strictEqual(code, 0, 'exit');
      if (++eventCount === 2) done();
    });

    browser.write('console.log(!!require.resolve("xtend"));');
    browser.write('window.close();');
    browser.end();
  });
  await t.test('supports async functions', function (t, done) {
    var browser = run({
      browser: 'electron'
    });
    let eventCount = 0;

    browser.pipe(concat(function(data){
      assert.strictEqual(data.toString(), 'ok\n');
      if (++eventCount === 2) done();
    }));

    browser.on('exit', function (code) {
      assert.strictEqual(code, 0, 'exit');
      if (++eventCount === 2) done();
    });

    browser.write('const fn = async () => \'ok\';');
    browser.write('fn().then(text => { console.log(text); window.close(); })');
    browser.end();
  });
});
