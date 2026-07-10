#!/bin/sh
# Idempotent WP bootstrap. Run via:
#   docker compose -f docker/wordpress/docker-compose.yml run --rm --entrypoint sh wpcli /scripts/bootstrap.sh
set -eu

cd /var/www/html

echo "==> Waiting for WordPress core files..."
until [ -f /var/www/html/wp-load.php ]; do
  sleep 2
done

echo "==> Waiting for database..."
until wp db check --path=/var/www/html --allow-root 2>/dev/null; do
  sleep 2
done

if ! wp core is-installed --allow-root 2>/dev/null; then
  echo "==> Installing WordPress core..."
  wp core install \
    --url="${WP_URL:-http://localhost:8090}" \
    --title="Heavy Haul Hub" \
    --admin_user="${WP_ADMIN_USER:-admin}" \
    --admin_password="${WP_ADMIN_PASSWORD:-admin_password}" \
    --admin_email="${WP_ADMIN_EMAIL:-admin@example.com}" \
    --skip-email \
    --allow-root
else
  echo "==> WordPress already installed, skipping core install."
fi

echo "==> Activating theme..."
wp theme activate heavy-haul-hub --allow-root

echo "==> Setting pretty permalinks (required by our custom rewrite rules)..."
wp rewrite structure '/%postname%/' --allow-root
wp rewrite flush --hard --allow-root

echo "==> Installing free plugins from wordpress.org..."
wp plugin install wordpress-seo --activate --allow-root || true

echo "==> Checking for a manually-provided ACF PRO zip in wp-content/plugins-manual/..."
MANUAL_DIR="/var/www/html/wp-content/plugins-manual"
ACF_PRO_ZIP=$(ls ${MANUAL_DIR}/advanced-custom-fields-pro*.zip 2>/dev/null | head -n1 || true)
if [ -n "$ACF_PRO_ZIP" ]; then
  echo "    Installing ACF PRO from ${ACF_PRO_ZIP}"
  wp plugin install "$ACF_PRO_ZIP" --activate --allow-root || echo "    WARNING: failed to install ACF PRO"
else
  echo "    No ACF PRO zip found — installing free Secure Custom Fields (SCF) instead."
  echo "    SCF is WordPress.org's fork of ACF and includes the Flexible Content, Repeater,"
  echo "    and Options Page field types our theme's ACF schema (heavy-haul-acf.php) needs,"
  echo "    at no cost. Same acf_add_local_field_group()/get_field() API as ACF PRO."
  wp plugin install secure-custom-fields --activate --allow-root || echo "    WARNING: failed to install Secure Custom Fields"
fi

echo "==> Ensuring mu-plugins are picked up (no activation needed, WP loads mu-plugins/*.php automatically)..."
wp plugin list --allow-root

echo "==> Creating an Application Password for the migration script (if one doesn't already exist)..."
APP_PW_FILE="/scripts/.app-password"
if [ ! -f "$APP_PW_FILE" ]; then
  wp user application-password create "${WP_ADMIN_USER:-admin}" "migration-script" --porcelain --allow-root > "$APP_PW_FILE"
  echo "    Application password written to docker/wordpress/scripts/.app-password (gitignored). Use it as WP_APPLICATION_PASSWORD for the migration script."
else
  echo "    Application password file already exists, skipping."
fi

echo "==> Bootstrap complete."
echo "    Site:     ${WP_URL:-http://localhost:8090}"
echo "    wp-admin: ${WP_URL:-http://localhost:8090}/wp-admin  (user: ${WP_ADMIN_USER:-admin})"
