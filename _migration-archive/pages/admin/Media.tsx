import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Trash2, Copy, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MediaAsset {
  id: string;
  storage_path: string;
  public_url: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  created_at: string;
}

const fmtBytes = (b: number | null) => {
  if (!b) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

const MediaPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "bin";
      const safe = file.name.replace(/[^a-z0-9.\-_]/gi, "_");
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;

      const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600", upsert: false, contentType: file.type,
      });
      if (upErr) { toast.error(`${file.name}: ${upErr.message}`); continue; }

      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);

      const { error: insErr } = await supabase.from("media_assets").insert({
        storage_path: path,
        public_url: pub.publicUrl,
        file_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        uploaded_by: user?.id ?? null,
      });
      if (insErr) toast.error(`${file.name}: ${insErr.message}`);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    load();
    toast.success("Upload complete");
  };

  const remove = async (item: MediaAsset) => {
    if (!confirm(`Delete ${item.file_name}?`)) return;
    const { error: sErr } = await supabase.storage.from("media").remove([item.storage_path]);
    if (sErr) toast.error(sErr.message);
    const { error: dErr } = await supabase.from("media_assets").delete().eq("id", item.id);
    if (dErr) return toast.error(dErr.message);
    toast.success("Deleted");
    load();
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success("URL copied — paste into any image field");
  };

  const filtered = items.filter((i) => i.file_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*,application/pdf"
            multiple
            hidden
            onChange={(e) => upload(e.target.files)}
          />
          <Button size="lg" disabled={uploading} onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload Files"}
          </Button>
        </div>
      </div>

      <Card className="mt-4 p-3">
        <div className="flex items-center gap-2 px-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files…" className="border-0 shadow-none focus-visible:ring-0" />
        </div>
      </Card>

      {loading ? (
        <p className="text-muted-foreground mt-6">Loading…</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-10">No files yet. Click Upload Files to start.</p>
          )}
          {filtered.map((it) => (
            <Card key={it.id} className="overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                {it.mime_type?.startsWith("image/") ? (
                  <img src={it.public_url} alt={it.alt_text ?? it.file_name} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center">{it.mime_type}</div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button size="sm" variant="secondary" onClick={() => copyUrl(it.public_url)}><Copy className="h-3 w-3" /></Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(it)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
              <div className="p-2">
                <div className="text-xs font-medium truncate" title={it.file_name}>{it.file_name}</div>
                <div className="text-[10px] text-muted-foreground">{fmtBytes(it.size_bytes)}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaPage;
