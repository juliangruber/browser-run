
test:
	@npm run build
	@node_modules/.bin/tap test/*.js

.PHONY: test

