import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Reads all enabled redirects once and watches route changes.
 * If current path matches a `from_path`, navigates to `to_path`.
 */
export default function RedirectHandler() {
  const loc = useLocation();
  const nav = useNavigate();
  const [rules, setRules] = useState<{ from_path: string; to_path: string }[]>([]);

  useEffect(() => {
    supabase
      .from("redirects")
      .select("from_path,to_path")
      .eq("enabled", true)
      .then(({ data }) => setRules(data || []));
  }, []);

  useEffect(() => {
    const match = rules.find((r) => r.from_path === loc.pathname);
    if (match) {
      if (/^https?:\/\//.test(match.to_path)) {
        window.location.replace(match.to_path);
      } else {
        nav(match.to_path, { replace: true });
      }
    }
  }, [loc.pathname, rules, nav]);

  return null;
}
