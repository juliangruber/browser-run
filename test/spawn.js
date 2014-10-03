var test = require('tap').test;
var spawn = require('child_process').spawn;

test('spawn', function (t) {
  var ps = spawn(__dirname + '/../bin/bin.js');

  ps.stdout.on('data', function (data) {
    t.equal(data.toString(), 'foo\n');
  });
  setTimeout(function() {
      ps.kill();
  }, 3000)
  ps.on('exit', function() {
    t.end()
  })
  ps.stderr.on('data', function() {
    t.fail()
  })

  ps.stdin.write('console.log("foo");');
  ps.stdin.end();
});
