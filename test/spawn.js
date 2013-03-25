var test = require('tap').test;
var spawn = require('child_process').spawn;

test('spawn', function (t) {
  var ps = spawn(__dirname + '/../bin/bin.js');
  
  ps.stdout.on('data', function (data) {
    t.equal(data.toString(), 'foo\n');
    ps.kill();
    t.end();
  });
  ps.stderr.on('data', t.notOk.bind(t));

  ps.stdin.write('console.log("foo");');
  ps.stdin.end();
});
