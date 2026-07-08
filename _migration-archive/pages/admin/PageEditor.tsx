import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Save, Copy, Eye, EyeOff, GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SECTION_EDITORS, SECTION_TYPE_LABELS, SECTION_DEFAULTS } from "@/components/admin/SectionEditors";

type Page = { id: string; slug: string; title: string; description: string | null; enabled: boolean };
type Section = { id: string; page_id: string; type: string; name: string | null; sort_order: number; enabled: boolean; data: any };

const SECTION_TYPES = Object.keys(SECTION_DEFAULTS);

function SortableSection({
  s, idx, onPatch, onSave, onDelete, onDuplicate,
}: {
  s: Section; idx: number;
  onPatch: (patch: Partial<Section>) => void;
  onSave: () => void; onDelete: () => void; onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: s.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const [open, setOpen] = useState(false);
  const Editor = SECTION_EDITORS[s.type];

  return (
    <Card ref={setNodeRef} style={style} className="p-3">
      <div className="flex items-center gap-2">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1" aria-label="Drag to reorder">
          <GripVertical className="h-4 w-4" />
        </button>
        <button onClick={() => setOpen(!open)} className="p-1 text-muted-foreground hover:text-foreground">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-muted rounded uppercase tracking-wider">{SECTION_TYPE_LABELS[s.type] || s.type}</span>
        <Input className="h-7 flex-1 max-w-xs" value={s.name || ""} onChange={(e) => onPatch({ name: e.target.value })} placeholder="Section name" />
        <button
          onClick={() => { onPatch({ enabled: !s.enabled }); }}
          className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold ${s.enabled ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}`}
          title={s.enabled ? "Published — click to unpublish" : "Hidden — click to publish"}
        >
          {s.enabled ? <Eye className="h-3 w-3 inline mr-1" /> : <EyeOff className="h-3 w-3 inline mr-1" />}
          {s.enabled ? "Published" : "Hidden"}
        </button>
        <Button size="icon" variant="ghost" onClick={onDuplicate} title="Duplicate"><Copy className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={onDelete} title="Delete"><Trash2 className="h-4 w-4" /></Button>
      </div>

      {open && (
        <div className="mt-3 pl-8 space-y-3">
          {Editor ? (
            <Editor value={s.data} onChange={(data) => onPatch({ data })} />
          ) : (
            <Textarea rows={8} className="font-mono text-xs"
              value={JSON.stringify(s.data, null, 2)}
              onChange={(e) => { try { onPatch({ data: JSON.parse(e.target.value) }); } catch {} }} />
          )}
          <div className="flex justify-end">
            <Button size="sm" onClick={onSave}><Save className="h-3 w-3 mr-1" /> Save section</Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function PageEditor() {
  const { id } = useParams();
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from("pages").select("*").eq("id", id!).maybeSingle(),
      supabase.from("page_sections").select("*").eq("page_id", id!).order("sort_order"),
    ]);
    setPage(p as any);
    setSections((s as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);

  const savePage = async () => {
    if (!page) return;
    setSaving(true);
    const { error } = await supabase.from("pages").update({
      title: page.title, description: page.description, enabled: page.enabled, slug: page.slug,
    }).eq("id", page.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Page saved");
  };

  const addSection = async (type: string) => {
    const sort_order = sections.length;
    const { data, error } = await supabase.from("page_sections").insert({
      page_id: id!, type, name: SECTION_TYPE_LABELS[type] || type, sort_order, data: SECTION_DEFAULTS[type] || {},
    }).select().single();
    if (error) return toast.error(error.message);
    setSections([...sections, data as any]);
  };

  const patchSection = (sid: string, patch: Partial<Section>) =>
    setSections(sections.map((s) => (s.id === sid ? { ...s, ...patch } : s)));

  const saveSection = async (s: Section) => {
    const { error } = await supabase.from("page_sections").update({
      type: s.type, name: s.name, enabled: s.enabled, data: s.data,
    }).eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Section saved");
  };

  const deleteSection = async (sid: string) => {
    if (!confirm("Delete section?")) return;
    await supabase.from("page_sections").delete().eq("id", sid);
    setSections(sections.filter((s) => s.id !== sid));
  };

  const duplicateSection = async (s: Section) => {
    const { data, error } = await supabase.from("page_sections").insert({
      page_id: id!, type: s.type, name: `${s.name || s.type} (copy)`, sort_order: sections.length, enabled: s.enabled, data: s.data,
    }).select().single();
    if (error) return toast.error(error.message);
    setSections([...sections, data as any]);
    toast.success("Duplicated");
  };

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = sections.findIndex((s) => s.id === active.id);
    const newIdx = sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sections, oldIdx, newIdx).map((s, i) => ({ ...s, sort_order: i }));
    setSections(reordered);
    await Promise.all(reordered.map((s) => supabase.from("page_sections").update({ sort_order: s.sort_order }).eq("id", s.id)));
  };

  // Toggle visibility immediately on click (no need to open the section)
  useEffect(() => {
    // when a section's enabled flag is changed locally, persist
  }, []);

  if (loading) return <div>Loading…</div>;
  if (!page) return <div>Page not found.</div>;

  return (
    <div>
      <Link to="/admin/pages" className="text-sm text-muted-foreground inline-flex items-center mb-4 hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> All pages
      </Link>

      <Card className="p-6 mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit: {page.title}</h1>
          <div className="flex items-center gap-3">
            <Switch checked={page.enabled} onCheckedChange={(v) => setPage({ ...page, enabled: v })} />
            <span className="text-sm">{page.enabled ? "Published" : "Draft"}</span>
            <Button onClick={savePage} disabled={saving}><Save className="h-4 w-4 mr-1" /> Save page</Button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label className="text-xs">Slug</Label><Input value={page.slug} onChange={(e) => setPage({ ...page, slug: e.target.value })} /></div>
          <div><Label className="text-xs">Title</Label><Input value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} /></div>
        </div>
        <div><Label className="text-xs">Description</Label><Textarea rows={2} value={page.description || ""} onChange={(e) => setPage({ ...page, description: e.target.value })} /></div>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Sections ({sections.length})</h2>
        <select className="border rounded px-3 py-2 text-sm bg-background"
          onChange={(e) => { if (e.target.value) { addSection(e.target.value); e.target.value = ""; } }}>
          <option value="">+ Add section…</option>
          {SECTION_TYPES.map((t) => <option key={t} value={t}>{SECTION_TYPE_LABELS[t] || t}</option>)}
        </select>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sections.length === 0 && (
              <Card className="p-8 text-center text-muted-foreground">No sections yet. Add your first one above.</Card>
            )}
            {sections.map((s, i) => (
              <SortableSection
                key={s.id} s={s} idx={i}
                onPatch={(patch) => {
                  patchSection(s.id, patch);
                  if ("enabled" in patch) {
                    supabase.from("page_sections").update({ enabled: patch.enabled }).eq("id", s.id).then(() => {});
                  }
                }}
                onSave={() => {
                  const cur = sections.find((x) => x.id === s.id);
                  if (cur) saveSection(cur);
                }}
                onDelete={() => deleteSection(s.id)}
                onDuplicate={() => duplicateSection(s)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
