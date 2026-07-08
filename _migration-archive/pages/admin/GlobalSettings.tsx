import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type Settings = {
  company_name: string | null;
  logo_url: string | null;
  phone_primary: string | null;
  phone_secondary: string | null;
  email: string | null;
  address: string | null;
  social_links: Record<string, string>;
  business_hours: Record<string, string>;
  footer_content: string | null;
  copyright_text: string | null;
  site_url: string | null;
  default_meta_title: string | null;
  default_meta_description: string | null;
  default_og_image: string | null;
  robots_txt: string | null;
};

const empty: Settings = {
  company_name: "",
  logo_url: "",
  phone_primary: "",
  phone_secondary: "",
  email: "",
  address: "",
  social_links: { facebook: "", instagram: "", x: "", linkedin: "", youtube: "" },
  business_hours: { mon_fri: "", sat: "", sun: "" },
  footer_content: "",
  copyright_text: "",
  site_url: "",
  default_meta_title: "",
  default_meta_description: "",
  default_og_image: "",
  robots_txt: "",
};

const GlobalSettingsPage = () => {
  const [s, setS] = useState<Settings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("global_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (data) setS({ ...empty, ...data, social_links: { ...empty.social_links, ...(data.social_links as any) }, business_hours: { ...empty.business_hours, ...(data.business_hours as any) } });
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("global_settings").update({ ...s }).eq("id", 1);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Settings saved. Public site will reflect changes immediately.");
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Global Settings</h1>
      <p className="text-muted-foreground mt-1">Edits here update the whole public site.</p>

      <Card className="p-6 mt-6 space-y-4">
        <h2 className="font-bold text-lg">Company</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Company Name" value={s.company_name} onChange={(v) => setS({ ...s, company_name: v })} />
          <Field label="Logo URL" value={s.logo_url} onChange={(v) => setS({ ...s, logo_url: v })} placeholder="https://..." />
          <Field label="Primary Phone" value={s.phone_primary} onChange={(v) => setS({ ...s, phone_primary: v })} />
          <Field label="Secondary Phone" value={s.phone_secondary} onChange={(v) => setS({ ...s, phone_secondary: v })} />
          <Field label="Email" value={s.email} onChange={(v) => setS({ ...s, email: v })} />
          <Field label="Address" value={s.address} onChange={(v) => setS({ ...s, address: v })} />
        </div>
      </Card>

      <Card className="p-6 mt-6 space-y-4">
        <h2 className="font-bold text-lg">Social Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(s.social_links).map(([k, v]) => (
            <Field key={k} label={k[0].toUpperCase() + k.slice(1)} value={v}
              onChange={(val) => setS({ ...s, social_links: { ...s.social_links, [k]: val } })}
              placeholder="https://..." />
          ))}
        </div>
      </Card>

      <Card className="p-6 mt-6 space-y-4">
        <h2 className="font-bold text-lg">Business Hours</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Mon–Fri" value={s.business_hours.mon_fri} onChange={(v) => setS({ ...s, business_hours: { ...s.business_hours, mon_fri: v } })} placeholder="6:00 AM – 10:00 PM" />
          <Field label="Saturday" value={s.business_hours.sat} onChange={(v) => setS({ ...s, business_hours: { ...s.business_hours, sat: v } })} />
          <Field label="Sunday" value={s.business_hours.sun} onChange={(v) => setS({ ...s, business_hours: { ...s.business_hours, sun: v } })} />
        </div>
      </Card>

      <Card className="p-6 mt-6 space-y-4">
        <h2 className="font-bold text-lg">Footer</h2>
        <div>
          <Label>Footer Content</Label>
          <Textarea rows={3} value={s.footer_content ?? ""} onChange={(e) => setS({ ...s, footer_content: e.target.value })} />
        </div>
        <Field label="Copyright Text" value={s.copyright_text} onChange={(v) => setS({ ...s, copyright_text: v })} />
      </Card>

      <Card className="p-6 mt-6 space-y-4">
        <h2 className="font-bold text-lg">SEO Defaults</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Site URL (no trailing slash)" value={s.site_url} onChange={(v) => setS({ ...s, site_url: v })} placeholder="https://heavyhaulgroup.com" />
          <Field label="Default OG Image URL" value={s.default_og_image} onChange={(v) => setS({ ...s, default_og_image: v })} />
          <Field label="Default Meta Title" value={s.default_meta_title} onChange={(v) => setS({ ...s, default_meta_title: v })} />
          <Field label="Default Meta Description" value={s.default_meta_description} onChange={(v) => setS({ ...s, default_meta_description: v })} />
        </div>
        <div>
          <Label>robots.txt (custom — leave blank for auto)</Label>
          <Textarea rows={4} value={s.robots_txt ?? ""} onChange={(e) => setS({ ...s, robots_txt: e.target.value })} placeholder="User-agent: *&#10;Allow: /" />
        </div>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} disabled={saving} size="lg">{saving ? "Saving…" : "Save Settings"}</Button>
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

export default GlobalSettingsPage;
