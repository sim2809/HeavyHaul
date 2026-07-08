import { supabaseAdmin } from "../supabaseAdmin";
import { wpGraphqlMutate } from "../wpClient";
import { rewriteMediaUrls } from "./migrateMedia";

const CREATE_POST = `
  mutation CreatePost($title: String!, $slug: String!, $content: String, $excerpt: String, $date: String, $status: PostStatusEnum!) {
    createPost(input: { title: $title, slug: $slug, content: $content, excerpt: $excerpt, date: $date, status: $status }) {
      post { id }
    }
  }
`;

function toWpStatus(status: string): "PUBLISH" | "DRAFT" | "FUTURE" {
  if (status === "published") return "PUBLISH";
  if (status === "scheduled") return "FUTURE";
  return "DRAFT";
}

export async function migrateBlogPosts(dryRun: boolean, mediaMap: Record<string, string>) {
  const { data: posts, error } = await supabaseAdmin
    .from("blog_posts")
    .select("title, slug, excerpt, content, featured_image, author_name, status, published_at, seo_title, seo_description, og_image, no_index");
  if (error) throw error;

  console.log(`[blog] found ${posts?.length ?? 0} posts`);

  for (const post of posts ?? []) {
    if (dryRun) {
      console.log(`[blog] (dry-run) would create post "${post.slug}"`);
      continue;
    }
    try {
      const content = rewriteMediaUrls(post.content, mediaMap);
      const created = await wpGraphqlMutate<{ createPost: { post: { id: string } } }>(CREATE_POST, {
        title: post.title,
        slug: post.slug,
        content,
        excerpt: post.excerpt ?? undefined,
        date: post.published_at ?? undefined,
        status: toWpStatus(post.status),
      });
      console.log(`[blog] migrated "${post.slug}" -> ${created.createPost.post.id}`);
      console.log(
        `[blog]   NOTE: featured image, author, and Yoast SEO fields (title/description/OG image/noindex) ` +
          `need a follow-up call once Yoast's WPGraphQL mutation input is confirmed live — see migratePages.ts's note ` +
          `on schema verification. Set them manually in wp-admin in the meantime if this script hasn't been extended yet.`
      );
    } catch (err) {
      console.error(`[blog] FAILED for "${post.slug}":`, err);
    }
  }
}
