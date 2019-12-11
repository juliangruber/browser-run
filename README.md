# browser-run

The easiest way of running code in a browser environment.

Bundles `electronjs` by default!

[![build status](https://secure.travis-ci.org/juliangruber/browser-run.svg)](http://travis-ci.org/juliangruber/browser-run)
[![downloads](https://img.shields.io/npm/dm/browser-run.svg)](https://www.npmjs.org/package/browser-run)

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
  --browser, -b  Browser to use. Always available: electron. Available if installed: chrome, firefox, ie, safari  [default: "electron"]
  --port         Starts listening on that port and waits for you to open a browser
  --static       Serve static assets from this directory
  --mock         Path to code to handle requests for mocking a dynamic back-end
  --input        Input type. Defaults to 'javascript', can be set to 'html'.
  --node         Enable nodejs apis in electron
  --basedir      Set this if you need to require node modules in node mode
  --help         Print help
```

## Custom html file

By using `--input html` or `{ input: 'html' }` you can provide a custom html file for browser-run to use. Keep in mind though that it always needs to have `<script src="/reporter.js"></script>` above other script tags so browser-run is able to properly forward your `console.log`s etc to the terminal.

## Dynamic back-end mock

By using `--mock mock.js` or `{ mock: 'mock.js'}` you can provide a custom server-side implementation and handle all requests that are sent to paths beginning with `/mock`

mock.js needs to export a function that accepts `req` and `res` arguments for handling requests.

Example:

```js
module.exports = function(req,res){
  if (req.url === '/mock/echo') {
    req.pipe(res)
  }
}
```

## API

### run([opts])

Returns a duplex stream and starts a webserver.

`opts` can be:

* `port`: If speficied, no browser will be started, so you can point one yourself to `http://localhost/<port>`
* `browser`: Browser to use. Defaults to `electron`. Available if installed:
  * `chrome`
  * `firefox`
  * `ie`
  * `safari`
* `static`: Serve static files from this directory
* `mock`: Path to code to handle requests for mocking a dynamic back-end
* `input`: Input type. Defaults to `javascript`, can be set to `html`.
* `node`: Enable nodejs integration in electron
* `basedir`: Set this if you need to require node modules in `node` mode

If only an empty string is written to it, an error will be thrown as there is nothing to execute.

If you call `window.close()` inside the script, the browser will exit.

### run#stop()

Stop the underlying webserver.

## Headless testing

In environments without a screen, you can use `Xvfb` to simulate one.

### GitHub Actions

This is a full example to run `npm test`. Refer to the last 2 lines in the YAML config:

```yml
on:
  - pull_request
  - push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - run: npm install
    - run: sudo apt-get install xvfb
    - run: xvfb-run --auto-servernum npm test
```

### Travis

Add this to your travis.yml:

```yml
addons:
  apt:
    packages:
      - xvfb
install:
  - export DISPLAY=':99.0'
  - Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
  - npm install
```

[Full example](https://github.com/rhysd/Shiba/blob/055a11a0a2b4f727577fe61371a88d8db9277de5/.travis.yml).

### Any gnu/linux box

```bash
$ sudo apt-get install xvfb # or equivalent
$ export DISPLAY=':99.0'
$ Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
$ browser-run ...
```

### Docker

There is also an example [Docker image](https://hub.docker.com/r/kipparker/docker-tape-run). [Source](https://github.com/fraserxu/docker-tape-run)

## Installation

With [npm](http://npmjs.org) do

```bash
$ npm install browser-run    # for library
$ npm install -g browser-run # for cli
```

## Sponsors

This module is proudly supported by my [Sponsors](https://github.com/juliangruber/sponsors)!

Do you want to support modules like this to improve their quality, stability and weigh in on new features? Then please consider donating to my [Patreon](https://www.patreon.com/juliangruber). Not sure how much of my modules you're using? Try [feross/thanks](https://github.com/feross/thanks)!

## License

(MIT)
