// Hand-written interfaces for the subset of the WPGraphQL schema this app actually
// consumes. Not full-schema codegen — the app is small enough that this is easier to
// keep in sync by hand than to run a codegen pipeline for.

export interface WpImage {
  sourceUrl: string;
  altText?: string | null;
}

export interface WpBlockStyle {
  color?: string | null;
  backgroundColor?: string | null;
  fontSize?: string | null;
  fontWeight?: string | null;
  fontFamily?: string | null;
  textAlign?: string | null;
  letterSpacing?: string | null;
  lineHeight?: string | null;
}

// One raw flexible-content row as returned by WPGraphQL-ACF. `fieldGroupName` is the
// discriminator identifying which ACF layout this row came from (hero/cta/faq/etc.) —
// exact casing is plugin-version dependent, see mappers.ts's normalizeLayoutName().
export interface WpRawSection {
  fieldGroupName: string;
  [field: string]: unknown;
}

export interface WpSeo {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: WpImage | null;
  opengraphType?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: WpImage | null;
  metaRobotsNoindex?: string | null;
  schema?: { raw?: string | null } | null;
}

export interface WpPage {
  id: string;
  slug: string;
  title: string;
  isFrontPage?: boolean;
  seo?: WpSeo | null;
  pageSections?: {
    sections?: WpRawSection[] | null;
  } | null;
}

export interface WpOptionsContentBlockRaw {
  block_key: string;
  label?: string | null;
  kind?: "text" | "textarea" | "html" | null;
  content?: string | null;
  style?: WpBlockStyleRaw | null;
}

export interface WpBlockStyleRaw {
  color?: string | null;
  background_color?: string | null;
  font_size?: string | null;
  font_weight?: string | null;
  font_family?: string | null;
  text_align?: string | null;
  letter_spacing?: string | null;
  line_height?: string | null;
}

export interface WpThemeSettingsRaw {
  company_name?: string | null;
  logo_url?: WpImage | null;
  phone_primary?: string | null;
  phone_secondary?: string | null;
  email?: string | null;
  address?: string | null;
  site_url?: string | null;
  social_facebook?: string | null;
  social_instagram?: string | null;
  social_x?: string | null;
  social_linkedin?: string | null;
  social_youtube?: string | null;
  hh_ts_hours?: { day?: string | null; hours?: string | null }[] | null;
  footer_content?: string | null;
  copyright_text?: string | null;
  robots_txt?: string | null;
  default_meta_title?: string | null;
  default_meta_description?: string | null;
  default_og_image?: WpImage | null;
  gtm_id?: string | null;
  ga_id?: string | null;
  meta_pixel_id?: string | null;
  google_ads_remarketing_tag?: string | null;
  hh_ts_ads_conversions?: { conversion_id?: string | null }[] | null;
  call_tracking_script?: string | null;
  custom_header_scripts?: string | null;
  custom_footer_scripts?: string | null;
}

export interface WpPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  date: string;
  featuredImage?: { node: WpImage } | null;
  author?: { node: { name: string } } | null;
  seo?: WpSeo | null;
}

export interface WpMenuItem {
  id: string;
  label: string;
  url: string;
  target?: string | null;
}

export interface WpMenu {
  nodes: {
    menuItems: { nodes: WpMenuItem[] };
  }[];
}
