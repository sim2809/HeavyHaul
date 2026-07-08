// Per-type structured editors for CMS section blocks. Each editor receives a `value`
// (the section.data object) and a `onChange` setter. Keeps everything as plain forms
// — no JSON typing required from admins.
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Props<T = any> = { value: T; onChange: (v: T) => void };

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <Label className="text-xs">{label}</Label>
    {children}
  </div>
);

const RepeatList = ({
  items, onChange, render, label, defaultItem,
}: {
  items: any[]; onChange: (i: any[]) => void;
  render: (item: any, i: number, set: (patch: any) => void) => React.ReactNode;
  label: string; defaultItem: any;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label className="text-xs">{label} ({items.length})</Label>
      <Button size="sm" variant="outline" onClick={() => onChange([...items, defaultItem])}>
        <Plus className="h-3 w-3 mr-1" /> Add
      </Button>
    </div>
    {items.map((it, i) => (
      <div key={i} className="border border-border rounded p-3 space-y-2 bg-muted/20">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase text-muted-foreground tracking-wider">#{i + 1}</span>
          <Button size="icon" variant="ghost" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        {render(it, i, (patch) => onChange(items.map((x, j) => j === i ? { ...x, ...patch } : x)))}
      </div>
    ))}
  </div>
);

export function HeroEditor({ value, onChange }: Props) {
  const v = value || {};
  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Eyebrow"><Input value={v.eyebrow || ""} onChange={(e) => onChange({ ...v, eyebrow: e.target.value })} /></Field>
        <Field label="Image URL"><Input value={v.image || ""} onChange={(e) => onChange({ ...v, image: e.target.value })} placeholder="https://…" /></Field>
      </div>
      <Field label="Headline *"><Input value={v.headline || ""} onChange={(e) => onChange({ ...v, headline: e.target.value })} /></Field>
      <Field label="Subheadline"><Textarea rows={2} value={v.subheadline || ""} onChange={(e) => onChange({ ...v, subheadline: e.target.value })} /></Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="CTA label"><Input value={v.cta_label || ""} onChange={(e) => onChange({ ...v, cta_label: e.target.value })} /></Field>
        <Field label="CTA href"><Input value={v.cta_href || ""} onChange={(e) => onChange({ ...v, cta_href: e.target.value })} placeholder="/contact" /></Field>
      </div>
    </div>
  );
}

export function CtaEditor({ value, onChange }: Props) {
  const v = value || {};
  return (
    <div className="space-y-3">
      <Field label="Headline *"><Input value={v.headline || ""} onChange={(e) => onChange({ ...v, headline: e.target.value })} /></Field>
      <Field label="Subheadline"><Textarea rows={2} value={v.subheadline || ""} onChange={(e) => onChange({ ...v, subheadline: e.target.value })} /></Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="CTA label"><Input value={v.cta_label || ""} onChange={(e) => onChange({ ...v, cta_label: e.target.value })} /></Field>
        <Field label="CTA href"><Input value={v.cta_href || ""} onChange={(e) => onChange({ ...v, cta_href: e.target.value })} /></Field>
      </div>
    </div>
  );
}

export function FaqEditor({ value, onChange }: Props) {
  const v = value || { headline: "", items: [] };
  return (
    <div className="space-y-3">
      <Field label="Headline"><Input value={v.headline || ""} onChange={(e) => onChange({ ...v, headline: e.target.value })} /></Field>
      <RepeatList
        label="Questions" items={v.items || []} defaultItem={{ q: "", a: "" }}
        onChange={(items) => onChange({ ...v, items })}
        render={(it, _i, set) => (
          <>
            <Field label="Question"><Input value={it.q || ""} onChange={(e) => set({ q: e.target.value })} /></Field>
            <Field label="Answer"><Textarea rows={2} value={it.a || ""} onChange={(e) => set({ a: e.target.value })} /></Field>
          </>
        )}
      />
    </div>
  );
}

export function ReviewsEditor({ value, onChange }: Props) {
  const v = value || { headline: "What customers say", items: [] };
  return (
    <div className="space-y-3">
      <Field label="Headline"><Input value={v.headline || ""} onChange={(e) => onChange({ ...v, headline: e.target.value })} /></Field>
      <RepeatList
        label="Reviews" items={v.items || []} defaultItem={{ quote: "", author: "", company: "", rating: 5 }}
        onChange={(items) => onChange({ ...v, items })}
        render={(it, _i, set) => (
          <>
            <Field label="Quote"><Textarea rows={2} value={it.quote || ""} onChange={(e) => set({ quote: e.target.value })} /></Field>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Author"><Input value={it.author || ""} onChange={(e) => set({ author: e.target.value })} /></Field>
              <Field label="Company"><Input value={it.company || ""} onChange={(e) => set({ company: e.target.value })} /></Field>
              <Field label="Rating (1–5)"><Input type="number" min={1} max={5} value={it.rating || 5} onChange={(e) => set({ rating: Number(e.target.value) })} /></Field>
            </div>
          </>
        )}
      />
    </div>
  );
}

export function ServicesEditor({ value, onChange }: Props) {
  const v = value || { headline: "Our services", items: [] };
  return (
    <div className="space-y-3">
      <Field label="Headline"><Input value={v.headline || ""} onChange={(e) => onChange({ ...v, headline: e.target.value })} /></Field>
      <RepeatList
        label="Services" items={v.items || []} defaultItem={{ title: "", description: "", href: "", icon: "Truck" }}
        onChange={(items) => onChange({ ...v, items })}
        render={(it, _i, set) => (
          <>
            <div className="grid sm:grid-cols-2 gap-2">
              <Field label="Title"><Input value={it.title || ""} onChange={(e) => set({ title: e.target.value })} /></Field>
              <Field label="Icon (Lucide name)"><Input value={it.icon || ""} onChange={(e) => set({ icon: e.target.value })} placeholder="Truck" /></Field>
            </div>
            <Field label="Description"><Textarea rows={2} value={it.description || ""} onChange={(e) => set({ description: e.target.value })} /></Field>
            <Field label="Link href"><Input value={it.href || ""} onChange={(e) => set({ href: e.target.value })} placeholder="/services/…" /></Field>
          </>
        )}
      />
    </div>
  );
}

export function StatsEditor({ value, onChange }: Props) {
  const v = value || { items: [] };
  return (
    <RepeatList
      label="Stats" items={v.items || []} defaultItem={{ value: "", label: "" }}
      onChange={(items) => onChange({ ...v, items })}
      render={(it, _i, set) => (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Value"><Input value={it.value || ""} onChange={(e) => set({ value: e.target.value })} placeholder="10k+" /></Field>
          <Field label="Label"><Input value={it.label || ""} onChange={(e) => set({ label: e.target.value })} placeholder="Loads delivered" /></Field>
        </div>
      )}
    />
  );
}

export function GalleryEditor({ value, onChange }: Props) {
  const v = value || { headline: "", items: [] };
  return (
    <div className="space-y-3">
      <Field label="Headline"><Input value={v.headline || ""} onChange={(e) => onChange({ ...v, headline: e.target.value })} /></Field>
      <RepeatList
        label="Images" items={v.items || []} defaultItem={{ src: "", alt: "", caption: "" }}
        onChange={(items) => onChange({ ...v, items })}
        render={(it, _i, set) => (
          <>
            <Field label="Image URL"><Input value={it.src || ""} onChange={(e) => set({ src: e.target.value })} /></Field>
            <div className="grid sm:grid-cols-2 gap-2">
              <Field label="Alt text"><Input value={it.alt || ""} onChange={(e) => set({ alt: e.target.value })} /></Field>
              <Field label="Caption"><Input value={it.caption || ""} onChange={(e) => set({ caption: e.target.value })} /></Field>
            </div>
          </>
        )}
      />
    </div>
  );
}

export function TextBlockEditor({ value, onChange }: Props) {
  const v = value || { html: "" };
  return (
    <Field label="HTML content">
      <Textarea rows={10} className="font-mono text-xs" value={v.html || ""} onChange={(e) => onChange({ ...v, html: e.target.value })} />
    </Field>
  );
}

export function ImageBlockEditor({ value, onChange }: Props) {
  const v = value || {};
  return (
    <div className="space-y-3">
      <Field label="Image URL *"><Input value={v.src || ""} onChange={(e) => onChange({ ...v, src: e.target.value })} placeholder="https://…" /></Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Alt text"><Input value={v.alt || ""} onChange={(e) => onChange({ ...v, alt: e.target.value })} /></Field>
        <Field label="Caption"><Input value={v.caption || ""} onChange={(e) => onChange({ ...v, caption: e.target.value })} /></Field>
      </div>
      <Field label="Click-through href (optional)"><Input value={v.href || ""} onChange={(e) => onChange({ ...v, href: e.target.value })} /></Field>
    </div>
  );
}

export function VideoBlockEditor({ value, onChange }: Props) {
  const v = value || {};
  return (
    <div className="space-y-3">
      <Field label="Video URL (YouTube, Vimeo, or MP4) *">
        <Input value={v.url || ""} onChange={(e) => onChange({ ...v, url: e.target.value })} placeholder="https://youtube.com/watch?v=…" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Poster image URL"><Input value={v.poster || ""} onChange={(e) => onChange({ ...v, poster: e.target.value })} /></Field>
        <Field label="Caption"><Input value={v.caption || ""} onChange={(e) => onChange({ ...v, caption: e.target.value })} /></Field>
      </div>
    </div>
  );
}

export function FeaturesEditor({ value, onChange }: Props) {
  const v = value || { headline: "", items: [] };
  return (
    <div className="space-y-3">
      <Field label="Headline"><Input value={v.headline || ""} onChange={(e) => onChange({ ...v, headline: e.target.value })} /></Field>
      <RepeatList
        label="Features" items={v.items || []} defaultItem={{ icon: "Check", title: "", description: "" }}
        onChange={(items) => onChange({ ...v, items })}
        render={(it, _i, set) => (
          <>
            <div className="grid sm:grid-cols-2 gap-2">
              <Field label="Icon (Lucide)"><Input value={it.icon || ""} onChange={(e) => set({ icon: e.target.value })} /></Field>
              <Field label="Title"><Input value={it.title || ""} onChange={(e) => set({ title: e.target.value })} /></Field>
            </div>
            <Field label="Description"><Textarea rows={2} value={it.description || ""} onChange={(e) => set({ description: e.target.value })} /></Field>
          </>
        )}
      />
    </div>
  );
}

export function CustomHtmlEditor({ value, onChange }: Props) {
  const v = value || { html: "" };
  return (
    <Field label="HTML (be careful — rendered as-is)">
      <Textarea rows={12} className="font-mono text-xs" value={v.html || ""} onChange={(e) => onChange({ ...v, html: e.target.value })} />
    </Field>
  );
}

export const SECTION_EDITORS: Record<string, React.FC<Props>> = {
  hero: HeroEditor,
  cta: CtaEditor,
  faq: FaqEditor,
  testimonials: ReviewsEditor,
  reviews: ReviewsEditor,
  services: ServicesEditor,
  stats: StatsEditor,
  gallery: GalleryEditor,
  rich_text: TextBlockEditor,
  text_block: TextBlockEditor,
  image_block: ImageBlockEditor,
  video_block: VideoBlockEditor,
  features: FeaturesEditor,
  custom_html: CustomHtmlEditor,
};

export const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: "Hero", cta: "Call-to-Action", faq: "FAQ",
  reviews: "Reviews / Testimonials", testimonials: "Reviews / Testimonials",
  services: "Services Grid", stats: "Stats / Numbers", gallery: "Image Gallery",
  rich_text: "Text Block (HTML)", text_block: "Text Block (HTML)",
  image_block: "Image Block", video_block: "Video Block",
  features: "Features Grid", custom_html: "Custom HTML",
};

export const SECTION_DEFAULTS: Record<string, any> = {
  hero: { eyebrow: "", headline: "Headline here", subheadline: "", cta_label: "Get a quote", cta_href: "/contact", image: "" },
  cta: { headline: "Ready to ship?", subheadline: "", cta_label: "Get a quote", cta_href: "/contact" },
  faq: { headline: "FAQ", items: [{ q: "Question?", a: "Answer." }] },
  reviews: { headline: "What customers say", items: [{ quote: "Great service.", author: "Customer", company: "", rating: 5 }] },
  testimonials: { headline: "What customers say", items: [{ quote: "Great service.", author: "Customer", company: "", rating: 5 }] },
  services: { headline: "Services", items: [{ title: "Service 1", description: "…", href: "/services/x", icon: "Truck" }] },
  stats: { items: [{ value: "10k+", label: "Loads delivered" }] },
  gallery: { headline: "Gallery", items: [{ src: "", alt: "", caption: "" }] },
  rich_text: { html: "<p>Edit me</p>" },
  text_block: { html: "<p>Edit me</p>" },
  image_block: { src: "", alt: "", caption: "", href: "" },
  video_block: { url: "", poster: "", caption: "" },
  features: { headline: "Features", items: [{ icon: "Check", title: "Item 1", description: "…" }] },
  custom_html: { html: "<div>Custom content</div>" },
};
