
build:
	@node_modules/.bin/browserify browser/reporter.js -o static/reporter.js

test:
	@make build
	@node_modules/.bin/tap test/*.js

example-simple:
	@make build
	@cat example/simple.js | bin/bin.js

example-error:
	@make build
	@cat example/error.js | bin/bin.js

.PHONY: test example build

