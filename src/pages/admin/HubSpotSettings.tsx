import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, ShieldAlert } from "lucide-react";

export default function HubSpotSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    enabled: false,
    portal_id: "",
    form_id: "",
    private_app_token: "",
    notes: "",
  });

  useEffect(() => {
    (async () => {
      const { data: row } = await supabase
        .from("hubspot_settings").select("*").eq("id", 1).maybeSingle();
      if (row) setData({
        enabled: !!row.enabled,
        portal_id: row.portal_id ?? "",
        form_id: row.form_id ?? "",
        private_app_token: row.private_app_token ?? "",
        notes: row.notes ?? "",
      });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("hubspot_settings").update({
      enabled: data.enabled,
      portal_id: data.portal_id || null,
      form_id: data.form_id || null,
      private_app_token: data.private_app_token || null,
      notes: data.notes || null,
    }).eq("id", 1);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("HubSpot settings saved");
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">HubSpot Integration</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Push every contact &amp; quote form submission directly into HubSpot CRM as a contact.
        Submissions are also logged in the Form Submissions backup, with sync status and any error message.
      </p>

      <Card className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Enable HubSpot sync</Label>
            <p className="text-xs text-muted-foreground">Off = submissions only land in the backup log.</p>
          </div>
          <Switch checked={data.enabled} onCheckedChange={(v) => setData({ ...data, enabled: v })} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Portal ID (Hub ID)</Label>
            <Input value={data.portal_id} onChange={(e) => setData({ ...data, portal_id: e.target.value })} placeholder="e.g. 12345678" />
          </div>
          <div>
            <Label className="text-xs">Form ID (optional)</Label>
            <Input value={data.form_id} onChange={(e) => setData({ ...data, form_id: e.target.value })} placeholder="HubSpot Form GUID" />
          </div>
        </div>

        <div>
          <Label className="text-xs flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> Private App Token
          </Label>
          <Input
            type="password"
            value={data.private_app_token}
            onChange={(e) => setData({ ...data, private_app_token: e.target.value })}
            placeholder="pat-na1-•••••• (required for sync)"
            autoComplete="off"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Create a Private App in HubSpot → Settings → Integrations with scopes
            <code className="bg-muted px-1 mx-1 rounded">crm.objects.contacts.read</code>
            and <code className="bg-muted px-1 mx-1 rounded">crm.objects.contacts.write</code>.
            Stored row-level secured — only staff can read.
          </p>
        </div>

        <div>
          <Label className="text-xs">Internal notes</Label>
          <Textarea rows={3} value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} placeholder="Notes for your team…" />
        </div>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}><Save className="h-4 w-4 mr-1" /> Save</Button>
        </div>
      </Card>
    </div>
  );
}
