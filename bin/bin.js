#!/usr/bin/env node

var run = require('..');
var optimist = require('optimist');

var argv = optimist
  .usage(
    'Run JavaScript in a browser.\n' +
    'Write code to stdin and receive console output on stdout.\n' +
    'Usage: $0 [OPTIONS]'
  )

  .describe('browser', 'Browser to use. Available if installed: '
      + 'chrome, firefox, ie, phantom, safari')
  .alias('browser', 'b')
  .default('browser', 'phantom')

  .describe('port', 'Starts listening on that port and waits for you to open a browser')
  .alias('p', 'port')


  .describe('help', 'Print help')
  .alias('h', 'help')

  .argv;

if (argv.help) return optimist.showHelp();

process.stdin
  .pipe(run(argv))
  .pipe(process.stdout);
