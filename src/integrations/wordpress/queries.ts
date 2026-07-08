// GraphQL query documents against the local WPGraphQL schema.
//
// IMPORTANT: the inline-fragment type names below follow WPGraphQL-ACF's documented
// Flexible Content naming formula: `{PostType}_{FieldGroupGraphqlName}_{FlexFieldGraphqlName}_{LayoutName}`,
// each segment PascalCased via ucfirst() (so "pageSections" -> "PageSections" — only the
// first character changes; internal capitals are preserved, unlike an earlier draft of
// this file which incorrectly lowercased them).
// Source: https://github.com/wp-graphql/wp-graphql-acf/blob/develop/docs/fields/flexible-content.md
//
// The options-page query root field names (OPTIONS_ROOT_FIELD below) are less certain:
// WPGraphQL for ACF's docs note "v2.0+ contains breaking changes" to how field groups and
// options pages are exposed (https://acf.wpgraphql.com/upgrade-guide/) — options-page
// GraphQL exposure may need `show_in_graphql` set on the `acf_add_options_page()` call
// itself rather than (or in addition to) the field group. See the matching comment in
// docker/wordpress/wp-content/mu-plugins/heavy-haul-acf.php.
//
// Once WordPress + ACF PRO + WPGraphQL for ACF are actually running (`npm run wp:bootstrap`),
// introspect the live schema at /graphql (GraphiQL IDE ships with WPGraphQL) and fix
// anything that doesn't match — this file is the only place that should need edits.

const SEO_FIELDS = `
  seo {
    title
    metaDesc
    canonical
    opengraphTitle
    opengraphDescription
    opengraphImage { sourceUrl }
    opengraphType
    twitterTitle
    twitterDescription
    twitterImage { sourceUrl }
    metaRobotsNoindex
    schema { raw }
  }
`;

const STYLE_FIELDS = `
  style {
    color
    background_color
    font_size
    font_weight
    font_family
    text_align
    letter_spacing
    line_height
  }
`;

const SECTION_FRAGMENTS = `
  ... on Page_PageSections_Sections_Hero {
    fieldGroupName
    enabled
    eyebrow
    headline
    subheadline
    cta_label
    cta_href
    image { sourceUrl altText }
    ${STYLE_FIELDS}
  }
  ... on Page_PageSections_Sections_Cta {
    fieldGroupName
    enabled
    headline
    subheadline
    cta_label
    cta_href
    ${STYLE_FIELDS}
  }
  ... on Page_PageSections_Sections_Faq {
    fieldGroupName
    enabled
    headline
    items { q a }
    ${STYLE_FIELDS}
  }
  ... on Page_PageSections_Sections_Reviews {
    fieldGroupName
    enabled
    headline
    items { quote author company rating }
    ${STYLE_FIELDS}
  }
  ... on Page_PageSections_Sections_Services {
    fieldGroupName
    enabled
    headline
    items { title description href icon }
    ${STYLE_FIELDS}
  }
  ... on Page_PageSections_Sections_Stats {
    fieldGroupName
    enabled
    items { value label }
    ${STYLE_FIELDS}
  }
  ... on Page_PageSections_Sections_Gallery {
    fieldGroupName
    enabled
    headline
    items { src { sourceUrl altText } alt caption }
    ${STYLE_FIELDS}
  }
  ... on Page_PageSections_Sections_RichText {
    fieldGroupName
    enabled
    html
    ${STYLE_FIELDS}
  }
  ... on Page_PageSections_Sections_ImageBlock {
    fieldGroupName
    enabled
    src { sourceUrl altText }
    alt
    caption
    href
    ${STYLE_FIELDS}
  }
  ... on Page_PageSections_Sections_VideoBlock {
    fieldGroupName
    enabled
    url
    poster { sourceUrl altText }
    caption
    ${STYLE_FIELDS}
  }
  ... on Page_PageSections_Sections_Features {
    fieldGroupName
    enabled
    headline
    items { icon title description }
    ${STYLE_FIELDS}
  }
  ... on Page_PageSections_Sections_CustomHtml {
    fieldGroupName
    enabled
    html
  }
`;

export const GET_PAGE_BY_URI = `
  query GetPageByUri($uri: String!) {
    pageBy(uri: $uri) {
      id
      slug
      title
      ${SEO_FIELDS}
      pageSections {
        sections {
          ${SECTION_FRAGMENTS}
        }
      }
    }
  }
`;

const CONTENT_BLOCK_FIELDS = `
  items {
    block_key
    label
    kind
    content
    ${STYLE_FIELDS}
  }
`;

// Root field name per page_key must match `graphql_field_name` set in
// docker/wordpress/wp-content/mu-plugins/heavy-haul-acf.php
// ("acfOptionsSiteContent" + PascalCase(page_key)).
const OPTIONS_ROOT_FIELD: Record<string, string> = {
  header: "acfOptionsSiteContentHeader",
  footer: "acfOptionsSiteContentFooter",
  home: "acfOptionsSiteContentHome",
  dispatchers: "acfOptionsSiteContentDispatchers",
  faq: "acfOptionsSiteContentFaq",
  guarantees: "acfOptionsSiteContentGuarantees",
  trust: "acfOptionsSiteContentTrust",
  services: "acfOptionsSiteContentServices",
  about: "acfOptionsSiteContentAbout",
};

export function buildOptionsPageQuery(pageKey: string): string {
  const rootField = OPTIONS_ROOT_FIELD[pageKey];
  if (!rootField) {
    throw new Error(`Unknown site_content page_key: ${pageKey}`);
  }
  return `
    query GetOptionsPage_${pageKey} {
      ${rootField} {
        ${CONTENT_BLOCK_FIELDS}
      }
    }
  `;
}

export const GET_THEME_SETTINGS = `
  query GetThemeSettings {
    acfOptionsThemeSettings {
      company_name
      logo_url { sourceUrl altText }
      phone_primary
      phone_secondary
      email
      address
      site_url
      social_facebook
      social_instagram
      social_x
      social_linkedin
      social_youtube
      hh_ts_hours: items {
        day
        hours
      }
      footer_content
      copyright_text
      robots_txt
      default_meta_title
      default_meta_description
      default_og_image { sourceUrl altText }
      gtm_id
      ga_id
      meta_pixel_id
      google_ads_remarketing_tag
      call_tracking_script
      custom_header_scripts
      custom_footer_scripts
    }
  }
`;

export const GET_POSTS = `
  query GetPosts {
    posts(first: 100, where: { status: PUBLISH }) {
      nodes {
        id
        slug
        title
        excerpt
        date
        featuredImage { node { sourceUrl altText } }
        author { node { name } }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      excerpt
      date
      featuredImage { node { sourceUrl altText } }
      author { node { name } }
      ${SEO_FIELDS}
    }
  }
`;

export const GET_MENU_BY_LOCATION = `
  query GetMenuByLocation($location: [MenuLocationEnum!]) {
    menus(where: { location: $location }) {
      nodes {
        menuItems(where: { parentId: "0" }) {
          nodes {
            id
            label
            url
            target
          }
        }
      }
    }
  }
`;
