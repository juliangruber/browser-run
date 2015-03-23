var launcher = require('browser-launcher');
var Phantom = require('phantomjs-stream');

module.exports = function(loc, name, cb){
  if (/^phantom/.test(name)) {
    var browser = Phantom();
    browser.end('location = ' + JSON.stringify(loc));
    process.nextTick(cb.bind(null, null, browser));
  } else {
    launcher(function(err, launch){
      if (err) return cb(err);
      launch(loc, {
        headless: false,
        browser: name
      }, function(err, ps){
        if (err) return cb(err);
        cb(null, ps);
      });
    });
  }
}
