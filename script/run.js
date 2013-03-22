var page = require('webpage').create();
var args = require('system').args;

page.open('http://localhost:' + args[1], function () { });
