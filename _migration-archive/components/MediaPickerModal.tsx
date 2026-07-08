import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

type MediaAsset = {
  id: string;
  storage_path: string;
  public_url: string;
  file_name: string;
  mime_type: string | null;
};

export default function MediaPickerModal({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
}) {
  const { user } = useAuth();
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("media_assets")
      .select("id,storage_path,public_url,file_name,mime_type")
      .order("created_at", { ascending: false });
    setItems((data ?? []) as MediaAsset[]);
    setLoading(false);
  };

  useEffect(() => { if (open) load(); }, [open]);

  const upload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const safe = file.name.replace(/[^a-z0-9.\-_]/gi, "_");
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600", upsert: false, contentType: file.type,
      });
      if (upErr) { toast.error(`${file.name}: ${upErr.message}`); continue; }
      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      const { error: insErr, data: row } = await supabase.from("media_assets").insert({
        storage_path: path,
        public_url: pub.publicUrl,
        file_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        uploaded_by: user?.id ?? null,
      }).select().single();
      if (insErr) { toast.error(insErr.message); continue; }
      toast.success(`Uploaded ${file.name}`);
      if (row) {
        onPick(pub.publicUrl);
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
        onClose();
        return;
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    load();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10010] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-4 w-4 text-primary" />
            <div className="font-bold text-sm">Media Library</div>
            <div className="flex gap-1 ml-4">
              <button
                onClick={() => setTab("library")}
                className={`px-3 h-7 text-xs rounded-md ${tab === "library" ? "bg-primary text-secondary font-bold" : "hover:bg-muted"}`}
              >Library</button>
              <button
                onClick={() => setTab("upload")}
                className={`px-3 h-7 text-xs rounded-md ${tab === "upload" ? "bg-primary text-secondary font-bold" : "hover:bg-muted"}`}
              >Upload</button>
            </div>
          </div>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {tab === "library" ? (
            loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">No media yet. Switch to Upload.</div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {items.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => { onPick(it.public_url); onClose(); }}
                    className="group border border-border rounded-md overflow-hidden hover:border-primary hover:ring-2 hover:ring-primary/30 transition"
                  >
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      {it.mime_type?.startsWith("image/") ? (
                        <img src={it.public_url} alt={it.file_name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="text-[10px] text-muted-foreground p-2 text-center">{it.file_name}</div>
                      )}
                    </div>
                    <div className="px-2 py-1.5 text-[10px] truncate text-left">{it.file_name}</div>
                  </button>
                ))}
              </div>
            )
          ) : (
            <div
              className="border-2 border-dashed border-border rounded-lg py-16 text-center hover:border-primary transition cursor-pointer"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files); }}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <div className="text-sm font-bold">Drop files here or click to upload</div>
              <div className="text-xs text-muted-foreground mt-1">Images, video, PDF — uploaded to your Media Library</div>
              {uploading && <div className="mt-4 inline-flex items-center gap-2 text-xs"><Loader2 className="h-3 w-3 animate-spin" /> Uploading…</div>}
              <input
                ref={fileRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => upload(e.target.files)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
