import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

type Row = {
  id?: string;
  path: string;
  title?: string | null;
  description?: string | null;
  canonical?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  og_type?: string | null;
  robots?: string | null;
  json_ld?: any;
};

export default function SeoManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [active, setActive] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("seo_overrides").select("*").order("path");
    setRows((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!active?.path) return toast.error("Path is required (e.g. / or /about)");
    const payload = { ...active, json_ld: typeof active.json_ld === "string" ? safeJson(active.json_ld) : active.json_ld };
    const { error } = active.id
      ? await supabase.from("seo_overrides").update(payload).eq("id", active.id)
      : await supabase.from("seo_overrides").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("SEO saved");
    setActive(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this SEO override?")) return;
    const { error } = await supabase.from("seo_overrides").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">SEO Manager</h1>
          <p className="text-sm text-muted-foreground">Per-page title, description, canonical, OG tags, JSON-LD.</p>
        </div>
        <Button onClick={() => setActive({ path: "" })}><Plus className="h-4 w-4 mr-1" /> New override</Button>
      </div>

      {active && (
        <div className="mb-8 border rounded-lg p-5 bg-card space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Path *" v={active.path} onChange={(v) => setActive({ ...active, path: v })} placeholder="/ or /about" />
            <Field label="Canonical URL" v={active.canonical || ""} onChange={(v) => setActive({ ...active, canonical: v })} placeholder="/about" />
            <Field label="Title" v={active.title || ""} onChange={(v) => setActive({ ...active, title: v })} />
            <Field label="Robots" v={active.robots || "index,follow"} onChange={(v) => setActive({ ...active, robots: v })} />
          </div>
          <Field area label="Description" v={active.description || ""} onChange={(v) => setActive({ ...active, description: v })} />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="OG Title" v={active.og_title || ""} onChange={(v) => setActive({ ...active, og_title: v })} />
            <Field label="OG Image URL" v={active.og_image || ""} onChange={(v) => setActive({ ...active, og_image: v })} />
          </div>
          <Field area label="OG Description" v={active.og_description || ""} onChange={(v) => setActive({ ...active, og_description: v })} />
          <Field area label="JSON-LD (optional)" v={typeof active.json_ld === "string" ? active.json_ld : JSON.stringify(active.json_ld || "", null, 2)} onChange={(v) => setActive({ ...active, json_ld: v })} placeholder='{"@context":"https://schema.org",...}' />
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
              <th className="p-3">Path</th>
              <th className="p-3">Title</th>
              <th className="p-3">Robots</th>
              <th className="p-3 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No overrides yet.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-mono">{r.path}</td>
                <td className="p-3 truncate max-w-xs">{r.title}</td>
                <td className="p-3 text-xs">{r.robots}</td>
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

function Field({ label, v, onChange, placeholder, area }: { label: string; v: string; onChange: (v: string) => void; placeholder?: string; area?: boolean }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      {area ? (
        <Textarea value={v} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} />
      ) : (
        <Input value={v} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function safeJson(s: string) {
  if (!s?.trim()) return null;
  try { return JSON.parse(s); } catch { return s; }
}
