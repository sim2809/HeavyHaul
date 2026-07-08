import { createContext, useContext, useMemo, ReactNode } from "react";
import { useThemeSettings } from "@/integrations/wordpress/hooks";

export interface SiteSettings {
  company_name: string;
  logo_url: string | null;
  phone_primary: string;       // E.164 / dialable, e.g. +18005550199
  phone_primary_display: string; // pretty display, e.g. (800) 555-0199
  phone_secondary: string | null;
  email: string;
  address: string | null;
  social_links: Record<string, string>;
  business_hours: Record<string, string>;
  footer_content: string | null;
  copyright_text: string | null;
}

export interface AnalyticsSettings {
  gtm_id: string | null;
  ga_id: string | null;
  google_ads_conversion_ids: string[];
  google_ads_remarketing_tag: string | null;
  meta_pixel_id: string | null;
  call_tracking_script: string | null;
  custom_header_scripts: string | null;
  custom_footer_scripts: string | null;
}

// Hardcoded fallbacks (used until CMS values load, or if anything is empty)
const FALLBACK: SiteSettings = {
  company_name: "Heavy Haul Group",
  logo_url: null,
  phone_primary: "+18005550199",
  phone_primary_display: "(800) 555-0199",
  phone_secondary: null,
  email: "dispatch@heavyhaulgroup.com",
  address: null,
  social_links: {},
  business_hours: {},
  footer_content: null,
  copyright_text: null,
};

const FALLBACK_ANALYTICS: AnalyticsSettings = {
  gtm_id: null,
  ga_id: null,
  google_ads_conversion_ids: [],
  google_ads_remarketing_tag: null,
  meta_pixel_id: null,
  call_tracking_script: null,
  custom_header_scripts: null,
  custom_footer_scripts: null,
};

const Ctx = createContext<{ settings: SiteSettings; analytics: AnalyticsSettings }>({
  settings: FALLBACK,
  analytics: FALLBACK_ANALYTICS,
});

const toTelHref = (raw: string | null | undefined) => {
  if (!raw) return FALLBACK.phone_primary;
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits;
};

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data } = useThemeSettings();

  const value = useMemo(() => {
    const g = data?.settings;
    const a = data?.analytics;
    return {
      settings: g
        ? {
            company_name: g.company_name || FALLBACK.company_name,
            logo_url: g.logo_url ?? null,
            phone_primary: toTelHref(g.phone_primary_display),
            phone_primary_display: g.phone_primary_display || FALLBACK.phone_primary_display,
            phone_secondary: g.phone_secondary ?? null,
            email: g.email || FALLBACK.email,
            address: g.address ?? null,
            social_links: g.social_links ?? {},
            business_hours: g.business_hours ?? {},
            footer_content: g.footer_content ?? null,
            copyright_text: g.copyright_text ?? null,
          }
        : FALLBACK,
      analytics: a
        ? {
            gtm_id: a.gtm_id ?? null,
            ga_id: a.ga_id ?? null,
            google_ads_conversion_ids: a.google_ads_conversion_ids ?? [],
            google_ads_remarketing_tag: a.google_ads_remarketing_tag ?? null,
            meta_pixel_id: a.meta_pixel_id ?? null,
            call_tracking_script: a.call_tracking_script ?? null,
            custom_header_scripts: a.custom_header_scripts ?? null,
            custom_footer_scripts: a.custom_footer_scripts ?? null,
          }
        : FALLBACK_ANALYTICS,
    };
  }, [data]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useSiteSettings = () => useContext(Ctx).settings;
export const useAnalyticsSettings = () => useContext(Ctx).analytics;
