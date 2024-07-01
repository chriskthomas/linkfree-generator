#!/bin/sh

set -e

# Clean environment
rm -rf dist

# Build
mkdir dist

# Minify static assets
minify -o dist/default.css src/default.css

# Copy other assets
cp src/api.php src/template.php dist/

# Compile PHP and minify
cd src/ && php index.php | minify --type html -o ../dist/index.html
