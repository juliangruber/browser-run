#!/usr/bin/env node

var run = require('..');
var optimist = require('optimist');

var argv = optimist
  .usage(
    'Run JavaScript in a browser.\n' +
    'Write code to stdin and receive console output on stdout.\n' +
    'Usage: $0 [OPTIONS]'
  )

  .describe('browser', '[Object|String]. Object with browser.name and browser.options fields. Or string to pass browser.name only.' +
      '\n\tAlways available: electron. ' +
      '\n\tOptions available: electron only. ' +
      '\n\tAvailable if installed: chrome, firefox, ie, phantom, safari' +
      '\n\tUsage: '+
      '\n\t\t--browser=chrome - set browser name with no options passed.' +
      '\n\t\t--browser.name=electron --browser.options.width=800 --browser.options.height=500 --browser.options.webPreferences.webSecurity=false - set browser and specify browser options.\n')
  .alias('b', 'browser')
  .default('browser.name', 'electron')

  .describe('port', 'Starts listening on that port and waits for you to open a browser')
  .alias('p', 'port')

  .describe('static', 'Serve static assets from this directory')
  .alias('s', 'static')

  .describe('input', 'Input type. Defaults to \'javascript\', can be set to \'html\'.')
  .alias('i', 'input')

  .describe('help', 'Print help')
  .alias('h', 'help')

  .argv;

if (argv.help) return optimist.showHelp();

process.stdin
  .pipe(run(argv))
  .pipe(process.stdout);
