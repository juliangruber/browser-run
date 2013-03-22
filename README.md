
# browser-run

Write JavaScript to it and receive the console output of that code run in a
real browser environment.

## Usage

```bash
$ echo "console.log('foo')" | browser-run
# => foo
```

Or use `browser-run` programmatically:

```js
var run = require('browser-run');

// create a browser
var browser = run();

// console output comes in
browser.on('data', function (data) {
  console.log(data);
  // => foo
  // when finished, call stop()
  browser.stop();
});

// write some javascript to it
browser.write('console.log("foo")');
// close the input stream
browser.end();
```

## Example with browserify

```bash
$ browserify main.js | browser-run
```

or

```js
var browserify = require('browserify');
var run = require('browser-run');

var browser = run();
browserify('main.js').bundle().pipe(browser);

browser.on('data', function (data) {
  console.log('data', data);
  if (finished) {
    browser.stop();
  }
});
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
