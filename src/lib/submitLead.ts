import { supabase } from "@/integrations/supabase/client";

export type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  origin?: string;
  destination?: string;
  equipment?: string;
  message?: string;
  source?: string;
  extra?: Record<string, any>;
};

export async function submitLead(p: LeadPayload) {
  const payload = {
    ...p,
    page_url: typeof window !== "undefined" ? window.location.href : null,
  };
  const { data, error } = await supabase.functions.invoke("submit-lead", { body: payload });
  if (error) throw error;
  return data as { ok: boolean; id: string; hubspot: string; error?: string };
}
