#!/bin/sh

# Clean environment
rm -rf dist

# Build
mkdir dist
php src/index.php >dist/index.html

# Copy other assets
cp src/default.css dist/default.css
cp src/index.js dist/index.js
cp src/api.php dist/api.php
