var http = require('http');
var path = require('path');
var spawn = require('child_process').spawn;
var through = require('through');
var duplex = require('duplexer');
var fs = require('fs');
var xws = require('xhr-write-stream')();
var enstore = require('enstore');
var launch = require('./lib/launch');
var ecstatic = require('ecstatic');
var injectScript = require('html-inject-script');
var destroyable = require('server-destroy');
var extend = require('xtend');
var injectCss = require('html-inject-css');
var injectVdom = require('html-inject-vdom');
var smokestack = require('smokestack')
var execSpawn = require('execspawn')

try {
  fs.statSync(__dirname + '/static/reporter.js')
} catch (_) {
  console.error('Reporter script missing. Run `make build` first.')
}

module.exports = function (opts) {
  if (!opts) opts = {};
  if ('number' == typeof opts) opts = { port: opts };
  if (!opts.browser) opts.browser = 'electron';
  if (!opts.input) opts.input = 'javascript';
  return runner(opts);
};

function runner (opts) {
  var empty = true;
  var input = through(function (chunk) {
    if (empty && chunk.toString().trim() != '') empty = false;
    this.queue(chunk);
  }, function () {
    if (empty) dpl.emit('error', new Error('javascript required'));
    this.queue(null);
  });
  var bundle = enstore();
  input.pipe(bundle.createWriteStream());
  var output = through();
  var dpl = duplex(input, output);

  var mockHandler = opts.mock && require(path.resolve('./', opts.mock))

  var server = http.createServer(function (req, res) {

    if (opts.input === 'javascript') {
      if (/^\/bundle\.js/.test(req.url)) {
        res.setHeader('content-type', 'application/javascript');
        res.setHeader('cache-control', 'no-cache');
        bundle.createReadStream().pipe(res);
        return;
      }

      if (req.url == '/') {
        if (opts.injectvdom) {
          var vdom = injectVdom(opts.injectvdom);
          vdom.pipe(res);
        }
        if (opts.injectcss) {
          var css = injectCss(opts.injectcss);
          css.pipe(opts.injectvdom ? vdom : res);
        }
        fs.createReadStream(__dirname + '/static/index.html').pipe(opts.injectcss ? css : opts.injectvdom ? vdom : res);
        return;
      }
    } else if (opts.input === 'html') {
      if (req.url == '/') {
        bundle.createReadStream().pipe(injectScript(['/reporter.js'])).pipe(res);
        return;
      }
    }

    if (req.url == '/xws') {
      req.pipe(xws(function (stream) {
        stream.pipe(output);
      }));
      return req.on('end', res.end.bind(res));
    }
    if (req.url == '/reporter.js') {
      res.setHeader('content-type', 'application/javascript');
      fs.createReadStream(__dirname + '/static/reporter.js').pipe(res);
      return;
    }
    if (opts.static) {
      ecstatic({ root: opts.static })(req, res);
      return;
    }
    if (mockHandler && '/mock' === req.url.substr(0,5)){
        return mockHandler(req, res);
    }

    res.end('not supported');
  });
  destroyable(server);

  var browser;

  if (opts.port) {
    server.listen(opts.port);
  } else {
    server.listen(function () {
      var address = server.address();
      if (!address) return; // already closed
      var port = address.port;

      if(opts.browser != 'chrome' || opts.browser != 'firefox'){

        launch(extend(opts, {
          loc: 'http://localhost:' + port,
          name: opts.browser,
          bundle: bundle
        }), function(err, _browser){
          if (err) return dpl.emit('error', err);
          browser = _browser;

          // phantom, electron
          if (browser.pipe) {
            browser.setEncoding('utf8');
            browser.pipe(output);
          }

          browser.on('exit', function (code, signal) {
            try { server.destroy() } catch (e) {}
            dpl.emit('exit', code, signal);
          });
        });

      } else {

        // use smokestack for chrome and firefox so we can pipe back to output
        var _smokestack = execSpawn('smokestack', {stdio: 'pipe'});

        bundle.createReadStream().pipe(_smokestack.stdin);

        _smokestack.stdout.pipe(output);
        _smokestack.stderr.pipe(output);

        _smokestack.on('exit', function (code, signal) {
          try { server.destroy() } catch (e) {}
          dpl.emit('exit', code, signal);
        });

      }
    });
  }

  dpl.stop = function () {
    try { server.destroy(); } catch (e) {}
    if (browser) browser.kill();
  };

  return dpl;
}
