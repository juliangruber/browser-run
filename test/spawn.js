var test = require('node-core-test');
var assert = require('assert');
var spawn = require('child_process').spawn;
var kill = require('tree-kill');

test('spawn', function (t, done) {
  var ps = spawn(__dirname + '/../bin/bin.js');
  
  ps.stdout.on('data', function (data) {
    assert.strictEqual(data.toString(), 'foo\n');
    kill(ps.pid);
    done();
  });
  ps.stderr.on('data', d => { throw new Error(d.toString()) });

  ps.stdin.write('console.log("foo");');
  ps.stdin.end();
});
