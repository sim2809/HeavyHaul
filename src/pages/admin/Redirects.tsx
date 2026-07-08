import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

type Row = { id?: string; from_path: string; to_path: string; status_code: number; enabled: boolean };

export default function RedirectsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [active, setActive] = useState<Row | null>(null);

  const load = async () => {
    const { data } = await supabase.from("redirects").select("*").order("from_path");
    setRows((data as any) || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!active?.from_path || !active?.to_path) return toast.error("From and To paths are required");
    const { error } = active.id
      ? await supabase.from("redirects").update(active).eq("id", active.id)
      : await supabase.from("redirects").insert(active);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setActive(null);
    load();
  };

  const toggle = async (r: Row) => {
    await supabase.from("redirects").update({ enabled: !r.enabled }).eq("id", r.id!);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete redirect?")) return;
    await supabase.from("redirects").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Redirects</h1>
          <p className="text-sm text-muted-foreground">301/302 client-side redirects. Use to preserve SEO after URL changes.</p>
        </div>
        <Button onClick={() => setActive({ from_path: "", to_path: "", status_code: 301, enabled: true })}>
          <Plus className="h-4 w-4 mr-1" /> New redirect
        </Button>
      </div>

      {active && (
        <div className="mb-8 border rounded-lg p-5 bg-card space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">From path</Label>
              <Input value={active.from_path} onChange={(e) => setActive({ ...active, from_path: e.target.value })} placeholder="/old-page" />
            </div>
            <div>
              <Label className="text-xs">To path / URL</Label>
              <Input value={active.to_path} onChange={(e) => setActive({ ...active, to_path: e.target.value })} placeholder="/new-page" />
            </div>
            <div>
              <Label className="text-xs">Status code</Label>
              <Input type="number" value={active.status_code} onChange={(e) => setActive({ ...active, status_code: Number(e.target.value) })} />
            </div>
            <div className="flex items-end gap-2">
              <Switch checked={active.enabled} onCheckedChange={(v) => setActive({ ...active, enabled: v })} />
              <Label>Enabled</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => setActive(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="p-3">From</th><th className="p-3">To</th><th className="p-3">Status</th><th className="p-3">Enabled</th><th className="p-3 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No redirects.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-mono">{r.from_path}</td>
                <td className="p-3 font-mono">{r.to_path}</td>
                <td className="p-3">{r.status_code}</td>
                <td className="p-3"><Switch checked={r.enabled} onCheckedChange={() => toggle(r)} /></td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => setActive(r)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(r.id!)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
