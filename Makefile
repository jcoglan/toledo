SHELL := /bin/bash
PATH  := node_modules/.bin:$(PATH)

.PHONY: all

all: src/compiler/grammar.js

src/compiler/%.js: src/compiler/%.peg
	canopy $< --lang javascript
