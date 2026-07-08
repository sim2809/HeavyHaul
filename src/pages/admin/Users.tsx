import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type AppRole = "owner" | "admin" | "marketing_manager" | "seo_specialist" | "content_editor";
const ALL_ROLES: AppRole[] = ["owner", "admin", "marketing_manager", "seo_specialist", "content_editor"];

interface Row {
  id: string;
  email: string | null;
  full_name: string | null;
  roles: AppRole[];
}

const UsersPage = () => {
  const { hasRole } = useAuth();
  const canManage = hasRole("owner") || hasRole("admin");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("id,email,full_name").order("created_at");
    const { data: roles } = await supabase.from("user_roles").select("user_id,role");
    const map = new Map<string, AppRole[]>();
    (roles ?? []).forEach((r: any) => {
      map.set(r.user_id, [...(map.get(r.user_id) ?? []), r.role]);
    });
    setRows((profiles ?? []).map((p: any) => ({ ...p, roles: map.get(p.id) ?? [] })));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRole = async (userId: string, role: AppRole, has: boolean) => {
    if (has) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) return toast.error(error.message);
    }
    load();
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Users & Roles</h1>
      <p className="text-muted-foreground mt-1">
        New users sign up at <code className="text-xs bg-muted px-1 py-0.5 rounded">/admin/login</code>. Grant them a role here so they can access the panel.
      </p>

      <div className="mt-6 space-y-3">
        {rows.map((u) => (
          <Card key={u.id} className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="font-bold text-foreground">{u.full_name || u.email}</div>
                <div className="text-xs text-muted-foreground">{u.email}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_ROLES.map((r) => {
                  const has = u.roles.includes(r);
                  return (
                    <Button
                      key={r}
                      size="sm"
                      variant={has ? "default" : "outline"}
                      disabled={!canManage}
                      onClick={() => toggleRole(u.id, r, has)}
                      className="text-xs"
                    >
                      {r.replace("_", " ")}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-muted-foreground">No users yet.</p>}
      </div>
    </div>
  );
};

export default UsersPage;
