var launcher = require('browser-launcher');
var Phantom = require('phantomjs-stream');
var Electron = require('electron-stream');

module.exports = function(opts, cb){
  if (/^phantom/.test(opts.name)) {
    var browser = Phantom();
    browser.end('location = ' + JSON.stringify(opts.loc));
    process.nextTick(cb.bind(null, null, browser));
  }  else if (/^electron/.test(opts.name)) {
    var browser = Electron(opts);
    opts.bundle.createReadStream().pipe(browser);
    process.nextTick(cb.bind(null, null, browser));
  } else {
    launcher(function(err, launch){
      if (err) return cb(err);
      launch(opts.loc, {
        headless: false,
        browser: opts.name
      }, cb);
    });
  }
}
