# browser-run

The easiest way of running code in a browser environment.

[![Build Status](https://travis-ci.org/juliangruber/browser-run.png?branch=master)](https://travis-ci.org/juliangruber/browser-run)

## Usage

```bash
$ echo "console.log(document.location)" | browser-run
# => http://localhost:53227/
```

Or use `browser-run` programmatically:

```js
var run = require('browser-run');

var browser = run();
browser.pipe(process.stdout);
browser.write('console.log(document.location)');
browser.end();
```

## Example with browserify

```bash
$ browserify main.js | browser-run
```

or

```js
var browserify = require('browserify');
var browser = require('browser-run');

browserify('main.js').bundle().pipe(browser()).pipe(process.stdout);
```

## CLI

```bash
$ browser-run --help
Run JavaScript in a browser.
Write code to stdin and receive console output on stdout.
Usage: browser-run [OPTIONS]

Options:
  --port, -p  Start listening on that port
  --help, -h  Print help

```

## API

### run([port])

Returns a duplex stream and starts a webserver.

If you don't specify `port` a random port will be chosen and **phantomjs** will be pointed at
the server for `headless` testing.

If you speficy `port` you will have to point a browser to `"http://localhost/" + port`.

### run#stop()

Stop the underlying webserver.

## Installation

With [npm](http://npmjs.org) do

```bash
$ npm install browser-run    # for library
$ npm install -g browser-run # for cli
```

## License

(MIT)
