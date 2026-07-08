import { supabaseAdmin } from "../supabaseAdmin";
import { wpGraphqlMutate } from "../wpClient";
import { rewriteMediaUrls } from "./migrateMedia";

// NOTE: WPGraphQL-ACF's exact mutation input shape for writing Flexible Content fields
// is plugin-version dependent. This uses the common `acf` update pattern (updating the
// ACF field group via its GraphQL field name as a mutation input) — verify against the
// live schema (GraphiQL IDE in wp-admin, once WPGraphQL for ACF is installed) and adjust
// the `pageSections` input shape below if it differs. Everything else in this script
// (page creation, ordering, media rewriting) does not depend on that detail.

const CREATE_PAGE = `
  mutation CreatePage($title: String!, $slug: String!, $content: String) {
    createPage(input: { title: $title, slug: $slug, status: PUBLISH, content: $content }) {
      page { id }
    }
  }
`;

const UPDATE_PAGE_SECTIONS = `
  mutation UpdatePageSections($id: ID!, $sections: [PageSectionsSectionsInput]) {
    updatePage(input: { id: $id, pageSections: { sections: $sections } }) {
      page { id }
    }
  }
`;

export async function migratePages(dryRun: boolean, mediaMap: Record<string, string>) {
  const { data: pages, error } = await supabaseAdmin
    .from("pages")
    .select("id, slug, title, description, enabled")
    .eq("enabled", true);
  if (error) throw error;

  console.log(`[pages] found ${pages?.length ?? 0} pages`);

  for (const page of pages ?? []) {
    const { data: sections } = await supabaseAdmin
      .from("page_sections")
      .select("type, name, sort_order, enabled, data")
      .eq("page_id", page.id)
      .order("sort_order");

    if (dryRun) {
      console.log(`[pages] (dry-run) would create page "${page.slug}" with ${sections?.length ?? 0} sections`);
      continue;
    }

    try {
      const created = await wpGraphqlMutate<{ createPage: { page: { id: string } } }>(CREATE_PAGE, {
        title: page.title,
        slug: page.slug,
        content: "",
      });
      const pageId = created.createPage.page.id;

      const sectionsInput = (sections ?? []).map((s) => {
        const rawType = s.type === "testimonials" ? "reviews" : s.type === "text_block" ? "rich_text" : s.type;
        const data = { ...(s.data as Record<string, unknown>) };
        if (typeof data.html === "string") data.html = rewriteMediaUrls(data.html, mediaMap);
        return {
          fieldGroupName: rawType,
          enabled: s.enabled,
          ...data,
        };
      });

      await wpGraphqlMutate(UPDATE_PAGE_SECTIONS, { id: pageId, sections: sectionsInput });
      console.log(`[pages] migrated "${page.slug}" (${sectionsInput.length} sections)`);
    } catch (err) {
      console.error(`[pages] FAILED for "${page.slug}":`, err);
      console.error(
        `[pages]   If this is a schema mismatch, open the GraphiQL IDE in wp-admin and confirm ` +
          `the mutation input type name for pageSections — see the comment at the top of this file.`
      );
    }
  }
}
