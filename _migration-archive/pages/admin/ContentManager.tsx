import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Save,
  Trash2,
  Search,
  ExternalLink,
  FileText,
  Home,
  Users,
  HelpCircle,
  Shield,
  Star,
  Layout as LayoutIcon,
  Wrench,
  Info,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";
import BlockStylePanel, { BlockStyle } from "@/components/admin/BlockStylePanel";

type Row = {
  id: string;
  page_key: string;
  block_key: string;
  label: string;
  kind: "text" | "textarea" | "html" | "style" | "image";
  content: string;
  sort_order: number;
  enabled: boolean;
};

const PAGES: {
  key: string;
  name: string;
  icon: any;
  url?: string;
  description: string;
}[] = [
  { key: "header", name: "Header", icon: LayoutIcon, description: "Top navigation bar texts" },
  { key: "footer", name: "Footer", icon: LayoutIcon, description: "Footer columns & legal" },
  { key: "home", name: "Home", icon: Home, url: "/", description: "Homepage sections" },
  { key: "dispatchers", name: "Dispatch Team", icon: Users, url: "/", description: "Meet your dispatchers" },
  { key: "faq", name: "FAQ", icon: HelpCircle, url: "/", description: "Common questions" },
  { key: "guarantees", name: "Guarantees", icon: Shield, url: "/", description: "Trust guarantees strip" },
  { key: "trust", name: "Trust Strip", icon: Star, url: "/", description: "Press & accolades" },
  { key: "services", name: "Services", icon: Wrench, url: "/services", description: "Services catalog" },
  { key: "about", name: "About", icon: Info, url: "/about", description: "About / magazine cover" },
];

// Friendly names for grouped block prefixes
const SECTION_TITLES: Record<string, string> = {
  hero: "Hero / Banner",
  masthead: "Masthead",
  cover: "Cover Feature",
  stats: "Stats Strip",
  why: "Why Choose Us",
  how: "How It Works",
  coverage: "Coverage Map",
  cta: "Call To Action",
  trust: "Trust",
  m1: "Dispatcher #1",
  m2: "Dispatcher #2",
  m3: "Dispatcher #3",
  m4: "Dispatcher #4",
  q1: "FAQ #1",
  q2: "FAQ #2",
  q3: "FAQ #3",
  q4: "FAQ #4",
  q5: "FAQ #5",
  q6: "FAQ #6",
  q7: "FAQ #7",
  q8: "FAQ #8",
  side: "Side Card",
  title: "Title",
  subtitle: "Subtitle",
  eyebrow: "Eyebrow",
  service: "Service Item",
  footer: "Footer",
  nav: "Navigation",
  phone: "Phone",
  legal: "Legal",
  contact: "Contact",
};

// Pair FAQ questions/answers together
const PAIR_GROUPS: Record<string, string> = {
  q1: "faq_1", a1: "faq_1",
  q2: "faq_2", a2: "faq_2",
  q3: "faq_3", a3: "faq_3",
  q4: "faq_4", a4: "faq_4",
  q5: "faq_5", a5: "faq_5",
  q6: "faq_6", a6: "faq_6",
  q7: "faq_7", a7: "faq_7",
  q8: "faq_8", a8: "faq_8",
};

const FAQ_TITLES: Record<string, string> = {
  faq_1: "FAQ #1",
  faq_2: "FAQ #2",
  faq_3: "FAQ #3",
  faq_4: "FAQ #4",
  faq_5: "FAQ #5",
  faq_6: "FAQ #6",
  faq_7: "FAQ #7",
  faq_8: "FAQ #8",
};

function sectionOf(row: Row): { key: string; title: string } {
  // FAQ pairing first
  if (row.page_key === "faq" && PAIR_GROUPS[row.block_key]) {
    const k = PAIR_GROUPS[row.block_key];
    return { key: k, title: FAQ_TITLES[k] ?? k };
  }
  const prefix = row.block_key.split("_")[0];
  return {
    key: prefix,
    title: SECTION_TITLES[prefix] ?? prefix.charAt(0).toUpperCase() + prefix.slice(1),
  };
}

export default function ContentManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [dirty, setDirty] = useState<Record<string, Row>>({});
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState<string>("home");
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState<Partial<Row>>({
    page_key: "home",
    block_key: "",
    label: "",
    kind: "text",
    content: "",
    sort_order: 0,
    enabled: true,
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .order("page_key")
      .order("sort_order");
    if (error) toast.error(error.message);
    setRows((data ?? []) as Row[]);
    setDirty({});
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Counts per page
  const pageCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of rows) c[r.page_key] = (c[r.page_key] ?? 0) + 1;
    return c;
  }, [rows]);

  // Filter to active page + search (exclude style_* companion rows from main list)
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (r.page_key !== activePage) return false;
      if (r.block_key.startsWith("style_") || r.kind === "style") return false;
      if (!q) return true;
      return (
        r.label.toLowerCase().includes(q) ||
        r.block_key.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q)
      );
    });
  }, [rows, search, activePage]);

  // Lookup style row for a given text block
  const styleFor = (page: string, blockKey: string) =>
    rows.find((r) => r.page_key === page && r.block_key === `style_${blockKey}`);

  // Group into sections
  const sections = useMemo(() => {
    const map = new Map<string, { title: string; items: Row[] }>();
    for (const r of visible) {
      const s = sectionOf(r);
      const cur = map.get(s.key) ?? { title: s.title, items: [] };
      cur.items.push(r);
      map.set(s.key, cur);
    }
    // Sort sections by lowest sort_order of contents
    return Array.from(map.entries())
      .map(([k, v]) => ({
        key: k,
        title: v.title,
        items: v.items.sort((a, b) => a.sort_order - b.sort_order),
        minOrder: Math.min(...v.items.map((i) => i.sort_order)),
      }))
      .sort((a, b) => a.minOrder - b.minOrder);
  }, [visible]);

  const update = (row: Row, patch: Partial<Row>) => {
    setDirty((d) => ({ ...d, [row.id]: { ...row, ...d[row.id], ...patch } }));
  };

  const save = async (row: Row) => {
    const payload = dirty[row.id];
    if (!payload) return;
    setSavingId(row.id);
    const { error } = await supabase
      .from("site_content")
      .update({
        content: payload.content,
        label: payload.label,
        kind: payload.kind,
        sort_order: payload.sort_order,
        enabled: payload.enabled,
      })
      .eq("id", row.id);
    setSavingId(null);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, ...payload } : r)));
    setDirty((d) => {
      const c = { ...d };
      delete c[row.id];
      return c;
    });
  };

  const saveAllDirty = async () => {
    const entries = Object.values(dirty);
    if (!entries.length) return;
    for (const row of entries) await save(row);
  };

  const remove = async (row: Row) => {
    if (!confirm(`Delete "${row.label}"?`)) return;
    const { error } = await supabase.from("site_content").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const create = async () => {
    if (!draft.page_key || !draft.block_key || !draft.label) {
      return toast.error("Page, key and label required");
    }
    const { error } = await supabase.from("site_content").insert({
      page_key: draft.page_key!,
      block_key: draft.block_key!,
      label: draft.label!,
      kind: (draft.kind as any) ?? "text",
      content: draft.content ?? "",
      sort_order: draft.sort_order ?? 0,
      enabled: draft.enabled ?? true,
    });
    if (error) return toast.error(error.message);
    toast.success("Added");
    setShowNew(false);
    setDraft({
      page_key: activePage,
      block_key: "",
      label: "",
      kind: "text",
      content: "",
      sort_order: 0,
      enabled: true,
    });
    load();
  };

  const activePageInfo = PAGES.find((p) => p.key === activePage);
  const dirtyCount = Object.keys(dirty).length;

  return (
    <>
      <Helmet>
        <title>Content · Admin</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Site Content</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Edit every text block on your site. Pick a page, then edit the section you want.
            </p>
          </div>
          <div className="flex gap-2">
            {dirtyCount > 0 && (
              <Button variant="default" onClick={saveAllDirty}>
                <Save className="h-4 w-4 mr-2" /> Save all ({dirtyCount})
              </Button>
            )}
            <Button variant="outline" onClick={() => { setDraft((d) => ({ ...d, page_key: activePage })); setShowNew((v) => !v); }}>
              <Plus className="h-4 w-4 mr-2" /> New block
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Page picker */}
          <aside className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold px-2 mb-2">
              Pages
            </div>
            {PAGES.map((p) => {
              const Icon = p.icon;
              const count = pageCounts[p.key] ?? 0;
              const active = activePage === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setActivePage(p.key)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md border transition-colors ${
                    active
                      ? "bg-primary/10 border-primary/30 text-foreground"
                      : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                  </div>
                  <span className="text-[11px] bg-muted px-1.5 py-0.5 rounded font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* Editor area */}
          <div className="space-y-5 min-w-0">
            {/* Page header */}
            <div className="border border-border rounded-lg p-5 bg-card">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-primary font-bold mb-1">
                    Editing Page
                  </div>
                  <h2 className="text-xl font-bold">{activePageInfo?.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activePageInfo?.description}
                  </p>
                </div>
                {activePageInfo?.url && (
                  <a
                    href={activePageInfo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View on site
                  </a>
                )}
              </div>

              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search this page (label, text, or key)…"
                  className="pl-9"
                />
              </div>
            </div>

            {showNew && (
              <div className="border border-border rounded-lg p-4 bg-card space-y-3">
                <div className="font-semibold text-sm">New text block</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Page key</Label>
                    <Input
                      value={draft.page_key ?? ""}
                      onChange={(e) => setDraft({ ...draft, page_key: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Block key</Label>
                    <Input
                      value={draft.block_key ?? ""}
                      onChange={(e) => setDraft({ ...draft, block_key: e.target.value })}
                      placeholder="e.g. hero_title"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Kind</Label>
                    <select
                      className="w-full h-10 border border-input rounded-md bg-background px-3 text-sm"
                      value={draft.kind ?? "text"}
                      onChange={(e) => setDraft({ ...draft, kind: e.target.value as any })}
                    >
                      <option value="text">Short text</option>
                      <option value="textarea">Long text</option>
                      <option value="html">HTML</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Label (shown in admin)</Label>
                  <Input
                    value={draft.label ?? ""}
                    onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Content</Label>
                  <Textarea
                    rows={3}
                    value={draft.content ?? ""}
                    onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowNew(false)}>
                    Cancel
                  </Button>
                  <Button onClick={create}>Create block</Button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : sections.length === 0 ? (
              <div className="border border-dashed border-border rounded-lg p-10 text-center text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-3 opacity-50" />
                {search
                  ? "No blocks match your search on this page."
                  : "No content blocks on this page yet. Click \"New block\" to add one."}
              </div>
            ) : (
              <div className="space-y-5">
                {sections.map((sec) => (
                  <section
                    key={sec.key}
                    className="border border-border rounded-lg bg-card overflow-hidden"
                  >
                    <header className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Pencil className="h-3.5 w-3.5 text-primary" />
                        <h3 className="font-bold text-sm">{sec.title}</h3>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {sec.key}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {sec.items.length} {sec.items.length === 1 ? "field" : "fields"}
                      </span>
                    </header>
                    <div className="divide-y divide-border">
                      {sec.items.map((row) => {
                        const current = { ...row, ...(dirty[row.id] ?? {}) };
                        const isDirty = !!dirty[row.id];
                        return (
                          <div key={row.id} className="px-5 py-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <div className="font-semibold text-sm">{row.label}</div>
                                  {isDirty && (
                                    <span className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                                      Unsaved
                                    </span>
                                  )}
                                  {!current.enabled && (
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                                      Hidden
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                                  {row.page_key}.{row.block_key}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => update(row, { enabled: !current.enabled })}
                                  className="text-muted-foreground hover:text-foreground p-1"
                                  title={current.enabled ? "Hide" : "Show"}
                                >
                                  {current.enabled ? (
                                    <Eye className="h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => remove(row)}
                                  className="text-muted-foreground hover:text-destructive p-1"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            {current.kind === "text" ? (
                              <Input
                                value={current.content}
                                onChange={(e) => update(row, { content: e.target.value })}
                              />
                            ) : (
                              <Textarea
                                rows={current.kind === "html" ? 6 : 3}
                                value={current.content}
                                onChange={(e) => update(row, { content: e.target.value })}
                              />
                            )}
                            {isDirty && (
                              <div className="flex justify-end mt-2 gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setDirty((d) => {
                                      const c = { ...d };
                                      delete c[row.id];
                                      return c;
                                    });
                                  }}
                                >
                                  Discard
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => save(row)}
                                  disabled={savingId === row.id}
                                >
                                  {savingId === row.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                  ) : (
                                    <Save className="h-3 w-3 mr-2" />
                                  )}
                                  Save
                                </Button>
                              </div>
                            )}
                            {(() => {
                              const sRow = styleFor(row.page_key, row.block_key);
                              let initial: BlockStyle | undefined;
                              if (sRow?.content) { try { initial = JSON.parse(sRow.content); } catch {} }
                              return (
                                <BlockStylePanel
                                  pageKey={row.page_key}
                                  blockKey={row.block_key}
                                  existingRowId={sRow?.id ?? null}
                                  initial={initial}
                                  onSaved={(_style, newId) => {
                                    if (!newId) {
                                      setRows((rs) => rs.filter((r) => !(r.page_key === row.page_key && r.block_key === `style_${row.block_key}`)));
                                    } else {
                                      load();
                                    }
                                  }}
                                />
                              );
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
