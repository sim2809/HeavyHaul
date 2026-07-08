// A separate, elevated-privilege Supabase client for this one-time export script only.
// Uses the SERVICE ROLE key (bypasses RLS) — never the anon key from src/integrations/supabase/client.ts,
// and never used inside the actual React app.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../src/integrations/supabase/types";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error(
    "Set VITE_SUPABASE_URL (already in .env) and SUPABASE_SERVICE_ROLE_KEY " +
      "(from Supabase dashboard → Project Settings → API — NOT the anon key) before running the migration."
  );
}

export const supabaseAdmin = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY);
