# Use the official MySQL image as a base
FROM mysql:lts

# Copy the init-db script into the image
COPY post-init-run-extra-sql.sh /docker-entrypoint-initdb.d/

# Make the script executable
RUN chmod +x /docker-entrypoint-initdb.d/post-init-run-extra-sql.sh
# This script will now be called by /usr/local/bin/docker-entrypoint.sh when the container starts

# Expose the default MySQL port
EXPOSE 3306

# Set default command to run the MySQL server with the desired character set and collation
CMD ["mysqld", "--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci"]