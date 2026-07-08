# WordPress Migration — Status & Next Steps

Start a new session by pointing Claude at this file: "read WORDPRESS_MIGRATION.md and continue."

## Context

Heavy Haul Hub was a React + Vite + shadcn/ui app with a custom CMS admin built on Supabase
(page/section builder, blog, media, SEO, redirects, nav, users). The user wanted real
**WordPress admin (`wp-admin`)** as the content-editing surface instead. Decision: **headless
WordPress** — WordPress becomes the content backend (pages, sections, blog, media, menus,
SEO, theme settings), the existing React/Tailwind/shadcn frontend keeps rendering everything
exactly as before, fed from WordPress via WPGraphQL instead of Supabase. No framework change,
no PHP theme rebuild of the actual site.

Full original plan (more detail than this file): `C:\Users\vanan\.claude\plans\crystalline-strolling-catmull.md`

## Scope boundaries (decided, not re-litigated)

- **Stays on Supabase**: `hubspot_settings`, `form_submissions`, the `submit-lead` edge
  function (CRM/lead pipeline), and `redirects`. The trimmed custom `/admin` panel
  (Login, Dashboard, FormSubmissions, HubSpotSettings, Redirects, Users) still runs on
  Supabase auth — this was intentional, not an oversight.
- **ACF PRO is required** (Flexible Content, Repeater, Options Page field types are
  PRO-only) — a paid plugin (~$49+/yr) the user must buy and download themselves; nothing
  in this repo can do that step.
- **Local dev only.** Production WordPress hosting (WP Engine/Kinsta/Cloudways/self-managed)
  was explicitly out of scope — a separate decision for later.
- The old inline click-to-edit-on-the-live-page UX (`<EC>`, edit mode) is retired —
  editing now happens in wp-admin. `<EC>` was kept as a component (same props) but made
  read-only/presentational so ~90 call sites in `About.tsx` needed zero changes.

## What's done

- **`docker/wordpress/`** — Docker Compose (WordPress + MySQL + WP-CLI), a stub headless
  theme (`wp-content/themes/heavy-haul-headless`, registers the 3 real nav menu locations:
  `header_primary`, `footer_company`, `footer_resources`), `scripts/bootstrap.sh` (installs
  WPGraphQL + Yoast free automatically, installs ACF PRO / WPGraphQL-for-ACF /
  WPGraphQL-Yoast-SEO only if their zips are dropped in `plugins-manual/`), `.env.example`,
  `README.md`. `package.json` has `wp:up` / `wp:down` / `wp:bootstrap` scripts.
- **`docker/wordpress/wp-content/mu-plugins/heavy-haul-acf.php`** — the whole content
  schema as code: Flexible Content field (`page_sections`) on the `page` post type with
  all 12 section layouts (hero/cta/faq/reviews/services/stats/gallery/rich_text/
  image_block/video_block/features/custom_html) + a shared style + enabled sub-field set;
  9 "Site Content" options pages (header/footer/home/dispatchers/faq/guarantees/trust/
  services/about), modeled as a generic `{block_key, content, style}` repeater rather than
  ~150 individually-named fields (see the file's top comment for why); a "Theme Settings"
  options page for company info/social/hours/SEO defaults/analytics IDs.
- **`src/integrations/wordpress/`** — `client.ts` (fetch-based GraphQL client),
  `types.ts`, `queries.ts` (query documents — **see caveat below**), `mappers.ts`
  (WPGraphQL JSON → the exact shapes the old Supabase-fed components expected),
  `hooks.ts` (React Query hooks: `usePageBySlug`, `useOptionsPage`, `useThemeSettings`,
  `usePosts`, `usePostBySlug`, `useNavMenu` — this is the app's first real use of
  React Query, which was installed but unused before).
- **Frontend rewired**: `CmsSections.tsx` (kept `SectionRenderer` almost verbatim, added
  the 4 previously-missing section cases: reviews/services/gallery/image_block/
  video_block, threaded per-block `style` through), `CmsCatchAll.tsx`, `useSiteContent.tsx`
  (same `get(page, block, fallback)` signature, `<EC>` now read-only), `useSiteSettings.tsx`,
  `SeoHead.tsx` (now purely presentational — SEO fetch moved up into `CmsCatchAll`),
  `CmsMenu.tsx`, `Blog.tsx`, `BlogPost.tsx`, `App.tsx` (removed edit-mode wiring + trimmed
  admin routes).
- **Tests**: `src/test/wordpress-mappers.test.ts` — unit tests for every mapper function.
- **Admin panel trimmed**: page/blog/media/SEO/nav/content editors removed from
  `src/pages/admin` (superseded by wp-admin) — **moved, not deleted**, into
  `_migration-archive/` (this repo has no git history, so deletion wasn't reversible;
  see `_migration-archive/README.md`). Kept: Login, Dashboard (now links to `/wp-admin`),
  FormSubmissions, HubSpotSettings, Redirects, Users, AdminLayout (nav trimmed).
- **`scripts/migrate-to-wordpress/`** — one-time script to push existing Supabase content
  (pages/sections, site_content, blog posts, media, nav menus, global/analytics settings)
  into the new WordPress instance. Supports `--dry-run`. Added `tsx` to devDependencies
  to run it (`npm run migrate:wp`).

## Important caveat — GraphQL schema names are best-effort, unverified

This environment had **no Docker, no Node/npm, and no git** — so none of this was ever
actually run. The GraphQL query/mutation field and type names in
`src/integrations/wordpress/queries.ts` and `scripts/migrate-to-wordpress/steps/*.ts`
follow WPGraphQL-ACF's naming conventions, but exact names are plugin-version dependent
and were never checked against a live schema.

Since the last update to this file, I researched (web search) the actual WPGraphQL-ACF
docs and fixed one confirmed bug: Flexible Content union type names follow
`{PostType}_{FieldGroupGraphqlName}_{FlexFieldGraphqlName}_{LayoutName}` with each segment
PascalCased via `ucfirst()` — which preserves internal capitals. The query file originally
had `Page_Pagesections_Sections_Hero` (wrong — lowercased the internal S); it's now
`Page_PageSections_Sections_Hero` (right). Source:
https://github.com/wp-graphql/wp-graphql-acf/blob/develop/docs/fields/flexible-content.md

**Still genuinely uncertain** (WPGraphQL for ACF's own docs flag "v2.0+ contains breaking
changes" for this — https://acf.wpgraphql.com/upgrade-guide/):
- Whether Options Page GraphQL exposure needs `show_in_graphql`/`graphql_field_name` on
  the `acf_add_options_page()` call, the field group, or both — the mu-plugin now sets it
  on both defensively, but only one may actually be needed/correct for whatever version
  gets installed.
- The exact **mutation** input type/field names for writing Flexible Content, Options
  Pages, and Yoast SEO fields (used only by `scripts/migrate-to-wordpress/`) — I found
  confirmed docs for *reading* the schema but not for *writing* to it via GraphQL
  mutations, so those remain unverified guesses.

**First real next step once WordPress is running**: open the GraphiQL IDE in wp-admin
(comes with WPGraphQL) and introspect the schema, then fix any mismatched names — comments
at the top of `queries.ts`, the mu-plugin PHP file, and each `migrate-to-wordpress/steps/*.ts`
file flag exactly which lines to check first.

## To-do (in order)

1. [ ] `npm install` (or `bun install`) — pulls in `tsx`, added to devDependencies but never installed.
2. [ ] Install Docker Desktop if not already present.
3. [ ] Buy ACF PRO (advancedcustomfields.com) and download the WPGraphQL-for-ACF +
       WPGraphQL-Yoast-SEO zips from GitHub; drop all three into `docker/wordpress/plugins-manual/`.
4. [ ] `npm run wp:up` then `npm run wp:bootstrap` — boots WordPress, installs plugins.
5. [ ] Add `VITE_WPGRAPHQL_ENDPOINT=http://localhost:8090/graphql` to the repo-root `.env`.
6. [ ] Open `http://localhost:8090/graphql` (GraphiQL) and verify/fix the schema names
       per the caveat above (`queries.ts` first, then the migration script).
7. [ ] `npm run dev`, browser-check `/`, a CMS page, `/blog` + a post, header/footer nav —
       compare against how the site looked before this migration (Supabase-backed).
8. [ ] `npm run lint`, `npx tsc --noEmit`, `npm test` — none of these have been run yet.
9. [ ] Run `npm run migrate:wp -- --dry-run` to sanity-check row counts, then the real run,
       to pull existing content into WordPress instead of starting from a blank site.
10. [ ] Once confident the migration works and nothing in `_migration-archive/` is needed,
        delete that folder for good.
11. [ ] (Later, separate decision) pick production WordPress hosting.

## Task tracker

All 7 implementation tasks from the original session were completed (Docker setup, ACF
schema, GraphQL client layer, frontend rewiring, admin trim-down, migration script,
static verification). The task tracker itself doesn't persist completed items across
sessions — this file is the durable record.
