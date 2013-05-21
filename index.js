var http = require('http');
var spawn = require('child_process').spawn;
var through = require('through');
var phantomjs = require('phantomjs').path;
var duplex = require('duplexer');
var browserify = require('browserify');
var fs = require('fs');
var xws = require('xhr-write-stream')();
var enstore = require('enstore');

module.exports = runner;

function runner (port) {
  var bundle = enstore();
  var output = through();
  var dpl = duplex(bundle.createWriteStream(), output);

  var server = http.createServer(function (req, res) {
    if (/^\/bundle\.js/.test(req.url)) {
      res.setHeader('content-type', 'application/javascript');
      bundle.createReadStream().pipe(res);
      return;
    }
    if (req.url == '/xws') {
      req.pipe(xws(function (stream) {
        stream.pipe(output); 
      }));
      return req.on('end', res.end.bind(res));
    }
    if (req.url == '/reporter.js') {
      res.setHeader('content-type', 'application/javascript');
      browserify(__dirname + '/browser/reporter.js')
      .bundle().pipe(res);
      return;
    }
    if (req.url == '/') {
      fs.createReadStream(__dirname + '/static/index.html').pipe(res);
      return;
    }

    res.end('not supported');
  });

  var ps;

  if (port) {
    server.listen(port);
  } else {
    server.listen(function () {
      port = server.address().port;

      ps = spawn(phantomjs, [__dirname + '/script/run.js', port]);
      ps.stdout.pipe(process.stdout, { end : false });
      ps.stderr.pipe(process.stderr, { end : false });

      process.on('exit', ps.kill.bind(ps, null));
    });
  }

  dpl.stop = function () {
    server.close();
    if (ps) ps.kill();
  }

  return dpl;
}
