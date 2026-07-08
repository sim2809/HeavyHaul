import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type A = {
  gtm_id: string | null;
  ga_id: string | null;
  google_ads_conversion_ids: string[];
  google_ads_remarketing_tag: string | null;
  meta_pixel_id: string | null;
  call_tracking_script: string | null;
  custom_header_scripts: string | null;
  custom_footer_scripts: string | null;
};

const empty: A = {
  gtm_id: "",
  ga_id: "",
  google_ads_conversion_ids: [],
  google_ads_remarketing_tag: "",
  meta_pixel_id: "",
  call_tracking_script: "",
  custom_header_scripts: "",
  custom_footer_scripts: "",
};

const AnalyticsPage = () => {
  const [a, setA] = useState<A>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [conversionsText, setConversionsText] = useState("");

  useEffect(() => {
    supabase.from("analytics_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (data) {
        const merged = { ...empty, ...data, google_ads_conversion_ids: (data.google_ads_conversion_ids as any) ?? [] };
        setA(merged);
        setConversionsText(merged.google_ads_conversion_ids.join("\n"));
      }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const ids = conversionsText.split("\n").map((l) => l.trim()).filter(Boolean);
    const payload = { ...a, google_ads_conversion_ids: ids };
    const { error } = await supabase.from("analytics_settings").update(payload).eq("id", 1);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Analytics saved. Tracking will update on next page load.");
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Analytics & Tracking</h1>
      <p className="text-muted-foreground mt-1">All tracking IDs and scripts injected sitewide.</p>

      <Card className="p-6 mt-6 space-y-4">
        <h2 className="font-bold text-lg">Tag IDs</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Google Tag Manager ID" value={a.gtm_id} onChange={(v) => setA({ ...a, gtm_id: v })} placeholder="GTM-XXXXXX" />
          <Field label="Google Analytics ID" value={a.ga_id} onChange={(v) => setA({ ...a, ga_id: v })} placeholder="G-XXXXXXXXXX" />
          <Field label="Meta Pixel ID" value={a.meta_pixel_id} onChange={(v) => setA({ ...a, meta_pixel_id: v })} placeholder="1234567890" />
          <Field label="Google Ads Remarketing Tag" value={a.google_ads_remarketing_tag} onChange={(v) => setA({ ...a, google_ads_remarketing_tag: v })} placeholder="AW-XXXXXXXXX" />
        </div>
        <div>
          <Label>Google Ads Conversion IDs (one per line)</Label>
          <Textarea rows={3} value={conversionsText} onChange={(e) => setConversionsText(e.target.value)} placeholder={"AW-XXXXX/abcdef\nAW-XXXXX/ghijkl"} />
        </div>
      </Card>

      <Card className="p-6 mt-6 space-y-4">
        <h2 className="font-bold text-lg">Custom Scripts</h2>
        <p className="text-xs text-muted-foreground">Raw HTML/JS. Loaded sitewide. Use carefully.</p>
        <div>
          <Label>Call Tracking Script</Label>
          <Textarea rows={3} value={a.call_tracking_script ?? ""} onChange={(e) => setA({ ...a, call_tracking_script: e.target.value })} />
        </div>
        <div>
          <Label>Custom Header Scripts (&lt;head&gt;)</Label>
          <Textarea rows={4} value={a.custom_header_scripts ?? ""} onChange={(e) => setA({ ...a, custom_header_scripts: e.target.value })} />
        </div>
        <div>
          <Label>Custom Footer Scripts (end of &lt;body&gt;)</Label>
          <Textarea rows={4} value={a.custom_footer_scripts ?? ""} onChange={(e) => setA({ ...a, custom_footer_scripts: e.target.value })} />
        </div>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} disabled={saving} size="lg">{saving ? "Saving…" : "Save"}</Button>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder }: { label: string; value: string | null; onChange: (v: string) => void; placeholder?: string }) => (
  <div>
    <Label>{label}</Label>
    <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

export default AnalyticsPage;
