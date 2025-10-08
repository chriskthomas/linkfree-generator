#!/bin/sh
set -e

# Force php to the background so nginx can be in foreground
php-fpm8.4 -D

# Force nginx into the foreground
nginx -g 'daemon off;'