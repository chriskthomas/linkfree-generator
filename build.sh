#!/bin/sh

set -e

# Clean environment
rm -rf dist

# Build
mkdir dist && cd dist

# Minify static assets
minify -o default.css ../src/default.css
minify -o index.js ../src/index.js

# Copy other assets
cp ../src/api.php ../src/template.php ./

# Compile PHP and minify
php ../src/index.php | minify --type html -o index.html
