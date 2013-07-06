;(function () {
  if (!/Phantom/.test(window.navigator.userAgent)) {
    window.onerror = function (err) {
      console.error(err);
    }
  }

  var xws = require('xhr-write-stream');
  var ws = xws('/xws');

  var console = window.console || {};
  var methods = ['log', 'error', 'warn', 'dir', 'debug', 'info', 'trace'];
  for (var i = 0; i < methods.length; i++) {
    var old = console[methods[i]];
    console[methods[i]] = function (msg) {
      ws.write(msg + '\n');
      if (old) old.apply(console, arguments);
      if (msg instanceof Error && typeof JSON != 'undefined') {
        ws.write(JSON.stringify(msg) + '\n'); 
      }
    }
  }
})();
