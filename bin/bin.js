#!/usr/bin/env node

var run = require('..');
var optimist = require('optimist');

var argv = optimist
  .usage(
    'Run JavaScript in a browser.\n' +
    'Write code to stdin and receive console output on stdout.\n' +
    'Usage: $0 [OPTIONS]'
  )

  .describe('port', 'Start listening on that port')
  .alias('p', 'port')

  .describe('help', 'Print help')
  .alias('h', 'help')

  .argv;

if (argv.help) return optimist.showHelp();

process.stdin.pipe(run(argv.port)).pipe(process.stdout);
