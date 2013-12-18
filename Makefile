all: test jshint jsdoc

jshint:
	./node_modules/jshint/bin/jshint --config .jshintrc ./lib

test:
	./node_modules/.bin/mocha -r should test/test-*.js

jsdoc:
	./node_modules/jsdoc/jsdoc -c .jsdoc3.json -d ./docs -p -r -l ./lib

clean:
	rm -rf ./docs

.PHONY: all test jshint jsdoc clean
