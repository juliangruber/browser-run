#!/usr/bin/env node

var run = require('..');
var yargs = require('yargs/yargs')

var argv = yargs(process.argv.slice(2))
  .usage(
    'Run JavaScript in a browser.\n' +
    'Write code to stdin and receive console output on stdout.\n' +
    'Usage: $0 [OPTIONS]'
  )

  .describe('browser', 'Browser to use. '
      + 'Always available: electron. '
      + 'Available if installed: '
      + 'chrome, firefox, ie, safari')
  .alias('browser', 'b')
  .default('browser', 'electron')

  .describe('port', 'Starts listening on that port and waits for you to open a browser')
  .alias('p', 'port')

  .describe('static', 'Serve static assets from this directory')
  .alias('s', 'static')

  .describe('mock', 'Path to code to handle requests for mocking a dynamic back-end')
  .alias('m', 'mock')

  .describe('input', 'Input type. Defaults to \'javascript\', can be set to \'html\'.')
  .alias('i', 'input')

  .describe('node', 'Enable nodejs apis in electron')
  .alias('n', 'node')

  .describe('sandbox', 'Enable electron sandbox')
  .boolean('sandbox')
  .default('sandbox', true)

  .describe('basedir', 'Set this if you need to require node modules in node mode')

  .help('h')
  .describe('help', 'Print help')
  .alias('h', 'help')

  .argv;

argv.nodeIntegration = argv['node-integration']

process.stdin
  .pipe(run(argv))
  .pipe(process.stdout);
