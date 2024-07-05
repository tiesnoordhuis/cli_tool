# Get latest php with apache
FROM php:8.3-apache

# Install necessary extensions
RUN docker-php-ext-install pdo pdo_mysql

# Set working directory
WORKDIR /var/www/html

# Copy and set permissions for the startup script
COPY entry.sh /usr/local/bin/entry.sh
RUN chmod +x /usr/local/bin/entry.sh

# Copy the PDO host fix script
COPY pdo-host-fix.php /usr/local/bin/pdo-host-fix.php

# Copy the dsnWrapper script
COPY dsnWrapper.php /usr/local/bin/dsnWrapper.php

# Copy php.ini
COPY php.ini /usr/local/etc/php/php.ini

# Use the startup script as the entrypoint
ENTRYPOINT ["/usr/local/bin/entry.sh"]