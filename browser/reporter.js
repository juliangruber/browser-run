;(function () {
  if (!/Phantom/.test(window.navigator.userAgent)) {
    window.onerror = function (err) {
      console.error(err);
    }
  }

  var xws = require('xhr-write-stream')('/xws');
  var ws = require('utf8-stream')();
  ws.pipe(xws);

  var console = window.console || {};
  var methods = ['log', 'error', 'warn', 'dir', 'debug', 'info', 'trace'];
  for (var i = 0; i < methods.length; i++) (function (method) {
    var old = console[method];
    console[method] = function (msg) {
      ws.write(msg + '\n');
      if (old) old.apply(console, arguments);
      if (msg instanceof Error && typeof JSON != 'undefined') {
        ws.write(JSON.stringify(msg) + '\n'); 
      }
    }
  })(methods[i]);
})();
