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

1. The local WordPress stack running and bootstrapped (`docker compose up -d` in
   `docker/wordpress`, or `npm run wp:up`) — this also auto-installs WPGraphQL,
   WPGraphQL for ACF, and either ACF PRO or the free Secure Custom Fields plugin
   (see `docker/wordpress/README.md`). Without these, `pageSections`/options-page
   mutations will fail.
2. Copy the env template and fill in the one secret it needs:
   ```bash
   cp scripts/migrate-to-wordpress/.env.local.example scripts/migrate-to-wordpress/.env.local
   ```
   Then edit `.env.local` (gitignored, never committed) and paste in
   `SUPABASE_SERVICE_ROLE_KEY` from the Supabase dashboard → Project Settings → API
   — **not** the anon key already in the app's root `.env`. Everything else in the
   file already has a working default, including `WP_APPLICATION_PASSWORD`, which
   is read automatically from `docker/wordpress/scripts/.app-password` if you leave
   it blank. The script loads `.env.local` itself — no need to `export`/`source` it.

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
