import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Pencil } from "lucide-react";
import { formatDate } from "@/lib/blog";

type Post = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "scheduled";
  published_at: string | null;
  updated_at: string;
  featured_image: string | null;
};

const BlogList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | "draft" | "published" | "scheduled">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const q = supabase.from("blog_posts").select("id,title,slug,status,published_at,updated_at,featured_image").order("updated_at", { ascending: false });
      const { data } = await q;
      setPosts(data ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold text-foreground">Blog</h1>
        <Link to="/admin/blog/new"><Button size="lg"><Plus className="h-4 w-4" /> New Post</Button></Link>
      </div>

      <div className="mt-6 flex gap-2 flex-wrap">
        {(["all", "published", "draft", "scheduled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
              filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-primary/15"
            }`}
          >
            {s} {s !== "all" && `(${posts.filter((p) => p.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground mt-6">Loading…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.length === 0 && (
            <Card className="p-10 text-center">
              <p className="text-muted-foreground">No posts yet. Create your first article.</p>
            </Card>
          )}
          {filtered.map((p) => (
            <Link key={p.id} to={`/admin/blog/${p.id}`}>
              <Card className="p-4 flex items-center gap-4 hover:border-primary transition-colors">
                <div className="h-14 w-20 rounded bg-muted overflow-hidden flex-shrink-0">
                  {p.featured_image && <img src={p.featured_image} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    /{p.slug} · updated {formatDate(p.updated_at)}
                  </div>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${
                    p.status === "published" ? "bg-green-500/15 text-green-700" :
                    p.status === "scheduled" ? "bg-blue-500/15 text-blue-700" :
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {p.status}
                </span>
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
