import { Helmet } from "react-helmet-async";
import { useAnalyticsSettings } from "@/hooks/useSiteSettings";

/**
 * Injects analytics & tracking scripts (GTM, GA4, Meta Pixel, Google Ads, custom)
 * Loaded once at the app root so every page is tracked.
 * NOTE: Helmet writes into document.head/body client-side after hydration.
 */
const AnalyticsInjector = () => {
  const a = useAnalyticsSettings();

  // Build inline scripts
  const gtmHead = a.gtm_id
    ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${a.gtm_id}');`
    : null;

  const gaSnippet = a.ga_id
    ? `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${a.ga_id}');${a.google_ads_remarketing_tag ? `gtag('config', '${a.google_ads_remarketing_tag}');` : ""}${a.google_ads_conversion_ids
        .map((id) => `gtag('config', '${id.split("/")[0]}');`)
        .join("")}`
    : null;

  const metaPixel = a.meta_pixel_id
    ? `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${a.meta_pixel_id}');fbq('track', 'PageView');`
    : null;

  return (
    <Helmet>
      {a.ga_id && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${a.ga_id}`} />
      )}
      {gaSnippet && <script>{gaSnippet}</script>}
      {gtmHead && <script>{gtmHead}</script>}
      {metaPixel && <script>{metaPixel}</script>}
      {a.call_tracking_script && <script>{a.call_tracking_script}</script>}
      {a.custom_header_scripts && <script>{a.custom_header_scripts}</script>}
      {a.custom_footer_scripts && <script>{a.custom_footer_scripts}</script>}
    </Helmet>
  );
};

export default AnalyticsInjector;
