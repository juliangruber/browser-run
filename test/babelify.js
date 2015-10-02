var test = require('tap').test;
var run = require('..');
var browserify = require('browserify');
var babelify = require('babelify');
var Readable = require('stream').Readable;

test('babelify', function (t) {
  t.plan(2);
  var browser = run();

  var data = '';
  browser.on('data', function (d) {
    data += d.toString();
  });

  browser.on('exit', function (code) {
    console.log('data');
    console.log(data);
    console.log('data');
    t.ok(/# ok$/.test(data));
    t.equal(code, 0, 'exit');
  });

  var rs = Readable();
  rs.push('import test from "tape";');
  rs.push('test("teadown", t => {\n');
  rs.push('  t.ok(true);\n');
  //rs.push('  t.on("end", function(){window.close()});');
  rs.push('  t.end();\n');
  rs.push('})');
  rs.push(null);

  browserify([rs])
  .transform(babelify)
  .bundle()
  //.pipe(process.stdout)
  .pipe(browser);
});
