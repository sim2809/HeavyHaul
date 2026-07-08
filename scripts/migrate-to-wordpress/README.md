# Migrate existing content: Supabase → WordPress

One-time script to push existing content out of Supabase and into the new headless
WordPress instance, so the WordPress migration doesn't mean starting from a blank site.

## Mapping

| Supabase table | WordPress construct |
|---|---|
| `pages` + `page_sections` | native `page` post type + ACF Flexible Content `page_sections` field |
| `site_content` (+ `style_<key>` sibling rows) | ACF "Site Content" Options Pages, one per page_key |
| `blog_posts` + `blog_categories`/`blog_tags` | native `post` post type + native WP categories/tags |
| `media_assets` (Supabase Storage) | native WP Media Library (files re-uploaded, not linked) |
| `nav_menus` / `nav_items` | native WP Menus |
| `seo_overrides` + blog post SEO columns | Yoast SEO fields on the corresponding page/post |
| `global_settings` + `analytics_settings` | ACF "Theme Settings" Options Page |
| `hubspot_settings`, `form_submissions`, `redirects`, `user_roles`/`profiles` | **not migrated** — these stay in Supabase |

## Prerequisites

1. The local WordPress stack running and bootstrapped (`npm run wp:up && npm run wp:bootstrap`),
   with ACF PRO + WPGraphQL for ACF actually installed (see `docker/wordpress/README.md`) —
   without them, `pageSections`/options-page mutations will fail.
2. Environment variables (export in your shell, or create `scripts/migrate-to-wordpress/.env.local`
   and `source`/load it yourself — this script does not read the app's root `.env` automatically
   for the Supabase service-role key, since that key must never live next to the anon key):
   ```
   VITE_SUPABASE_URL=...                     # same value as the app's .env
   SUPABASE_SERVICE_ROLE_KEY=...              # Supabase dashboard → Project Settings → API — NOT the anon key
   WP_ADMIN_USER=admin
   WP_APPLICATION_PASSWORD=...                # from docker/wordpress/scripts/.app-password after bootstrap
   WPGRAPHQL_ENDPOINT=http://localhost:8090/graphql
   WP_REST_ENDPOINT=http://localhost:8090/wp-json
   ```

## Run

```bash
npm run migrate:wp -- --dry-run   # logs intended actions, writes nothing — check row counts first
npm run migrate:wp                # real run
```

Run order (media first — later steps rewrite embedded image URLs using its output):
media → pages → site_content → blog_posts → nav → global_settings.

## Known gaps (flagged in the step files, not silently skipped)

- **GraphQL mutation shapes for ACF Flexible Content / Options Pages / Yoast SEO writes
  are best-effort** — WPGraphQL-ACF's write-mutation naming is plugin-version dependent
  and couldn't be verified against a live schema while writing this script (no WordPress
  instance was available in the environment this was built in). If a step fails with a
  GraphQL schema error, open the GraphiQL IDE in wp-admin, find the actual mutation/input
  type names, and fix the one query string at the top of the relevant `steps/*.ts` file —
  the rest of each step (data fetching, ordering, media URL rewriting) does not depend on
  those exact names.
- **Blog post featured image, author, and Yoast SEO fields are not yet set** by
  `migrateBlogPosts.ts` (only title/slug/content/excerpt/date/status) — set these manually
  in wp-admin for now, or extend the step once the Yoast mutation shape is confirmed.
- **`logo_url` and `default_og_image`** in Theme Settings are ACF image fields; the old
  Supabase columns only stored plain URLs, so upload these once manually in wp-admin
  rather than trying to auto-migrate a bare URL into an image field.
- **Nav menu migration shells out to WP-CLI** (via `docker compose run wpcli`) instead of
  GraphQL, since WPGraphQL's menu mutations are thin — requires the Docker stack to be up
  and the `docker` CLI available on PATH when this step runs.
