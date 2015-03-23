var http = require('http');
var spawn = require('child_process').spawn;
var through = require('through');
var duplex = require('duplexer');
var browserify = require('browserify');
var fs = require('fs');
var xws = require('xhr-write-stream')();
var enstore = require('enstore');
var launch = require('./lib/launch');
var ecstatic = require('ecstatic');

module.exports = function (opts) {
  if (!opts) opts = {};
  if ('number' == typeof opts) opts = { port: opts };
  if (!opts.browser) opts.browser = 'phantom';
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
    if (opts.static) {
      ecstatic({ root: opts.static })(req, res);
      return;
    }

    res.end('not supported');
  });

  var browser;

  if (opts.port) {
    server.listen(opts.port);
  } else {
    server.listen(function () {
      var port = server.address().port;

      launch('http://localhost:' + port, opts.browser, function(err, _browser){
        if (err) return dpl.emit('error', err);
        browser = _browser;
      });
    });
  }

  dpl.stop = function () {
    server.close();
    if (browser) browser.kill();
  }

  return dpl;
}
