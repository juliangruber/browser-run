var launcher = require('browser-launcher');
var Phantom = require('phantomjs-stream');
var Electron = require('electron-stream');

module.exports = function(loc, name, cb){
  if (/^phantom/.test(name)) {
    var browser = Phantom();
    browser.end('location = ' + JSON.stringify(loc));
    process.nextTick(cb.bind(null, null, browser));
  }  else if (/^electron/.test(name)) {
    var browser = Electron();
    browser.end('location = ' + JSON.stringify(loc));
    process.nextTick(cb.bind(null, null, browser));
  } else {
    launcher(function(err, launch){
      if (err) return cb(err);
      launch(loc, {
        headless: false,
        browser: name
      }, cb);
    });
  }
}
