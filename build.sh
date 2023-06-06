#!/bin/sh

# Clean environment
rm -rf dist

# Build
mkdir dist
php index.php >dist/index.html

# Copy other assets
cp style.css dist/style.css
cp index.js dist/index.js
