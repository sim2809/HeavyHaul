// One-time migration of existing Supabase CMS content into the new headless WordPress
// instance. Run order matters: media first (later steps rewrite embedded image URLs
// using its output), then everything else.
//
// Usage:
//   npm run migrate:wp              # real run
//   npm run migrate:wp -- --dry-run # log intended actions without writing anything
//
// Reads scripts/migrate-to-wordpress/.env.local if present (see .env.local.example),
// so you don't have to export these in your shell by hand. Step modules are imported
// dynamically, after the env file loads, since they read process.env at module load time.
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal(): void {
  const envPath = join(__dirname, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const { migrateMedia } = await import("./steps/migrateMedia");
  const { migratePages } = await import("./steps/migratePages");
  const { migrateSiteContent } = await import("./steps/migrateSiteContent");
  const { migrateBlogPosts } = await import("./steps/migrateBlogPosts");
  const { migrateNav } = await import("./steps/migrateNav");
  const { migrateGlobalSettings } = await import("./steps/migrateGlobalSettings");

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
