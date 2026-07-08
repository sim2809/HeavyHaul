import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown, Save } from "lucide-react";

type Menu = { id: string; location: string; name: string };
type Item = { id: string; menu_id: string; label: string; url: string; open_in_new_tab: boolean; sort_order: number; enabled: boolean; icon: string | null };

export default function NavigationManager() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [newMenu, setNewMenu] = useState<{ location: string; name: string } | null>(null);

  const loadMenus = async () => {
    const { data } = await supabase.from("nav_menus").select("*").order("location");
    const list = (data as any) || [];
    setMenus(list);
    if (!activeId && list[0]) setActiveId(list[0].id);
  };
  const loadItems = async () => {
    if (!activeId) { setItems([]); return; }
    const { data } = await supabase.from("nav_items").select("*").eq("menu_id", activeId).order("sort_order");
    setItems((data as any) || []);
  };
  useEffect(() => { loadMenus(); }, []);
  useEffect(() => { loadItems(); }, [activeId]);

  const createMenu = async () => {
    if (!newMenu?.location || !newMenu?.name) return toast.error("Location key and name required");
    const { error } = await supabase.from("nav_menus").insert(newMenu);
    if (error) return toast.error(error.message);
    setNewMenu(null);
    loadMenus();
  };
  const deleteMenu = async (id: string) => {
    if (!confirm("Delete this menu and all its items?")) return;
    await supabase.from("nav_menus").delete().eq("id", id);
    setActiveId(null);
    loadMenus();
  };

  const addItem = async () => {
    if (!activeId) return;
    const { data, error } = await supabase.from("nav_items").insert({
      menu_id: activeId, label: "New link", url: "/", sort_order: items.length,
    }).select().single();
    if (error) return toast.error(error.message);
    setItems([...items, data as any]);
  };
  const patchItem = (id: string, p: Partial<Item>) => setItems(items.map((i) => i.id === id ? { ...i, ...p } : i));
  const saveItem = async (it: Item) => {
    const { error } = await supabase.from("nav_items").update({
      label: it.label, url: it.url, open_in_new_tab: it.open_in_new_tab, enabled: it.enabled, icon: it.icon,
    }).eq("id", it.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  };
  const removeItem = async (id: string) => {
    if (!confirm("Delete link?")) return;
    await supabase.from("nav_items").delete().eq("id", id);
    setItems(items.filter((i) => i.id !== id));
  };
  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    const reordered = next.map((it, i) => ({ ...it, sort_order: i }));
    setItems(reordered);
    await Promise.all(reordered.map((it) => supabase.from("nav_items").update({ sort_order: it.sort_order }).eq("id", it.id)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Navigation</h1>
          <p className="text-sm text-muted-foreground">Manage header and footer menus. Drop <code>&lt;CmsMenu location="…" /&gt;</code> anywhere to render.</p>
        </div>
        <Button onClick={() => setNewMenu({ location: "", name: "" })}><Plus className="h-4 w-4 mr-1" /> New menu</Button>
      </div>

      {newMenu && (
        <Card className="p-4 mb-6 grid md:grid-cols-3 gap-3 items-end">
          <div><Label className="text-xs">Location key</Label><Input value={newMenu.location} onChange={(e) => setNewMenu({ ...newMenu, location: e.target.value })} placeholder="header_secondary" /></div>
          <div><Label className="text-xs">Display name</Label><Input value={newMenu.name} onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })} placeholder="Header — Secondary" /></div>
          <div className="flex gap-2"><Button onClick={createMenu}>Create</Button><Button variant="outline" onClick={() => setNewMenu(null)}>Cancel</Button></div>
        </Card>
      )}

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-3 h-fit">
          <div className="text-xs uppercase tracking-wider text-muted-foreground px-2 py-1">Menus</div>
          {menus.map((m) => (
            <button key={m.id} onClick={() => setActiveId(m.id)} className={`w-full text-left px-3 py-2 rounded text-sm ${activeId === m.id ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"}`}>
              <div>{m.name}</div>
              <div className="text-[10px] font-mono text-muted-foreground">{m.location}</div>
            </button>
          ))}
        </Card>

        <div className="md:col-span-3">
          {activeId && (
            <>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold">Links</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => deleteMenu(activeId)}>Delete menu</Button>
                  <Button size="sm" onClick={addItem}><Plus className="h-4 w-4 mr-1" /> Add link</Button>
                </div>
              </div>
              <div className="space-y-2">
                {items.length === 0 && <Card className="p-6 text-center text-muted-foreground text-sm">No links yet.</Card>}
                {items.map((it, i) => (
                  <Card key={it.id} className="p-3 space-y-2">
                    <div className="grid md:grid-cols-2 gap-2">
                      <Input placeholder="Label" value={it.label} onChange={(e) => patchItem(it.id, { label: e.target.value })} />
                      <Input placeholder="URL (/about or https://…)" value={it.url} onChange={(e) => patchItem(it.id, { url: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <label className="flex items-center gap-2 text-sm"><Switch checked={it.enabled} onCheckedChange={(v) => patchItem(it.id, { enabled: v })} /> Enabled</label>
                      <label className="flex items-center gap-2 text-sm"><Switch checked={it.open_in_new_tab} onCheckedChange={(v) => patchItem(it.id, { open_in_new_tab: v })} /> Open in new tab</label>
                      <Input className="w-32" placeholder="Icon (lucide)" value={it.icon || ""} onChange={(e) => patchItem(it.id, { icon: e.target.value })} />
                      <div className="flex-1" />
                      <Button size="icon" variant="ghost" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => move(i, 1)} disabled={i === items.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                      <Button size="sm" onClick={() => saveItem(it)}><Save className="h-3 w-3 mr-1" /> Save</Button>
                      <Button size="icon" variant="ghost" onClick={() => removeItem(it.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
