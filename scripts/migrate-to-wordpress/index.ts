// One-time migration of existing Supabase CMS content into the new headless WordPress
// instance. Run order matters: media first (later steps rewrite embedded image URLs
// using its output), then everything else.
//
// Usage:
//   npm run migrate:wp              # real run
//   npm run migrate:wp -- --dry-run # log intended actions without writing anything
import { migrateMedia } from "./steps/migrateMedia";
import { migratePages } from "./steps/migratePages";
import { migrateSiteContent } from "./steps/migrateSiteContent";
import { migrateBlogPosts } from "./steps/migrateBlogPosts";
import { migrateNav } from "./steps/migrateNav";
import { migrateGlobalSettings } from "./steps/migrateGlobalSettings";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (dryRun) console.log("=== DRY RUN — no data will be written ===\n");

  console.log("Step 1/6: media");
  const mediaMap = await migrateMedia(dryRun);

  console.log("\nStep 2/6: pages + page_sections");
  await migratePages(dryRun, mediaMap);

  console.log("\nStep 3/6: site_content (header/footer/home/dispatchers/faq/guarantees/trust/services/about)");
  await migrateSiteContent(dryRun);

  console.log("\nStep 4/6: blog_posts");
  await migrateBlogPosts(dryRun, mediaMap);

  console.log("\nStep 5/6: nav_menus + nav_items");
  await migrateNav(dryRun);

  console.log("\nStep 6/6: global_settings + analytics_settings");
  await migrateGlobalSettings(dryRun);

  console.log("\nDone.");
  if (!dryRun) {
    console.log(
      "Spot-check in wp-admin: Pages, Posts, Site Content options pages, Theme Settings, and Appearance → Menus."
    );
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
