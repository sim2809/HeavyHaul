# Local WordPress (standard site — WordPress renders everything)

This spins up a local WordPress + MySQL instance running a real, custom PHP theme
(`wp-content/themes/heavy-haul-hub`) that renders the entire public site. wp-admin is the
real content-editing surface — pages, blog posts, service categories/subcategories, theme
settings, SEO, and menus are all managed there. Any WordPress plugin can be installed on top.

The React/Vite app in the repo root no longer renders the public marketing site; it's kept
only for the small Supabase-backed internal `/admin` panel (leads/CRM/redirects/users), which
is unrelated to this WordPress instance.

## Prerequisites

- Docker Desktop installed and running.

## First-time setup

```bash
cd docker/wordpress
cp .env.example .env        # edit WP_ADMIN_PASSWORD before going further
docker compose up -d
```

That's it — a one-shot `bootstrap` container runs automatically, waits for WordPress
and the database to be ready, then installs WordPress core, activates the theme, sets
permalinks, and installs plugins. Watch it with `docker compose logs -f bootstrap`.
It's idempotent, so re-running `docker compose up -d` later is harmless.

Then visit:
- Site: http://localhost:8090
- wp-admin: http://localhost:8090/wp-admin (user/password from `.env`)

## Required plugins

| Plugin | Cost | How it gets installed |
|---|---|---|
| Yoast SEO | Free | Automatic — `bootstrap.sh` installs from wordpress.org |
| ACF fields (Flexible Content, Repeater, Options Page) | Free | Automatic — `bootstrap.sh` installs **Secure Custom Fields** (SCF) from wordpress.org by default. SCF is WordPress.org's fork of ACF and includes these field types (previously ACF-PRO-only) for free, with the same `acf_add_local_field_group()`/`get_field()` API `heavy-haul-acf.php` and the theme templates use. |

If you'd rather use the official **ACF PRO** plugin instead (paid, ~$49+/yr, from
advancedcustomfields.com), drop its zip (named like `advanced-custom-fields-pro-X.X.X.zip`)
into `docker/wordpress/plugins-manual/` before running bootstrap — `bootstrap.sh` installs
that instead of SCF when the zip is present.

Either way, the ACF field schema in `wp-content/mu-plugins/heavy-haul-acf.php` won't
actually register any fields until one of these two plugins is active, and the theme's
templates depend on those fields.

Any other plugin (forms, security, caching, redirects, etc.) can simply be installed from
wp-admin's Plugins screen like any standard WordPress site — nothing about this custom theme
restricts that.

## Useful commands

```bash
# from the repo root, via the package.json scripts:
npm run wp:up          # docker compose up -d
npm run wp:bootstrap    # run bootstrap.sh
npm run wp:down         # docker compose down (keeps volumes/data)

# reset everything (deletes the database and uploads):
docker compose -f docker/wordpress/docker-compose.yml down -v
```

## Notes

- `wp-content/themes/heavy-haul-hub` and `wp-content/mu-plugins` are bind-mounted (git-tracked).
  Everything else (WordPress core, uploads, installed plugins) lives in the `wp_data` named volume —
  not committed to git, survives `docker compose down` but not `down -v`.
- This is local development only. Production hosting (a real PHP+MySQL host) is a separate decision
  to make later — this setup does not address it.
