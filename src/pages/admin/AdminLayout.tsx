import { ReactNode } from "react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import {
  LayoutDashboard,
  Link2,
  Users,
  LogOut,
  Inbox,
  Share2,
} from "lucide-react";

// Content editing (pages, blog, media, SEO, navigation, theme settings) now lives in
// wp-admin — this panel only keeps what WordPress doesn't replace: leads/CRM, redirects,
// and staff/user management for this panel itself.
const nav = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/submissions", label: "Form Submissions", icon: Inbox },
  { to: "/admin/hubspot", label: "HubSpot", icon: Share2 },
  { to: "/admin/redirects", label: "Redirects", icon: Link2 },
  { to: "/admin/users", label: "Users & Roles", icon: Users },
];

const AdminLayout = ({ children }: { children?: ReactNode }) => {
  const { user, isStaff, loading, signOut } = useAuth();
  const loc = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-secondary text-white">Loading…</div>;
  if (!user) return <Navigate to="/admin/login" state={{ from: loc }} replace />;
  if (!isStaff) return <Navigate to="/admin/login" replace />;

  return (
    <>
      <Helmet>
        <title>Admin · Heavy Haul Group</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background flex">
        <aside className="w-64 bg-secondary text-white flex flex-col border-r border-white/10 sticky top-0 h-screen">
          <div className="p-5 border-b border-white/10">
            <div className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Admin Panel</div>
            <div className="text-lg font-bold mt-1">Heavy Haul Group</div>
          </div>
          <nav className="flex-1 overflow-y-auto py-3">
            {nav.map(({ to, end, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors border-l-2 ${
                    isActive
                      ? "bg-white/5 text-primary border-primary"
                      : "text-white/70 border-transparent hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10 text-xs text-white/60">
            <div className="truncate mb-2">{user.email}</div>
            <Button size="sm" variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white hover:text-secondary" onClick={signOut}>
              <LogOut className="h-3 w-3 mr-2" /> Sign out
            </Button>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <div className="p-6 lg:p-8 max-w-6xl">{children ?? <Outlet />}</div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
