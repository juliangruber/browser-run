# browser-run

The easiest way of running code in a browser environment.

Bundles `electronjs` by default!

[![build status](https://secure.travis-ci.org/juliangruber/browser-run.svg)](http://travis-ci.org/juliangruber/browser-run)

## Usage

```bash
$ echo "console.log('Hey from ' + location); window.close()" | browser-run
Hey from http://localhost:53227/
$
```

Or use `browser-run` programmatically:

```js
var run = require('browser-run');

var browser = run();
browser.pipe(process.stdout);
browser.end('console.log(location); window.close()');
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
  --browser, -b  Browser to use. Always available: electron. Available if installed: chrome, firefox, ie, phantom, safari  [default: "electron"]
  --port         Starts listening on that port and waits for you to open a browser                                       
  --static       Serve static assets from this directory                                                                 
  --input        Input type. Defaults to 'javascript', can be set to 'html'.                                             
  --help         Print help                                                                                              

```

## Custom html file

By using `-input html` or `{ input: 'html' }` you can provide a custom html file for browser-run to use. Keep in mind though that it always needs to have `<script src="/reporter.js"></script>` above other script tags so browser-run is able to properly forward your `console.log`s etc to the terminal.

## API

### run([opts])

Returns a duplex stream and starts a webserver.

`opts` can be:

* `port`: If speficied, no browser will be started, so you can point one yourself to `http://localhost/<port>`
* `browser`: Browser to use. Defaults to `electron`. Available if installed:
  * `chrome`
  * `firefox`
  * `ie`
  * `phantom`
  * `safari`
* `static`: Serve static files from this directory
* `input`: Input type. Defaults to `javascript`, can be set to `html`.

If only an empty string is written to it, an error will be thrown as there is nothing to execute.

If you call `window.close()` inside the script, the browser will exit.

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
