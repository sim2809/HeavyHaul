import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { supabaseAdmin } from "../supabaseAdmin";
import { wpRestUploadMedia } from "../wpClient";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(__dirname, "..", "output", "media-map.json");

export async function migrateMedia(dryRun: boolean): Promise<Record<string, string>> {
  const { data: assets, error } = await supabaseAdmin
    .from("media_assets")
    .select("public_url, file_name, mime_type, alt_text");
  if (error) throw error;

  console.log(`[media] found ${assets?.length ?? 0} assets in Supabase`);

  const mediaMap: Record<string, string> = {};

  for (const asset of assets ?? []) {
    if (dryRun) {
      console.log(`[media] (dry-run) would upload ${asset.file_name}`);
      continue;
    }
    try {
      const res = await fetch(asset.public_url);
      if (!res.ok) {
        console.warn(`[media] skip: failed to download ${asset.public_url} (${res.status})`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      const uploaded = await wpRestUploadMedia(
        asset.file_name,
        buffer,
        asset.mime_type || "application/octet-stream"
      );
      mediaMap[asset.public_url] = uploaded.source_url;
      console.log(`[media] uploaded ${asset.file_name} -> ${uploaded.source_url}`);
    } catch (err) {
      console.error(`[media] FAILED for ${asset.file_name}:`, err);
    }
  }

  if (!dryRun) {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mediaMap, null, 2));
    console.log(`[media] wrote URL map to ${OUTPUT_PATH}`);
  }

  return mediaMap;
}

/** Rewrites any embedded old Supabase Storage URLs (e.g. inside rich_text/custom_html HTML) to their new WP equivalents. */
export function rewriteMediaUrls(html: string | null | undefined, mediaMap: Record<string, string>): string {
  if (!html) return "";
  let result = html;
  for (const [oldUrl, newUrl] of Object.entries(mediaMap)) {
    result = result.split(oldUrl).join(newUrl);
  }
  return result;
}
