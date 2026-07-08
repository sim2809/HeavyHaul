#!/bin/bash
# Idempotent WP bootstrap. Run via:
#   docker compose -f docker/wordpress/docker-compose.yml run --rm wpcli bash /scripts/bootstrap.sh
set -euo pipefail

cd /var/www/html

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

echo "==> Checking for manually-provided paid plugin zips in wp-content/plugins-manual/..."
MANUAL_DIR="/var/www/html/wp-content/plugins-manual"
install_if_present () {
  local zip_glob="$1"
  local plugin_label="$2"
  local found
  found=$(ls ${MANUAL_DIR}/${zip_glob} 2>/dev/null | head -n1 || true)
  if [ -n "$found" ]; then
    echo "    Installing ${plugin_label} from ${found}"
    wp plugin install "$found" --activate --allow-root || echo "    WARNING: failed to install ${plugin_label}"
  else
    echo "    SKIPPED: ${plugin_label} not found (expected a zip matching '${zip_glob}' in docker/wordpress/plugins-manual/). Bootstrap will continue without it."
  fi
}

install_if_present "advanced-custom-fields-pro*.zip" "ACF PRO"

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
