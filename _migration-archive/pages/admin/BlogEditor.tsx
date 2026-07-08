import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { slugify } from "@/lib/blog";
import { ArrowLeft, Trash2, Eye } from "lucide-react";

type Post = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  author_name: string | null;
  author_id: string | null;
  status: "draft" | "published" | "scheduled";
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  no_index: boolean;
};

const empty: Post = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image: "",
  author_name: "",
  author_id: null,
  status: "draft",
  published_at: null,
  seo_title: "",
  seo_description: "",
  og_image: "",
  no_index: false,
};

const BlogEditor = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (isNew) {
      setPost({ ...empty, author_name: user?.email ?? "", author_id: user?.id ?? null });
      return;
    }
    supabase.from("blog_posts").select("*").eq("id", id).maybeSingle().then(({ data, error }) => {
      if (error) toast.error(error.message);
      if (data) {
        setPost({
          ...empty, ...data,
          published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : null,
        });
        setSlugTouched(true);
      }
      setLoading(false);
    });
  }, [id, isNew, user]);

  const onTitleChange = (v: string) => {
    setPost((p) => ({ ...p, title: v, slug: slugTouched ? p.slug : slugify(v) }));
  };

  const save = async (overrideStatus?: Post["status"]) => {
    if (!post.title.trim()) return toast.error("Title is required");
    if (!post.slug.trim()) return toast.error("Slug is required");
    setSaving(true);
    const status = overrideStatus ?? post.status;
    let published_at: string | null = post.published_at;
    if (status === "published" && !published_at) published_at = new Date().toISOString();
    if (published_at && published_at.length === 16) published_at = new Date(published_at).toISOString();

    const payload = { ...post, status, published_at };

    if (isNew) {
      const { data, error } = await supabase.from("blog_posts").insert(payload).select("id").single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Post created");
      navigate(`/admin/blog/${data.id}`, { replace: true });
    } else {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Saved");
      setPost(payload);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post deleted");
    navigate("/admin/blog");
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Link to="/admin/blog"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Back</Button></Link>
        <div className="flex-1" />
        {!isNew && post.status === "published" && (
          <Link to={`/blog/${post.slug}`} target="_blank"><Button variant="outline" size="sm"><Eye className="h-4 w-4" /> View</Button></Link>
        )}
        {!isNew && (
          <Button variant="outline" size="sm" onClick={remove} className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
      </div>

      <h1 className="text-3xl font-bold text-foreground">{isNew ? "New Post" : "Edit Post"}</h1>

      <Tabs defaultValue="content" className="mt-6">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="publish">Publish</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          <Card className="p-6 space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={post.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="How to ship a tractor across state lines" />
            </div>
            <div>
              <Label>URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">/blog/</span>
                <Input value={post.slug} onChange={(e) => { setSlugTouched(true); setPost({ ...post, slug: slugify(e.target.value) }); }} />
              </div>
            </div>
            <div>
              <Label>Featured Image URL</Label>
              <Input value={post.featured_image ?? ""} onChange={(e) => setPost({ ...post, featured_image: e.target.value })} placeholder="https://... (upload in Media Library and paste URL)" />
              {post.featured_image && <img src={post.featured_image} alt="" className="mt-2 max-h-40 rounded" />}
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea rows={2} value={post.excerpt ?? ""} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} placeholder="Short summary (shown on the blog list)" />
            </div>
            <div>
              <Label>Content (HTML or plain text)</Label>
              <Textarea rows={16} value={post.content ?? ""} onChange={(e) => setPost({ ...post, content: e.target.value })} placeholder="<p>Your article content here. Use HTML tags for formatting.</p>" className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground mt-1">Supports HTML: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;a href=""&gt;, &lt;img src=""&gt;, etc.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Author Name</Label>
                <Input value={post.author_name ?? ""} onChange={(e) => setPost({ ...post, author_name: e.target.value })} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-4">
          <Card className="p-6 space-y-4">
            <div>
              <Label>SEO Title <span className="text-muted-foreground text-xs">(defaults to post title)</span></Label>
              <Input value={post.seo_title ?? ""} onChange={(e) => setPost({ ...post, seo_title: e.target.value })} maxLength={60} />
              <p className="text-xs text-muted-foreground mt-1">{(post.seo_title ?? "").length}/60</p>
            </div>
            <div>
              <Label>Meta Description</Label>
              <Textarea rows={2} value={post.seo_description ?? ""} onChange={(e) => setPost({ ...post, seo_description: e.target.value })} maxLength={160} />
              <p className="text-xs text-muted-foreground mt-1">{(post.seo_description ?? "").length}/160</p>
            </div>
            <div>
              <Label>Open Graph Image URL <span className="text-muted-foreground text-xs">(for social sharing)</span></Label>
              <Input value={post.og_image ?? ""} onChange={(e) => setPost({ ...post, og_image: e.target.value })} placeholder="Defaults to featured image" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={post.no_index} onChange={(e) => setPost({ ...post, no_index: e.target.checked })} />
              <span className="text-sm">No index (hide from search engines)</span>
            </label>
          </Card>
        </TabsContent>

        <TabsContent value="publish" className="space-y-4 mt-4">
          <Card className="p-6 space-y-4">
            <div>
              <Label>Status</Label>
              <div className="flex gap-2 mt-1">
                {(["draft", "published", "scheduled"] as const).map((s) => (
                  <button key={s} onClick={() => setPost({ ...post, status: s })}
                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${post.status === s ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-primary/15"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Publish date <span className="text-xs text-muted-foreground">(scheduled posts go live at this time)</span></Label>
              <Input type="datetime-local" value={post.published_at ?? ""} onChange={(e) => setPost({ ...post, published_at: e.target.value })} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button variant="outline" disabled={saving} onClick={() => save("draft")}>Save Draft</Button>
        <Button disabled={saving} size="lg" onClick={() => save("published")}>{saving ? "Saving…" : "Publish"}</Button>
      </div>
    </div>
  );
};

export default BlogEditor;
