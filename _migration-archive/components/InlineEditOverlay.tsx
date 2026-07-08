import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEditMode } from "@/hooks/useEditMode";
import { useSiteContent } from "@/hooks/useSiteContent";
import MediaPickerModal from "@/components/MediaPickerModal";
import {
  Save, X, Loader2, Type, Palette, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, RotateCcw, Trash2,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
   Hashing & DOM path utilities
   ============================================================ */
const hashStr = (s: string) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(36);
};
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

// Build a stable DOM path: tag[nthOfType] chain from <body>
const domPath = (el: Element): string => {
  const parts: string[] = [];
  let cur: Element | null = el;
  while (cur && cur !== document.body && cur.parentElement) {
    const parent = cur.parentElement;
    const tag = cur.tagName.toLowerCase();
    const siblings = Array.from(parent.children).filter(c => c.tagName === cur!.tagName);
    const idx = siblings.indexOf(cur);
    parts.unshift(`${tag}[${idx}]`);
    cur = parent;
  }
  return parts.join(">");
};

const isGlobalEl = (el: Element) =>
  !!el.closest("header, footer, nav[role=navigation], [data-global-region]");

/* ============================================================
   Editable text-leaf detection (text editing)
   ============================================================ */
const INLINE_TAGS = new Set([
  "SPAN","A","STRONG","EM","B","I","U","SMALL","MARK","CODE","KBD","SUP","SUB","BR","ABBR","TIME","CITE","Q","WBR",
]);
const SKIP_TAGS = new Set([
  "SCRIPT","STYLE","NOSCRIPT","SVG","PATH","INPUT","TEXTAREA","SELECT","OPTION","IFRAME","CANVAS","SOURCE",
]);

const isEditableTextLeaf = (el: Element): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  if (SKIP_TAGS.has(el.tagName)) return false;
  if (el.closest("[data-no-edit]")) return false;
  if (el.closest(".lov-edit-modal")) return false;
  if (el.closest(".lov-edit-toolbar")) return false;
  if (el.closest(".lov-edit-popover")) return false;
  const txt = norm(el.textContent || "");
  if (!txt) return false;
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) continue;
    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    const c = child as Element;
    if (INLINE_TAGS.has(c.tagName)) continue;
    if (SKIP_TAGS.has(c.tagName)) continue;
    if (c.tagName === "IMG" || c.tagName === "VIDEO" || c.tagName === "PICTURE") continue;
    return false;
  }
  return true;
};

// Any element selectable for styling (text leaves + img/video + obvious containers)
const isStylable = (el: Element): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  if (SKIP_TAGS.has(el.tagName)) return false;
  if (el.closest("[data-no-edit]")) return false;
  if (el.closest(".lov-edit-modal, .lov-edit-toolbar, .lov-edit-popover")) return false;
  return true;
};

const replaceLeafText = (el: HTMLElement, rep: string) => {
  const textNodes: Text[] = [];
  for (const n of Array.from(el.childNodes)) {
    if (n.nodeType === Node.TEXT_NODE) textNodes.push(n as Text);
    else if (n.nodeType === Node.ELEMENT_NODE) {
      const ce = n as Element;
      if (INLINE_TAGS.has(ce.tagName)) {
        for (const cn of Array.from(ce.childNodes)) {
          if (cn.nodeType === Node.TEXT_NODE) textNodes.push(cn as Text);
        }
      }
    }
  }
  if (textNodes.length === 0) { el.appendChild(document.createTextNode(rep)); return; }
  textNodes[0].textContent = rep;
  for (let i = 1; i < textNodes.length; i++) textNodes[i].textContent = "";
};

const walkLeaves = (root: ParentNode): HTMLElement[] => {
  const out: HTMLElement[] = [];
  const stack: Element[] = [root as Element];
  while (stack.length) {
    const node = stack.pop()!;
    if (!(node instanceof HTMLElement)) continue;
    if (SKIP_TAGS.has(node.tagName)) continue;
    if (node.hasAttribute("data-no-edit")) continue;
    if (isEditableTextLeaf(node)) { out.push(node); continue; }
    for (let i = node.children.length - 1; i >= 0; i--) stack.push(node.children[i]);
  }
  return out;
};

/* ============================================================
   Style override types
   ============================================================ */
type StyleOverride = {
  color?: string;
  bgColor?: string;
  fontSize?: string;       // e.g. "20px"
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: string;
  padding?: string;        // e.g. "20px"
  bgImage?: string;        // URL
  src?: string;            // for IMG
};

const applyStyle = (el: HTMLElement, s: StyleOverride) => {
  if (s.color != null) el.style.setProperty("color", s.color, "important");
  if (s.bgColor != null) el.style.setProperty("background-color", s.bgColor, "important");
  if (s.fontSize != null) el.style.setProperty("font-size", s.fontSize, "important");
  if (s.fontWeight != null) el.style.setProperty("font-weight", s.fontWeight, "important");
  if (s.fontFamily != null) el.style.setProperty("font-family", s.fontFamily, "important");
  if (s.textAlign != null) el.style.setProperty("text-align", s.textAlign, "important");
  if (s.padding != null) el.style.setProperty("padding", s.padding, "important");
  if (s.bgImage != null) {
    el.style.setProperty("background-image", `url("${s.bgImage}")`, "important");
    el.style.setProperty("background-size", "cover", "important");
    el.style.setProperty("background-position", "center", "important");
  }
  if (s.src != null && el.tagName === "IMG") {
    (el as HTMLImageElement).src = s.src;
  }
};

/* ============================================================
   Main overlay
   ============================================================ */
export default function InlineEditOverlay() {
  const { isStaff } = useAuth();
  const { enabled } = useEditMode();
  const { rows, upsert } = useSiteContent();
  const location = useLocation();
  const pageKey = location.pathname || "/";

  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [targetBox, setTargetBox] = useState<DOMRect | null>(null);
  const [tab, setTab] = useState<"text" | "style" | "bg" | "media">("text");
  const [text, setText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [style, setStyle] = useState<StyleOverride>({});
  const [original, setOriginal] = useState<StyleOverride>({});
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerFor, setPickerFor] = useState<"bg" | "src">("bg");
  const hoverRef = useRef<HTMLElement | null>(null);

  /* ---------- Build lookup maps from rows ---------- */
  const { textGlobal, textPage, styleGlobal, stylePage } = useMemo(() => {
    const tg: Record<string, string> = {};
    const tp: Record<string, string> = {};
    const sg: Record<string, StyleOverride> = {};
    const sp: Record<string, StyleOverride> = {};
    for (const r of rows) {
      if (r.kind === "style" || r.block_key.startsWith("style_")) {
        try {
          const s = JSON.parse(r.content) as StyleOverride;
          const sig = r.label || ""; // we store domPath in label for styles
          if (r.page_key === "*") sg[sig] = s; else if (r.page_key === pageKey) sp[sig] = s;
        } catch { /* ignore */ }
      } else if (r.block_key.startsWith("auto_")) {
        const orig = norm(r.label || "");
        if (!orig) continue;
        if (r.page_key === "*") tg[orig] = r.content;
        else if (r.page_key === pageKey) tp[orig] = r.content;
      }
    }
    return { textGlobal: tg, textPage: tp, styleGlobal: sg, stylePage: sp };
  }, [rows, pageKey]);

  /* ---------- Apply overrides to DOM ---------- */
  useEffect(() => {
    const textOverrides = { ...textGlobal, ...textPage };
    const styleOverrides = { ...styleGlobal, ...stylePage };
    if (!Object.keys(textOverrides).length && !Object.keys(styleOverrides).length) return;

    let raf = 0;
    const apply = () => {
      // text
      const leaves = walkLeaves(document.body);
      for (const el of leaves) {
        const t = norm(el.textContent || "");
        const rep = textOverrides[t];
        if (rep != null && el.getAttribute("data-lov-overridden") !== rep) {
          replaceLeafText(el, rep);
          el.setAttribute("data-lov-overridden", rep);
        }
      }
      // styles — walk all elements
      const all = document.body.querySelectorAll<HTMLElement>("*");
      for (const el of Array.from(all)) {
        if (SKIP_TAGS.has(el.tagName)) continue;
        if (el.closest(".lov-edit-toolbar, .lov-edit-popover, .lov-edit-modal")) continue;
        const sig = domPath(el);
        const s = styleOverrides[sig];
        if (s && el.getAttribute("data-lov-styled") !== sig) {
          applyStyle(el, s);
          el.setAttribute("data-lov-styled", sig);
        }
      }
    };
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); };
    schedule();
    const obs = new MutationObserver(schedule);
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [textGlobal, textPage, styleGlobal, stylePage]);

  /* ---------- Hover highlight + click handler ---------- */
  useEffect(() => {
    if (!isStaff || !enabled) return;
    document.body.classList.add("lov-edit-on");

    const onMove = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest(".lov-edit-toolbar, .lov-edit-popover, .lov-edit-modal")) {
        if (hoverRef.current) hoverRef.current.classList.remove("lov-edit-hover");
        hoverRef.current = null; return;
      }
      const candidate = isStylable(el) ? el : null;
      if (hoverRef.current && hoverRef.current !== candidate) {
        hoverRef.current.classList.remove("lov-edit-hover");
      }
      if (candidate) {
        candidate.classList.add("lov-edit-hover");
        hoverRef.current = candidate;
      } else hoverRef.current = null;
    };

    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest(".lov-edit-toolbar, .lov-edit-popover, .lov-edit-modal")) return;
      if (!isStylable(el)) return;
      e.preventDefault();
      e.stopPropagation();
      openFor(el);
    };

    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      if (hoverRef.current) hoverRef.current.classList.remove("lov-edit-hover");
      document.body.classList.remove("lov-edit-on");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStaff, enabled]);

  /* ---------- Open style panel for an element ---------- */
  const openFor = (el: HTMLElement) => {
    setTarget(el);
    setTargetBox(el.getBoundingClientRect());

    // Text seed
    const isLeaf = isEditableTextLeaf(el);
    const t = isLeaf ? norm(el.textContent || "") : "";
    setOriginalText(t);
    setText(t);

    // Style seed — read existing override OR computed style
    const sig = domPath(el);
    const existing = (isGlobalEl(el) ? styleGlobal[sig] : stylePage[sig]) || {};
    setStyle({ ...existing });
    setOriginal({ ...existing });

    // Default tab
    if (el.tagName === "IMG") setTab("media");
    else if (isLeaf) setTab("text");
    else setTab("style");
  };

  const close = () => {
    setTarget(null);
    setTargetBox(null);
  };

  /* ---------- Live preview ---------- */
  useEffect(() => {
    if (!target) return;
    applyStyle(target, style);
  }, [style, target]);

  /* ---------- Save ---------- */
  const save = async () => {
    if (!target) return;
    setSaving(true);
    const isGlobal = isGlobalEl(target);
    const scope = isGlobal ? "*" : pageKey;
    const sig = domPath(target);

    // 1. Save text if changed
    if (originalText && text !== originalText) {
      const key = "auto_" + hashStr(originalText);
      await upsert(scope, key, text, originalText, text.length > 80 ? "textarea" : "text");
      try { replaceLeafText(target, text); } catch {}
    }
    // 2. Save style override (only non-empty values)
    const cleaned: StyleOverride = {};
    (Object.keys(style) as (keyof StyleOverride)[]).forEach(k => {
      const v = style[k];
      if (v != null && v !== "") cleaned[k] = v;
    });
    const styleKey = "style_" + hashStr(scope + "|" + sig);
    if (Object.keys(cleaned).length === 0) {
      // nothing — but if original had values, we'd ideally delete. Save empty JSON.
      if (Object.keys(original).length > 0) {
        await upsert(scope, styleKey, "{}", sig, "style");
      }
    } else {
      await upsert(scope, styleKey, JSON.stringify(cleaned), sig, "style");
      target.setAttribute("data-lov-styled", sig);
    }
    setSaving(false);
    toast.success(isGlobal ? "Saved (site-wide)" : "Saved");
    close();
  };

  /* ---------- Reset all styles for this element ---------- */
  const resetAll = () => {
    if (!target) return;
    target.removeAttribute("style");
    target.removeAttribute("data-lov-styled");
    setStyle({});
  };

  if (!isStaff) return null;

  const isLeaf = target ? isEditableTextLeaf(target) : false;
  const isImg = target?.tagName === "IMG";

  /* ---------- Toolbar position ---------- */
  let panelStyle: React.CSSProperties = {};
  if (targetBox) {
    const top = targetBox.bottom + 8 + window.scrollY;
    const left = Math.max(8, Math.min(window.innerWidth - 380 - 8, targetBox.left + window.scrollX));
    panelStyle = { top, left };
  }

  return (
    <>
      <style>{`
        body.lov-edit-on { cursor: default; }
        body.lov-edit-on .lov-edit-hover {
          outline: 2px dashed hsl(var(--primary, 45 100% 50%)) !important;
          outline-offset: 2px !important;
          background-color: hsla(45, 100%, 50%, 0.06) !important;
          cursor: pointer !important;
        }
        .lov-edit-selected {
          outline: 2px solid hsl(var(--primary, 45 100% 50%)) !important;
          outline-offset: 2px !important;
        }
      `}</style>

      {target && (
        <>
          {/* backdrop catches outside clicks */}
          <div
            className="lov-edit-popover fixed inset-0 z-[9998]"
            onClick={() => !saving && close()}
          />
          <div
            className="lov-edit-toolbar absolute z-[9999] w-[380px] bg-background border border-border rounded-lg shadow-2xl"
            style={panelStyle}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-muted/30 rounded-t-lg">
              <div className="flex items-center gap-2 min-w-0">
                <div className="text-[10px] font-mono uppercase font-bold text-primary truncate">
                  {target.tagName.toLowerCase()}{isGlobalEl(target) ? " · global" : ""}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={resetAll}
                  title="Reset all styles"
                  className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center text-muted-foreground"
                ><RotateCcw className="h-3.5 w-3.5" /></button>
                <button onClick={close} className="h-7 w-7 rounded hover:bg-muted flex items-center justify-center">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border text-xs">
              {isLeaf && (
                <TabBtn active={tab === "text"} onClick={() => setTab("text")} icon={<Type className="h-3 w-3" />} label="Text" />
              )}
              <TabBtn active={tab === "style"} onClick={() => setTab("style")} icon={<Palette className="h-3 w-3" />} label="Style" />
              <TabBtn active={tab === "bg"} onClick={() => setTab("bg")} icon={<Palette className="h-3 w-3" />} label="Background" />
              {isImg && (
                <TabBtn active={tab === "media"} onClick={() => setTab("media")} icon={<ImageIcon className="h-3 w-3" />} label="Image" />
              )}
            </div>

            {/* Body */}
            <div className="p-3 max-h-[60vh] overflow-y-auto">
              {tab === "text" && isLeaf && (
                <div className="space-y-2">
                  <Label>Text content</Label>
                  {(text.length > 80 || originalText.length > 80) ? (
                    <textarea
                      autoFocus
                      rows={5}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full px-2 py-1.5 border border-input rounded text-sm resize-y bg-background"
                    />
                  ) : (
                    <input
                      autoFocus
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full h-9 px-2 border border-input rounded text-sm bg-background"
                    />
                  )}
                  <div className="text-[10px] text-muted-foreground italic">Original: {originalText}</div>
                </div>
              )}

              {tab === "style" && (
                <div className="space-y-3">
                  <Row label="Text color">
                    <ColorInput value={style.color} onChange={(v) => setStyle(s => ({ ...s, color: v }))} />
                  </Row>
                  <Row label="Font size">
                    <SizeInput value={style.fontSize} onChange={(v) => setStyle(s => ({ ...s, fontSize: v }))} min={10} max={120} />
                  </Row>
                  <Row label="Font weight">
                    <select
                      value={style.fontWeight ?? ""}
                      onChange={(e) => setStyle(s => ({ ...s, fontWeight: e.target.value || undefined }))}
                      className="h-8 px-2 border border-input rounded text-xs bg-background w-full"
                    >
                      <option value="">— default —</option>
                      {["300","400","500","600","700","800","900"].map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </Row>
                  <Row label="Font family">
                    <select
                      value={style.fontFamily ?? ""}
                      onChange={(e) => setStyle(s => ({ ...s, fontFamily: e.target.value || undefined }))}
                      className="h-8 px-2 border border-input rounded text-xs bg-background w-full"
                    >
                      <option value="">— default —</option>
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="ui-sans-serif, system-ui, sans-serif">System Sans</option>
                      <option value="Georgia, serif">Serif (Georgia)</option>
                      <option value="ui-monospace, monospace">Monospace</option>
                      <option value="'Helvetica Neue', Arial, sans-serif">Helvetica</option>
                      <option value="'Times New Roman', serif">Times New Roman</option>
                    </select>
                  </Row>
                  <Row label="Alignment">
                    <div className="flex gap-1">
                      {[
                        { v: "left", icon: AlignLeft },
                        { v: "center", icon: AlignCenter },
                        { v: "right", icon: AlignRight },
                        { v: "justify", icon: AlignJustify },
                      ].map(({ v, icon: Icon }) => (
                        <button
                          key={v}
                          onClick={() => setStyle(s => ({ ...s, textAlign: s.textAlign === v ? undefined : v }))}
                          className={`h-8 w-8 rounded border ${style.textAlign === v ? "border-primary bg-primary/10" : "border-input hover:bg-muted"}`}
                        ><Icon className="h-3.5 w-3.5 mx-auto" /></button>
                      ))}
                    </div>
                  </Row>
                </div>
              )}

              {tab === "bg" && (
                <div className="space-y-3">
                  <Row label="Background color">
                    <ColorInput value={style.bgColor} onChange={(v) => setStyle(s => ({ ...s, bgColor: v }))} />
                  </Row>
                  <Row label="Padding">
                    <SizeInput value={style.padding} onChange={(v) => setStyle(s => ({ ...s, padding: v }))} min={0} max={120} />
                  </Row>
                  <Row label="Background image">
                    <div className="flex flex-col gap-1 w-full">
                      {style.bgImage && (
                        <div className="border border-border rounded overflow-hidden h-20 bg-muted">
                          <img src={style.bgImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setPickerFor("bg"); setPickerOpen(true); }}
                          className="flex-1 h-8 text-xs rounded bg-primary text-secondary font-bold hover:opacity-90"
                        >Pick / upload image</button>
                        {style.bgImage && (
                          <button
                            onClick={() => setStyle(s => ({ ...s, bgImage: undefined }))}
                            className="h-8 w-8 rounded border border-input hover:bg-destructive/10 text-destructive flex items-center justify-center"
                          ><Trash2 className="h-3.5 w-3.5" /></button>
                        )}
                      </div>
                    </div>
                  </Row>
                </div>
              )}

              {tab === "media" && isImg && (
                <div className="space-y-3">
                  <Row label="Current image">
                    <div className="border border-border rounded overflow-hidden h-24 bg-muted w-full">
                      <img src={style.src ?? (target as HTMLImageElement).src} alt="" className="w-full h-full object-contain" />
                    </div>
                  </Row>
                  <Row label="Replace">
                    <div className="flex gap-1 w-full">
                      <button
                        onClick={() => { setPickerFor("src"); setPickerOpen(true); }}
                        className="flex-1 h-8 text-xs rounded bg-primary text-secondary font-bold hover:opacity-90"
                      >Pick / upload image</button>
                      {style.src && (
                        <button
                          onClick={() => setStyle(s => ({ ...s, src: undefined }))}
                          className="h-8 w-8 rounded border border-input hover:bg-destructive/10 text-destructive flex items-center justify-center"
                        ><Trash2 className="h-3.5 w-3.5" /></button>
                      )}
                    </div>
                  </Row>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-border flex items-center justify-between gap-2 bg-muted/20 rounded-b-lg">
              <div className="text-[10px] text-muted-foreground">
                {isGlobalEl(target) ? "Applies site-wide" : `On ${pageKey}`}
              </div>
              <div className="flex gap-1">
                <button onClick={close} disabled={saving} className="px-3 h-8 text-xs rounded hover:bg-muted">Cancel</button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-3 h-8 text-xs rounded bg-primary text-secondary font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(url) => {
          if (pickerFor === "bg") setStyle(s => ({ ...s, bgImage: url }));
          else setStyle(s => ({ ...s, src: url }));
        }}
      />
    </>
  );
}

/* ============================================================
   Small UI helpers
   ============================================================ */
const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{children}</div>
);

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-[110px_1fr] items-center gap-2">
    <Label>{label}</Label>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

const TabBtn = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 h-9 flex items-center justify-center gap-1.5 text-xs font-bold transition ${
      active ? "bg-background text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-muted"
    }`}
  >
    {icon}{label}
  </button>
);

const ColorInput = ({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) => (
  <div className="flex items-center gap-1 w-full">
    <input
      type="color"
      value={value || "#000000"}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-10 rounded border border-input cursor-pointer p-0.5 bg-background"
    />
    <input
      type="text"
      value={value || ""}
      placeholder="—"
      onChange={(e) => onChange(e.target.value || undefined)}
      className="h-8 flex-1 px-2 border border-input rounded text-xs font-mono bg-background"
    />
    {value && (
      <button
        onClick={() => onChange(undefined)}
        className="h-8 w-8 rounded border border-input hover:bg-muted text-muted-foreground flex items-center justify-center"
        title="Clear"
      ><X className="h-3 w-3" /></button>
    )}
  </div>
);

const SizeInput = ({ value, onChange, min, max }: { value?: string; onChange: (v: string | undefined) => void; min: number; max: number }) => {
  const num = value ? parseInt(value, 10) : null;
  return (
    <div className="flex items-center gap-1 w-full">
      <input
        type="range"
        min={min}
        max={max}
        value={num ?? min}
        onChange={(e) => onChange(`${e.target.value}px`)}
        className="flex-1"
      />
      <input
        type="text"
        value={value || ""}
        placeholder="—"
        onChange={(e) => onChange(e.target.value || undefined)}
        className="h-8 w-16 px-2 border border-input rounded text-xs font-mono bg-background"
      />
      {value && (
        <button
          onClick={() => onChange(undefined)}
          className="h-8 w-8 rounded border border-input hover:bg-muted text-muted-foreground flex items-center justify-center"
          title="Clear"
        ><X className="h-3 w-3" /></button>
      )}
    </div>
  );
};
