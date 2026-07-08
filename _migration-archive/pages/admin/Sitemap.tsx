import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Download, RefreshCw } from "lucide-react";

const STATIC_ROUTES = [
  "/", "/services", "/lanes", "/about", "/blog", "/contact",
];

export default function SitemapPage() {
  const [xml, setXml] = useState("");
  const [robots, setRobots] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const { data: gs } = await supabase.from("global_settings").select("site_url, robots_txt").eq("id", 1).maybeSingle();
    const base = ((gs as any)?.site_url || "").replace(/\/$/, "");

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("status", "published");

    const urls: { loc: string; lastmod?: string }[] = [
      ...STATIC_ROUTES.map((p) => ({ loc: `${base}${p}` })),
      ...((posts as any[]) || []).map((p) => ({
        loc: `${base}/blog/${p.slug}`,
        lastmod: (p.updated_at || p.published_at)?.slice(0, 10),
      })),
    ];

    const xmlStr =
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls
        .map((u) => `  <url>\n    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}\n  </url>`)
        .join("\n") +
      `\n</urlset>`;
    setXml(xmlStr);

    const robotsStr =
      (gs as any)?.robots_txt ||
      `User-agent: *\nAllow: /\n${base ? `Sitemap: ${base}/sitemap.xml` : ""}`;
    setRobots(robotsStr);
    setLoading(false);
  };

  useEffect(() => { generate(); }, []);

  const download = (name: string, content: string, type = "text/xml") => {
    const blob = new Blob([content], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
  };

  const copy = (s: string) => { navigator.clipboard.writeText(s); toast.success("Copied"); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sitemap & Robots</h1>
          <p className="text-sm text-muted-foreground">Auto-generated from static routes + published blog posts. Set Site URL in Global Settings.</p>
        </div>
        <Button onClick={generate} variant="outline"><RefreshCw className="h-4 w-4 mr-1" /> Regenerate</Button>
      </div>

      <Section title="sitemap.xml" content={xml} onCopy={copy} onDownload={() => download("sitemap.xml", xml)} loading={loading} />
      <Section title="robots.txt" content={robots} onCopy={copy} onDownload={() => download("robots.txt", robots, "text/plain")} loading={loading} />

      <p className="text-xs text-muted-foreground mt-4">
        Download these files and place in <code>public/</code> before publishing, or paste the contents into your hosting provider.
      </p>
    </div>
  );
}

function Section({ title, content, onCopy, onDownload, loading }: any) {
  return (
    <div className="mb-6 border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-muted">
        <span className="font-mono text-sm font-semibold">{title}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => onCopy(content)}><Copy className="h-3 w-3 mr-1" /> Copy</Button>
          <Button size="sm" variant="ghost" onClick={onDownload}><Download className="h-3 w-3 mr-1" /> Download</Button>
        </div>
      </div>
      <pre className="p-4 text-xs bg-background overflow-x-auto max-h-80">{loading ? "Loading…" : content}</pre>
    </div>
  );
}
