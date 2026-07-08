import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, RefreshCw, ExternalLink } from "lucide-react";

type Row = {
  id: string;
  name: string | null; email: string | null; phone: string | null;
  origin: string | null; destination: string | null; equipment: string | null;
  message: string | null; page_url: string | null; source: string | null;
  hubspot_status: string; hubspot_error: string | null; hubspot_contact_id: string | null;
  created_at: string;
};

const statusColor = (s: string) =>
  s === "synced" ? "bg-green-500/15 text-green-700 dark:text-green-400"
  : s === "failed" ? "bg-red-500/15 text-red-700 dark:text-red-400"
  : s === "skipped" ? "bg-muted text-muted-foreground"
  : "bg-amber-500/15 text-amber-700 dark:text-amber-400";

export default function FormSubmissions() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("form_submissions").select("*").order("created_at", { ascending: false }).limit(500);
    setRows((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm("Delete submission permanently?")) return;
    await supabase.from("form_submissions").delete().eq("id", id);
    setRows(rows.filter((r) => r.id !== id));
    if (selected?.id === id) setSelected(null);
    toast.success("Deleted");
  };

  const filtered = rows.filter((r) => {
    if (!q) return true;
    const t = q.toLowerCase();
    return [r.name, r.email, r.phone, r.equipment, r.origin, r.destination, r.source]
      .filter(Boolean).some((x) => x!.toLowerCase().includes(t));
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Form Submissions</h1>
          <p className="text-sm text-muted-foreground">Backup log of every form submission. HubSpot remains the source of truth for CRM.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh</Button>
      </div>

      <Input placeholder="Search name, email, equipment, route…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-sm" />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">When</th>
                <th className="text-left px-3 py-2">Name / Email</th>
                <th className="text-left px-3 py-2">Phone</th>
                <th className="text-left px-3 py-2">Route</th>
                <th className="text-left px-3 py-2">Equipment</th>
                <th className="text-left px-3 py-2">HubSpot</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/30 cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <div className="font-semibold">{r.name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{r.email || "—"}</div>
                  </td>
                  <td className="px-3 py-2 text-xs">{r.phone || "—"}</td>
                  <td className="px-3 py-2 text-xs">{[r.origin, r.destination].filter(Boolean).join(" → ") || "—"}</td>
                  <td className="px-3 py-2 text-xs">{r.equipment || "—"}</td>
                  <td className="px-3 py-2"><span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${statusColor(r.hubspot_status)}`}>{r.hubspot_status}</span></td>
                  <td className="px-3 py-2 text-right">
                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); del(r.id); }}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No submissions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <Card className="max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">Submission detail</h2>
              <Badge className={statusColor(selected.hubspot_status)}>{selected.hubspot_status}</Badge>
            </div>
            <dl className="space-y-2 text-sm">
              {[
                ["Name", selected.name], ["Email", selected.email], ["Phone", selected.phone],
                ["Origin", selected.origin], ["Destination", selected.destination],
                ["Equipment", selected.equipment], ["Source", selected.source],
                ["Page URL", selected.page_url], ["HubSpot contact", selected.hubspot_contact_id],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-2">
                  <dt className="text-muted-foreground text-xs uppercase">{k}</dt>
                  <dd className="col-span-2 break-all">{v || "—"}</dd>
                </div>
              ))}
              {selected.message && (
                <div>
                  <dt className="text-muted-foreground text-xs uppercase mb-1">Message</dt>
                  <dd className="whitespace-pre-wrap bg-muted/30 p-2 rounded text-xs">{selected.message}</dd>
                </div>
              )}
              {selected.hubspot_error && (
                <div>
                  <dt className="text-red-500 text-xs uppercase mb-1">HubSpot error</dt>
                  <dd className="whitespace-pre-wrap bg-red-500/10 p-2 rounded text-xs text-red-700 dark:text-red-300">{selected.hubspot_error}</dd>
                </div>
              )}
            </dl>
            {selected.hubspot_contact_id && (
              <a href={`https://app.hubspot.com/contacts/_/contact/${selected.hubspot_contact_id}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary text-sm mt-4">
                Open in HubSpot <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
