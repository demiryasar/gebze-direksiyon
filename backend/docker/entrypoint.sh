#!/bin/sh
set -e

echo "==> Starting Gebze Direksiyon Backend container..."

# Check or generate APP_KEY
if [ -z "$APP_KEY" ]; then
    echo "==> APP_KEY not provided, generating..."
    php artisan key:generate --force
fi

# SQLite Setup if needed
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
    echo "==> Configuring SQLite database..."
    mkdir -p /var/www/html/database
    if [ ! -f /var/www/html/database/database.sqlite ]; then
        touch /var/www/html/database/database.sqlite
    fi
    chown -R www-data:www-data /var/www/html/database
    chmod -R 775 /var/www/html/database
fi

# Ensure storage subdirectories exist
mkdir -p /var/www/html/storage/framework/cache/data
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/storage/app/public

# Storage symlink
php artisan storage:link --force || true

# Set storage and cache permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Run database migrations
if [ "$RUN_MIGRATIONS" = "true" ] || [ "$RUN_MIGRATIONS" = "1" ]; then
    echo "==> Running database migrations..."
    php artisan migrate --force
fi

# Optimize Laravel cache in production
if [ "$APP_ENV" = "production" ]; then
    echo "==> Optimizing configuration and routes cache..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

echo "==> Backend ready! Starting services..."
exec "$@"
