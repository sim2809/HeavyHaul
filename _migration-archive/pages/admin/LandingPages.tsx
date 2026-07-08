import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, ExternalLink, Settings as SettingsIcon } from "lucide-react";

const RESERVED = new Set(["home", "about", "services", "contact", "blog", "lanes", "admin"]);

type Page = { id: string; slug: string; title: string; enabled: boolean };

export default function LandingPages() {
  const [rows, setRows] = useState<Page[]>([]);
  const [creating, setCreating] = useState<{ slug: string; title: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("pages").select("id,slug,title,enabled").order("slug");
    setRows((data as any || []).filter((p: Page) => !RESERVED.has(p.slug.split("/")[0])));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!creating?.slug || !creating?.title) return toast.error("Slug and title required");
    const slug = creating.slug.replace(/^\/+/, "").toLowerCase().replace(/[^a-z0-9/-]/g, "-");
    if (RESERVED.has(slug.split("/")[0])) return toast.error("Reserved path — pick a different slug");
    const { error } = await supabase.from("pages").insert({ slug, title: creating.title });
    if (error) return toast.error(error.message);
    setCreating(null);
    toast.success("Landing page created");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Landing Pages</h1>
          <p className="text-sm text-muted-foreground">Unlimited SEO landing pages at any URL. Example: <code>heavy-equipment-transport-texas</code> → <code>/heavy-equipment-transport-texas</code></p>
        </div>
        <Button onClick={() => setCreating({ slug: "", title: "" })}><Plus className="h-4 w-4 mr-1" /> New landing page</Button>
      </div>

      {creating && (
        <Card className="p-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">URL slug</Label>
              <Input value={creating.slug} onChange={(e) => setCreating({ ...creating, slug: e.target.value })} placeholder="heavy-equipment-transport-texas" />
              <p className="text-xs text-muted-foreground mt-1">Will live at /{creating.slug || "your-slug"}</p>
            </div>
            <div>
              <Label className="text-xs">Page title</Label>
              <Input value={creating.title} onChange={(e) => setCreating({ ...creating, title: e.target.value })} placeholder="Heavy Equipment Transport in Texas" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={create}>Create</Button>
            <Button variant="outline" onClick={() => setCreating(null)}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left"><th className="p-3">URL</th><th className="p-3">Title</th><th className="p-3">Status</th><th className="p-3 w-40"></th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No landing pages yet.</td></tr>
            ) : rows.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-mono">/{p.slug}</td>
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.enabled ? <span className="text-green-600">Live</span> : <span className="text-muted-foreground">Draft</span>}</td>
                <td className="p-3 text-right space-x-1">
                  <a href={`/${p.slug}`} target="_blank" rel="noreferrer"><Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button></a>
                  <Link to={`/admin/pages/${p.id}`}><Button variant="ghost" size="sm"><SettingsIcon className="h-4 w-4 mr-1" /> Edit</Button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
