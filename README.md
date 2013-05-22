# browser-run

The easiest way of running code in a browser environment.

## Usage

```bash
$ echo "console.log('Hey there from ' + document.location)" | browser-run
Hey there from http://localhost:53227/
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
  --browser, -b  Browser to use. Available if installed: chrome, firefox, ie, phantom, safari  [default: "phantom"]
  --port, -p     Starts listening on that port and waits for you to open a browser
  --help, -h     Print help

```

## API

### run([opts])

Returns a duplex stream and starts a webserver.

`opts` can be:

* `port`: If speficied, no browser will be started, so you can point one yourself to `http://localhost/<port>`
* `browser`: Browser to use. Defaults to `phantom`. Available if installed:
  * `chrome`
  * `firefox`
  * `ie`
  * `phantom`
  * `safari`

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
