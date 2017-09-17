var launcher = require('browser-launcher3');
var Phantom = require('phantomjs-stream');
var Electron = require('electron-stream');

module.exports = function(opts, cb){
  if (/^phantom/.test(opts.name)) {
    var browser = Phantom();
    browser.end('location = ' + JSON.stringify(opts.loc));
    process.nextTick(cb.bind(null, null, browser));
  }  else if (/^electron/.test(opts.name)) {
    var browser = Electron(opts);
    if (opts.input === 'javascript') {
      opts.bundle.createReadStream().pipe(browser);
    } else {
      browser.end('location = ' + JSON.stringify(opts.loc));
    }
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
