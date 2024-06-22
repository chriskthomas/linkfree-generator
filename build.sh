#!/bin/sh

# Clean environment
rm -rf dist

# Build
mkdir dist
php src/index.php | minify --type html -o dist/index.html
minify -o dist/default.css src/default.css
minify -o dist/index.js src/index.js

# Copy other assets
cp src/api.php dist/api.php
cp src/template.php dist/template.php
