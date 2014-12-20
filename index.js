var http = require('http');
var spawn = require('child_process').spawn;
var through = require('through');
var duplex = require('duplexer');
var browserify = require('browserify');
var fs = require('fs');
var xws = require('xhr-write-stream')();
var enstore = require('enstore');
var launcher = require('browser-launcher');

module.exports = function (opts) {
  if (!opts) opts = {};
  if ('number' == typeof opts) opts = { port: opts };
  if (!opts.browser) opts.browser = 'phantom';
  opts.static = !!opts.static;
  return runner(opts);
};

function runner (opts) {
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

    if ( opts.static ) {
      fs.exists( process.cwd() + req.url, function( exist ) {
        if ( exist ) {
          fs.createReadStream( process.cwd() + req.url ).pipe( res );
          return;
        }
        res.end('not supported');
      } );
      return;
    }

    res.end('not supported');
  });

  var ps;

  if (opts.port) {
    server.listen(opts.port);
  } else {
    server.listen(function () {
      var port = server.address().port;

      launcher(function (err, launch) {
        if (err) console.error(err), process.exit(1);

        launch('http://localhost:' + port, {
          headless: false,
          browser: opts.browser
        }, function (err, _ps) {
          if (err) console.error(err), process.exit(1);

          ps = _ps;
          ps.stdout.pipe(process.stdout, { end : false });
          ps.stderr.pipe(process.stderr, { end : false });

          process.on('exit', ps.kill.bind(ps, null));
        });
      });
    });
  }

  dpl.stop = function () {
    server.close();
    if (ps) ps.kill();
  }

  return dpl;
}
