
build:
	@node_modules/.bin/browserify browser/reporter.js -o static/reporter.js

test:
	@make build
	@node_modules/.bin/tap test/*.js

example:
	@make build
	@cat example.js | bin/bin.js

.PHONY: test example build

