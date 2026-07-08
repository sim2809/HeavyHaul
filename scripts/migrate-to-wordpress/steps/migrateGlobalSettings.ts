import { supabaseAdmin } from "../supabaseAdmin";
import { wpGraphqlMutate } from "../wpClient";

const UPDATE_THEME_SETTINGS = `
  mutation UpdateThemeSettings($input: UpdateAcfOptionsThemeSettingsInput!) {
    updateAcfOptionsThemeSettings(input: $input) {
      clientMutationId
    }
  }
`;

export async function migrateGlobalSettings(dryRun: boolean) {
  const [{ data: g, error: gErr }, { data: a, error: aErr }] = await Promise.all([
    supabaseAdmin.from("global_settings").select("*").eq("id", 1).maybeSingle(),
    supabaseAdmin.from("analytics_settings").select("*").eq("id", 1).maybeSingle(),
  ]);
  if (gErr) throw gErr;
  if (aErr) throw aErr;

  if (dryRun) {
    console.log("[theme-settings] (dry-run) would migrate global_settings + analytics_settings");
    return;
  }

  const social = (g?.social_links as Record<string, string>) ?? {};
  const hours = (g?.business_hours as Record<string, string>) ?? {};

  const input = {
    company_name: g?.company_name,
    phone_primary: g?.phone_primary,
    phone_secondary: g?.phone_secondary,
    email: g?.email,
    address: g?.address,
    site_url: g?.site_url,
    social_facebook: social.facebook,
    social_instagram: social.instagram,
    social_x: social.x,
    social_linkedin: social.linkedin,
    social_youtube: social.youtube,
    hh_ts_hours: Object.entries(hours).map(([day, dayHours]) => ({ day, hours: dayHours })),
    footer_content: g?.footer_content,
    copyright_text: g?.copyright_text,
    robots_txt: g?.robots_txt,
    default_meta_title: g?.default_meta_title,
    default_meta_description: g?.default_meta_description,
    gtm_id: a?.gtm_id,
    ga_id: a?.ga_id,
    meta_pixel_id: a?.meta_pixel_id,
    google_ads_remarketing_tag: a?.google_ads_remarketing_tag,
    hh_ts_ads_conversions: ((a?.google_ads_conversion_ids as string[]) ?? []).map((id) => ({ conversion_id: id })),
    call_tracking_script: a?.call_tracking_script,
    custom_header_scripts: a?.custom_header_scripts,
    custom_footer_scripts: a?.custom_footer_scripts,
  };

  try {
    await wpGraphqlMutate(UPDATE_THEME_SETTINGS, { input });
    console.log("[theme-settings] migrated global_settings + analytics_settings");
    console.log("[theme-settings]   NOTE: logo_url and default_og_image are image fields — upload them manually in wp-admin (Theme Settings), the old rows only stored plain URLs.");
  } catch (err) {
    console.error("[theme-settings] FAILED:", err);
  }
}
