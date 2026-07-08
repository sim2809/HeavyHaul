import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Settings as SettingsIcon } from "lucide-react";

type Page = { id: string; slug: string; title: string; description: string | null; enabled: boolean };

export default function PagesList() {
  const [rows, setRows] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPage, setNewPage] = useState<{ slug: string; title: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("pages").select("*").order("slug");
    setRows((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!newPage?.slug || !newPage?.title) return toast.error("Slug and title required");
    const slug = newPage.slug.replace(/^\/+/, "").toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const { error } = await supabase.from("pages").insert({ slug, title: newPage.title });
    if (error) return toast.error(error.message);
    setNewPage(null);
    toast.success("Page created");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="text-sm text-muted-foreground">Edit content blocks for each page. Drag to reorder.</p>
        </div>
        <Button onClick={() => setNewPage({ slug: "", title: "" })}><Plus className="h-4 w-4 mr-1" /> New page</Button>
      </div>

      {newPage && (
        <div className="mb-6 border rounded-lg p-4 bg-card flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Slug</label>
            <Input value={newPage.slug} onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })} placeholder="home, about, services/heavy-haul" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Title</label>
            <Input value={newPage.title} onChange={(e) => setNewPage({ ...newPage, title: e.target.value })} placeholder="Homepage" />
          </div>
          <Button onClick={create}>Create</Button>
          <Button variant="outline" onClick={() => setNewPage(null)}>Cancel</Button>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="p-3">Slug</th><th className="p-3">Title</th><th className="p-3">Status</th><th className="p-3 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No pages.</td></tr>
            ) : rows.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-mono">/{p.slug === "home" ? "" : p.slug}</td>
                <td className="p-3 font-medium">{p.title}</td>
                <td className="p-3">{p.enabled ? <span className="text-green-600">Enabled</span> : <span className="text-muted-foreground">Disabled</span>}</td>
                <td className="p-3 text-right">
                  <Link to={`/admin/pages/${p.id}`}>
                    <Button variant="ghost" size="sm"><SettingsIcon className="h-4 w-4 mr-1" /> Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
