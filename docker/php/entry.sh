#!/bin/sh
set -e

# run php script to fix host in pdo
php /usr/local/bin/pdo-host-fix.php

apache2-foreground