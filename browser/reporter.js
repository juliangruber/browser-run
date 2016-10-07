;(function () {
  require('source-map-support').install();

  if (/Phantom/.test(window.navigator.userAgent)) {
    window.close = function () {
      setTimeout(function () {
        phantom.exit();
      }, 1000);
    };
  } else if (!/Electron/.test(window.navigator.userAgent)) {
    var close = window.close;
    window.close = function () {
      setTimeout(function () {
        close.call(window);
      }, 1000);
    };
  }

  if (!/Phantom|Electron/.test(window.navigator.userAgent)) {
    window.onerror = function (back, _, _, _, err) {
      console.error(err && err.stack
        || err
        || back);
    };

    var xws = require('xhr-write-stream')('/xws');
    var ws = require('utf8-stream')();
    ws.pipe(xws);

    var console = window.console || {};
    var methods = ['log', 'error', 'warn', 'dir', 'debug', 'info', 'trace'];
    for (var i = 0; i < methods.length; i++) (function (method) {
      var old = console[method];
      console[method] = function (msg) {
        ws.write(Array.prototype.slice.call(arguments, 0).join(' ') + '\n');
        if (old) old.apply(console, arguments);
        if (msg instanceof Error && typeof JSON != 'undefined') {
          ws.write(JSON.stringify(msg) + '\n'); 
        }
      }
    })(methods[i]);
  }

})();
