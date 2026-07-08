import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { supabaseAdmin } from "../supabaseAdmin";

const execFileAsync = promisify(execFile);

// WPGraphQL's menu mutations are thin/inconsistent across versions, and WP-CLI's
// `wp menu` commands are stable and well-documented — so this step shells out to the
// wpcli Docker service instead of using GraphQL, unlike the other steps.
async function wpCli(args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("docker", [
    "compose",
    "-f",
    "docker/wordpress/docker-compose.yml",
    "run",
    "--rm",
    "wpcli",
    "wp",
    ...args,
    "--allow-root",
  ]);
  return stdout.trim();
}

export async function migrateNav(dryRun: boolean) {
  const { data: menus, error } = await supabaseAdmin.from("nav_menus").select("id, location, name");
  if (error) throw error;

  console.log(`[nav] found ${menus?.length ?? 0} menus`);

  for (const menu of menus ?? []) {
    const { data: items } = await supabaseAdmin
      .from("nav_items")
      .select("label, url, sort_order, enabled")
      .eq("menu_id", menu.id)
      .eq("enabled", true)
      .is("parent_id", null)
      .order("sort_order");

    if (dryRun) {
      console.log(`[nav] (dry-run) would create menu "${menu.location}" with ${items?.length ?? 0} items`);
      continue;
    }

    try {
      await wpCli(["menu", "create", menu.name || menu.location]);
      await wpCli(["menu", "location", "assign", menu.name || menu.location, menu.location]);
      for (const item of items ?? []) {
        await wpCli(["menu", "item", "add-custom", menu.name || menu.location, item.label, item.url]);
      }
      console.log(`[nav] migrated menu "${menu.location}" (${items?.length ?? 0} items)`);
    } catch (err) {
      console.error(`[nav] FAILED for "${menu.location}":`, err);
      console.error(`[nav]   Requires the docker/wordpress stack to be running (npm run wp:up) and Docker CLI on PATH.`);
    }
  }
}
