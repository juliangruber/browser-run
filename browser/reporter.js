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
    console[methods[i]] = function (msg) {
      ws.write(msg + '\n');
      if (msg instanceof Error && typeof JSON != 'undefined') {
        ws.write(JSON.stringify(msg) + '\n'); 
      }
    }
  }
})();
