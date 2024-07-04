#!/bin/bash

# Wait for the MySQL server to be ready
until mysqladmin ping -h"localhost" --silent; do
    echo "Waiting for MySQL server to be up..."
    sleep 2
done

# Grant necessary permissions to the user
mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USER'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
EOSQL

# Directory to search for SQL files
SEARCH_DIR="/home"

# Find and execute all SQL files
find "$SEARCH_DIR" -type f -name "*.sql" -print0 | while IFS= read -r -d '' sql_file; do
    echo "Executing $sql_file"
    mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" < "$sql_file"
done

