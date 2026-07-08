import { supabaseAdmin } from "../supabaseAdmin";
import { wpGraphqlMutate } from "../wpClient";

const PAGE_KEYS = [
  "header", "footer", "home", "dispatchers", "faq", "guarantees", "trust", "services", "about",
] as const;

// See the note in migratePages.ts — options-page mutation shape is plugin-version
// dependent. This targets WPGraphQL-ACF's usual `update<OptionsPageName>Options` pattern.
function updateOptionsMutation(pageKey: string) {
  const pascal = pageKey[0].toUpperCase() + pageKey.slice(1);
  return `
    mutation UpdateSiteContent${pascal}($items: [AcfOptionsSiteContent${pascal}ItemsInput]) {
      updateAcfOptionsSiteContent${pascal}(input: { items: $items }) {
        clientMutationId
      }
    }
  `;
}

export async function migrateSiteContent(dryRun: boolean) {
  for (const pageKey of PAGE_KEYS) {
    const { data: rows, error } = await supabaseAdmin
      .from("site_content")
      .select("block_key, label, kind, content")
      .eq("page_key", pageKey)
      .eq("enabled", true)
      .order("sort_order");
    if (error) throw error;

    console.log(`[site_content:${pageKey}] found ${rows?.length ?? 0} rows`);

    if (dryRun) continue;
    if (!rows || rows.length === 0) continue;

    const items = rows.map((r) => ({
      block_key: r.block_key,
      label: r.label,
      kind: r.kind === "style" || r.kind === "image" ? "text" : r.kind,
      content: r.content,
    }));

    try {
      await wpGraphqlMutate(updateOptionsMutation(pageKey), { items });
      console.log(`[site_content:${pageKey}] migrated ${items.length} blocks`);
    } catch (err) {
      console.error(`[site_content:${pageKey}] FAILED:`, err);
    }
  }
}
