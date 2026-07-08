import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Inbox, Share2, Link2, Users, ExternalLink } from "lucide-react";

const WP_ADMIN_URL = import.meta.env.VITE_WP_ADMIN_URL || "http://localhost:8090/wp-admin";

const tiles = [
  { to: "/admin/submissions", label: "Form Submissions", desc: "Leads captured from the site", icon: Inbox },
  { to: "/admin/hubspot", label: "HubSpot", desc: "CRM sync settings", icon: Share2 },
  { to: "/admin/redirects", label: "Redirects", desc: "Old URL → new URL rules", icon: Link2 },
  { to: "/admin/users", label: "Users & Roles", desc: "Invite team, assign permissions", icon: Users },
];

const AdminDashboard = () => {
  const { user, roles } = useAuth();
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
      <p className="text-muted-foreground mt-1">
        Signed in as <span className="font-medium text-foreground">{user?.email}</span>
        {roles.length > 0 && (
          <> · roles: {roles.map((r) => <span key={r} className="inline-block ml-1 px-2 py-0.5 rounded bg-primary/15 text-secondary text-xs font-bold uppercase">{r.replace("_", " ")}</span>)}</>
        )}
      </p>

      <a href={WP_ADMIN_URL} target="_blank" rel="noopener noreferrer" className="block mt-8">
        <Card className="p-5 border-primary/40 hover:border-primary hover:shadow-glow transition-all bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-foreground">Edit site content in WordPress</div>
              <div className="text-sm text-muted-foreground mt-1">
                Pages, sections, blog posts, media, navigation, SEO, and theme settings are all edited in wp-admin now.
              </div>
            </div>
            <ExternalLink className="h-5 w-5 text-primary shrink-0 ml-4" />
          </div>
        </Card>
      </a>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {tiles.map(({ to, label, desc, icon: Icon }) => (
          <Link key={to} to={to}>
            <Card className="p-5 hover:border-primary hover:shadow-glow transition-all h-full">
              <Icon className="h-6 w-6 text-primary mb-3" />
              <div className="font-bold text-foreground">{label}</div>
              <div className="text-sm text-muted-foreground mt-1">{desc}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
