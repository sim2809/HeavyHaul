// Per-block visual style editor used inside the admin Content Manager.
// Reads/writes a companion site_content row keyed `style_<block_key>` containing JSON.
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Palette, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export type BlockStyle = {
  color?: string;
  backgroundColor?: string;
  fontSize?: number | string;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  letterSpacing?: string;
  lineHeight?: string;
};

const FONT_FAMILIES = [
  { v: "", label: "Default" },
  { v: "Inter, system-ui, sans-serif", label: "Inter" },
  { v: "'Bebas Neue', Impact, sans-serif", label: "Bebas Neue" },
  { v: "'Playfair Display', Georgia, serif", label: "Playfair Display" },
  { v: "'Roboto Mono', ui-monospace, monospace", label: "Roboto Mono" },
  { v: "Georgia, 'Times New Roman', serif", label: "Georgia" },
  { v: "system-ui, sans-serif", label: "System UI" },
];

const WEIGHTS = ["", "300", "400", "500", "600", "700", "800", "900"];

export default function BlockStylePanel({
  pageKey,
  blockKey,
  existingRowId,
  initial,
  onSaved,
}: {
  pageKey: string;
  blockKey: string;
  existingRowId?: string | null;
  initial?: BlockStyle;
  onSaved?: (style: BlockStyle, rowId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<BlockStyle>(initial ?? {});
  const [saving, setSaving] = useState(false);

  useEffect(() => { setStyle(initial ?? {}); }, [initial, existingRowId]);

  const hasAny = Object.values(style).some((v) => v !== "" && v !== undefined && v !== null);

  const save = async () => {
    setSaving(true);
    const cleaned: BlockStyle = {};
    (Object.keys(style) as (keyof BlockStyle)[]).forEach((k) => {
      const v = style[k] as any;
      if (v !== "" && v !== undefined && v !== null) (cleaned as any)[k] = v;
    });
    const content = JSON.stringify(cleaned);
    const styleBlockKey = `style_${blockKey}`;
    if (existingRowId) {
      const { error } = await supabase.from("site_content").update({ content }).eq("id", existingRowId);
      if (error) { setSaving(false); return toast.error(error.message); }
      onSaved?.(cleaned, existingRowId);
    } else {
      const { data, error } = await supabase
        .from("site_content")
        .insert({
          page_key: pageKey,
          block_key: styleBlockKey,
          label: `Style · ${blockKey}`,
          kind: "style",
          content,
          sort_order: 999,
          enabled: true,
        })
        .select()
        .single();
      if (error) { setSaving(false); return toast.error(error.message); }
      onSaved?.(cleaned, data!.id);
    }
    setSaving(false);
    toast.success("Style saved");
  };

  const reset = async () => {
    if (!existingRowId) { setStyle({}); return; }
    if (!confirm("Remove all custom styling for this block?")) return;
    const { error } = await supabase.from("site_content").delete().eq("id", existingRowId);
    if (error) return toast.error(error.message);
    setStyle({});
    onSaved?.({}, "");
    toast.success("Reset to default");
  };

  return (
    <div className="mt-2 border border-border/60 rounded-md bg-muted/20">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-muted/40 rounded-md"
      >
        <span className="inline-flex items-center gap-2">
          <Palette className="h-3.5 w-3.5 text-primary" />
          Style: font, size, color
          {hasAny && <span className="text-[10px] uppercase tracking-wider text-primary">Customized</span>}
        </span>
        <span className="text-muted-foreground">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="p-3 space-y-3 border-t border-border/60">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <Label className="text-[10px] uppercase tracking-wider">Text color</Label>
              <div className="flex gap-1 items-center">
                <input
                  type="color"
                  value={style.color || "#000000"}
                  onChange={(e) => setStyle({ ...style, color: e.target.value })}
                  className="h-9 w-12 border border-input rounded cursor-pointer bg-background"
                />
                <Input
                  value={style.color || ""}
                  onChange={(e) => setStyle({ ...style, color: e.target.value })}
                  placeholder="#000 or rgb()"
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider">Background</Label>
              <div className="flex gap-1 items-center">
                <input
                  type="color"
                  value={style.backgroundColor || "#ffffff"}
                  onChange={(e) => setStyle({ ...style, backgroundColor: e.target.value })}
                  className="h-9 w-12 border border-input rounded cursor-pointer bg-background"
                />
                <Input
                  value={style.backgroundColor || ""}
                  onChange={(e) => setStyle({ ...style, backgroundColor: e.target.value })}
                  placeholder="transparent"
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider">Font size (px)</Label>
              <Input
                type="number"
                min={8}
                max={200}
                value={typeof style.fontSize === "number" ? style.fontSize : (style.fontSize ? parseInt(String(style.fontSize)) || "" : "")}
                onChange={(e) => setStyle({ ...style, fontSize: e.target.value ? Number(e.target.value) : "" })}
                className="h-9 text-xs"
                placeholder="—"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider">Weight</Label>
              <select
                value={style.fontWeight || ""}
                onChange={(e) => setStyle({ ...style, fontWeight: e.target.value })}
                className="w-full h-9 border border-input rounded-md bg-background px-2 text-xs"
              >
                {WEIGHTS.map((w) => <option key={w} value={w}>{w || "Default"}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <Label className="text-[10px] uppercase tracking-wider">Font family</Label>
              <select
                value={style.fontFamily || ""}
                onChange={(e) => setStyle({ ...style, fontFamily: e.target.value })}
                className="w-full h-9 border border-input rounded-md bg-background px-2 text-xs"
              >
                {FONT_FAMILIES.map((f) => <option key={f.label} value={f.v}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider">Align</Label>
              <select
                value={style.textAlign || ""}
                onChange={(e) => setStyle({ ...style, textAlign: e.target.value as any })}
                className="w-full h-9 border border-input rounded-md bg-background px-2 text-xs"
              >
                <option value="">Default</option>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider">Line height</Label>
              <Input
                value={style.lineHeight || ""}
                onChange={(e) => setStyle({ ...style, lineHeight: e.target.value })}
                placeholder="1.5"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div
            className="border border-dashed border-border rounded p-3 text-sm"
            style={{
              color: style.color,
              backgroundColor: style.backgroundColor,
              fontSize: style.fontSize ? (typeof style.fontSize === "number" ? `${style.fontSize}px` : style.fontSize) : undefined,
              fontWeight: style.fontWeight as any,
              fontFamily: style.fontFamily,
              textAlign: style.textAlign,
              lineHeight: style.lineHeight,
            }}
          >
            Preview — the quick brown fox jumps over the lazy dog.
          </div>

          <div className="flex justify-end gap-2">
            {existingRowId && (
              <Button size="sm" variant="ghost" onClick={reset}>
                <RotateCcw className="h-3 w-3 mr-1" /> Reset
              </Button>
            )}
            <Button size="sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
              Save style
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
