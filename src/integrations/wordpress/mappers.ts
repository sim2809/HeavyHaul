import type {
  WpBlockStyleRaw,
  WpMenu,
  WpMenuItem,
  WpOptionsContentBlockRaw,
  WpPage,
  WpPost,
  WpRawSection,
  WpThemeSettingsRaw,
} from "./types";
import type { AnalyticsSettings, SiteSettings } from "@/hooks/useSiteSettings";

// ---- Page sections (replaces `pages` + `page_sections`) --------------------

export type Section = { id: string; type: string; data: any; enabled: boolean };

const LAYOUT_NAME_MAP: Record<string, string> = {
  hero: "hero",
  cta: "cta",
  faq: "faq",
  reviews: "reviews",
  testimonials: "reviews",
  services: "services",
  stats: "stats",
  gallery: "gallery",
  richtext: "rich_text",
  textblock: "rich_text",
  imageblock: "image_block",
  videoblock: "video_block",
  features: "features",
  customhtml: "custom_html",
};

/** WPGraphQL-ACF's `fieldGroupName` casing/prefixing is plugin-version dependent —
 * normalize by taking the last underscore-delimited segment and lowercasing it. */
function normalizeLayoutName(fieldGroupName: string): string {
  const last = fieldGroupName.split("_").pop() || fieldGroupName;
  const key = last.toLowerCase().replace(/[^a-z]/g, "");
  return LAYOUT_NAME_MAP[key] ?? key;
}

export function mapWpBlockStyle(raw: WpBlockStyleRaw | null | undefined): React.CSSProperties {
  if (!raw) return {};
  const style: Record<string, string> = {};
  if (raw.color) style.color = raw.color;
  if (raw.background_color) style.backgroundColor = raw.background_color;
  if (raw.font_size) style.fontSize = raw.font_size;
  if (raw.font_weight) style.fontWeight = raw.font_weight;
  if (raw.font_family) style.fontFamily = raw.font_family;
  if (raw.text_align) style.textAlign = raw.text_align;
  if (raw.letter_spacing) style.letterSpacing = raw.letter_spacing;
  if (raw.line_height) style.lineHeight = raw.line_height;
  return style as React.CSSProperties;
}

function imgUrl(img: unknown): string | undefined {
  if (img && typeof img === "object" && "sourceUrl" in (img as any)) {
    return (img as any).sourceUrl as string;
  }
  return undefined;
}

function mapSectionData(type: string, raw: WpRawSection): any {
  switch (type) {
    case "hero":
      return {
        eyebrow: raw.eyebrow,
        headline: raw.headline,
        subheadline: raw.subheadline,
        cta_label: raw.cta_label,
        cta_href: raw.cta_href,
        image: imgUrl(raw.image),
      };
    case "cta":
      return {
        headline: raw.headline,
        subheadline: raw.subheadline,
        cta_label: raw.cta_label,
        cta_href: raw.cta_href,
      };
    case "faq":
      return {
        headline: raw.headline,
        items: ((raw.items as any[]) || []).map((i) => ({ q: i.q, a: i.a })),
      };
    case "reviews":
      return {
        headline: raw.headline,
        items: ((raw.items as any[]) || []).map((i) => ({
          quote: i.quote,
          author: i.author,
          company: i.company,
          rating: i.rating,
        })),
      };
    case "services":
      return {
        headline: raw.headline,
        items: ((raw.items as any[]) || []).map((i) => ({
          title: i.title,
          description: i.description,
          href: i.href,
          icon: i.icon,
        })),
      };
    case "stats":
      return {
        items: ((raw.items as any[]) || []).map((i) => ({ value: i.value, label: i.label })),
      };
    case "gallery":
      return {
        headline: raw.headline,
        items: ((raw.items as any[]) || []).map((i) => ({
          src: imgUrl(i.src),
          alt: i.alt,
          caption: i.caption,
        })),
      };
    case "rich_text":
      return { html: raw.html };
    case "image_block":
      return {
        src: imgUrl(raw.src),
        alt: raw.alt,
        caption: raw.caption,
        href: raw.href,
      };
    case "video_block":
      return {
        url: raw.url,
        poster: imgUrl(raw.poster),
        caption: raw.caption,
      };
    case "features":
      return {
        headline: raw.headline,
        items: ((raw.items as any[]) || []).map((i) => ({
          icon: i.icon,
          title: i.title,
          description: i.description,
        })),
      };
    case "custom_html":
      return { html: raw.html };
    default:
      return {};
  }
}

export function mapWpPageSections(rawSections: WpRawSection[] | null | undefined): Section[] {
  if (!rawSections) return [];
  return rawSections
    .map((raw, index) => {
      const type = normalizeLayoutName(raw.fieldGroupName);
      const data = mapSectionData(type, raw);
      if (raw.style) data.style = mapWpBlockStyle(raw.style as WpBlockStyleRaw);
      return {
        id: `section-${index}`,
        type,
        data,
        enabled: raw.enabled !== false,
      };
    })
    .filter((s) => s.enabled);
}

export type MappedPageMeta = {
  id: string;
  slug: string;
  title: string;
  seo: { title?: string; description?: string; og_image?: string };
};

export function mapWpPageMeta(page: WpPage): MappedPageMeta {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    seo: {
      title: page.seo?.title ?? undefined,
      description: page.seo?.metaDesc ?? undefined,
      og_image: page.seo?.opengraphImage?.sourceUrl ?? undefined,
    },
  };
}

// ---- Site content options pages (replaces `site_content`) -------------------

export function mapWpOptionsToByKey(
  pageKey: string,
  items: WpOptionsContentBlockRaw[] | null | undefined
): { byKey: Record<string, string>; styleByKey: Record<string, React.CSSProperties> } {
  const byKey: Record<string, string> = {};
  const styleByKey: Record<string, React.CSSProperties> = {};
  for (const item of items || []) {
    if (!item.block_key) continue;
    const fullKey = `${pageKey}.${item.block_key}`;
    byKey[fullKey] = item.content ?? "";
    if (item.style) styleByKey[fullKey] = mapWpBlockStyle(item.style);
  }
  return { byKey, styleByKey };
}

// ---- Theme settings (replaces `global_settings` + `analytics_settings`) -----

export function mapWpThemeSettingsToSiteSettings(raw: WpThemeSettingsRaw | null | undefined): Partial<SiteSettings> {
  if (!raw) return {};
  const socialLinks: Record<string, string> = {};
  if (raw.social_facebook) socialLinks.facebook = raw.social_facebook;
  if (raw.social_instagram) socialLinks.instagram = raw.social_instagram;
  if (raw.social_x) socialLinks.x = raw.social_x;
  if (raw.social_linkedin) socialLinks.linkedin = raw.social_linkedin;
  if (raw.social_youtube) socialLinks.youtube = raw.social_youtube;

  const businessHours: Record<string, string> = {};
  for (const h of raw.hh_ts_hours || []) {
    if (h.day) businessHours[h.day] = h.hours ?? "";
  }

  return {
    company_name: raw.company_name ?? undefined,
    logo_url: raw.logo_url?.sourceUrl ?? null,
    phone_primary_display: raw.phone_primary ?? undefined,
    phone_secondary: raw.phone_secondary ?? null,
    email: raw.email ?? undefined,
    address: raw.address ?? null,
    social_links: socialLinks,
    business_hours: businessHours,
    footer_content: raw.footer_content ?? null,
    copyright_text: raw.copyright_text ?? null,
  };
}

export function mapWpThemeSettingsToAnalyticsSettings(raw: WpThemeSettingsRaw | null | undefined): Partial<AnalyticsSettings> {
  if (!raw) return {};
  return {
    gtm_id: raw.gtm_id ?? null,
    ga_id: raw.ga_id ?? null,
    google_ads_conversion_ids: (raw.hh_ts_ads_conversions || [])
      .map((c) => c.conversion_id)
      .filter((id): id is string => !!id),
    google_ads_remarketing_tag: raw.google_ads_remarketing_tag ?? null,
    meta_pixel_id: raw.meta_pixel_id ?? null,
    call_tracking_script: raw.call_tracking_script ?? null,
    custom_header_scripts: raw.custom_header_scripts ?? null,
    custom_footer_scripts: raw.custom_footer_scripts ?? null,
  };
}

// ---- Blog posts (replaces `blog_posts`) --------------------------------------

export type MappedBlogListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
};

export function mapWpPostsListToBlogList(posts: WpPost[] | null | undefined): MappedBlogListItem[] {
  return (posts || []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? null,
    featured_image: p.featuredImage?.node.sourceUrl ?? null,
    published_at: p.date,
  }));
}

export type MappedBlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  author_name: string | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  no_index: boolean;
};

export function mapWpPostToBlogPost(post: WpPost | null | undefined): MappedBlogPost | null {
  if (!post) return null;
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content ?? null,
    excerpt: post.excerpt ?? null,
    featured_image: post.featuredImage?.node.sourceUrl ?? null,
    author_name: post.author?.node.name ?? null,
    published_at: post.date,
    seo_title: post.seo?.title ?? null,
    seo_description: post.seo?.metaDesc ?? null,
    og_image: post.seo?.opengraphImage?.sourceUrl ?? null,
    no_index: post.seo?.metaRobotsNoindex === "noindex",
  };
}

// ---- Nav menus (replaces `nav_menus` + `nav_items`) --------------------------

export type MappedNavItem = {
  id: string;
  label: string;
  url: string;
  open_in_new_tab: boolean;
  icon: string | null;
};

export function mapWpMenuItemsToNavItems(menu: WpMenu | null | undefined): MappedNavItem[] {
  const items: WpMenuItem[] = menu?.nodes?.[0]?.menuItems?.nodes || [];
  return items.map((it) => ({
    id: it.id,
    label: it.label,
    url: it.url,
    open_in_new_tab: it.target === "_blank",
    icon: null, // WP native menus have no ACF icon field wired up (see CmsMenu.tsx note)
  }));
}
