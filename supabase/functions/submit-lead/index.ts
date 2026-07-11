// Edge function: receive a public form submission, log it to form_submissions,
// send a best-effort email notification via Resend, then best-effort sync to
// HubSpot CRM if enabled in hubspot_settings.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const Body = z.object({
  name: z.string().trim().max(120).optional().nullable(),
  email: z.string().trim().email().max(160).optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable(),
  origin: z.string().trim().max(160).optional().nullable(),
  destination: z.string().trim().max(160).optional().nullable(),
  equipment: z.string().trim().max(160).optional().nullable(),
  message: z.string().trim().max(4000).optional().nullable(),
  page_url: z.string().trim().max(500).optional().nullable(),
  source: z.string().trim().max(80).optional().nullable(),
  extra: z.record(z.any()).optional().nullable(),
});

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const LEAD_NOTIFICATION_EMAIL = Deno.env.get("LEAD_NOTIFICATION_EMAIL") ?? "galstyan.simon12@gmail.com";

// Best-effort — a failed notification email should never fail the lead submission itself.
async function sendLeadNotificationEmail(p: z.infer<typeof Body>): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping lead notification email");
    return;
  }
  const rows = [
    ["Name", p.name],
    ["Email", p.email],
    ["Phone", p.phone],
    ["Origin", p.origin],
    ["Destination", p.destination],
    ["Equipment", p.equipment],
    ["Message", p.message],
    ["Source", p.source],
    ["Page", p.page_url],
  ].filter(([, v]) => v);
  const html = `<h2>New quote request</h2><table>${
    rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`).join("")
  }</table>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Heavy Haul Hub <onboarding@resend.dev>",
        to: [LEAD_NOTIFICATION_EMAIL],
        subject: `New quote request${p.name ? ` from ${p.name}` : ""}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error(`Resend notification failed (${res.status}): ${await res.text()}`);
    }
  } catch (e) {
    console.error("Resend notification threw:", (e as Error).message);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const p = parsed.data;

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    // 1. Always log the submission first (backup of record)
    const { data: row, error: insertErr } = await admin.from("form_submissions").insert({
      name: p.name, email: p.email, phone: p.phone,
      origin: p.origin, destination: p.destination,
      equipment: p.equipment, message: p.message,
      page_url: p.page_url, source: p.source ?? "website",
      extra: p.extra ?? null, hubspot_status: "pending",
    }).select("id").single();
    if (insertErr) throw insertErr;

    // 2. Notify by email (best-effort, never blocks/fails the lead submission)
    await sendLeadNotificationEmail(p);

    // 3. Load HubSpot config and attempt sync
    const { data: hs } = await admin.from("hubspot_settings").select("*").eq("id", 1).maybeSingle();

    if (!hs?.enabled || !hs.private_app_token) {
      await admin.from("form_submissions").update({
        hubspot_status: "skipped",
        hubspot_error: hs?.enabled ? "Missing private app token" : "HubSpot disabled",
      }).eq("id", row.id);
      return new Response(JSON.stringify({ ok: true, id: row.id, hubspot: "skipped" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Upsert contact via HubSpot CRM v3 API (email is the natural id)
    let status = "synced";
    let errorMsg: string | null = null;
    let contactId: string | null = null;

    try {
      if (!p.email) throw new Error("No email — cannot create HubSpot contact");
      const props: Record<string, string> = {
        email: p.email,
        firstname: (p.name ?? "").split(" ")[0] ?? "",
        lastname: (p.name ?? "").split(" ").slice(1).join(" "),
        phone: p.phone ?? "",
        hs_lead_status: "NEW",
      };
      // free-form lead notes
      const notes = [
        p.origin && `Origin: ${p.origin}`,
        p.destination && `Destination: ${p.destination}`,
        p.equipment && `Equipment: ${p.equipment}`,
        p.message && `Message: ${p.message}`,
        p.page_url && `Page: ${p.page_url}`,
        p.source && `Source: ${p.source}`,
      ].filter(Boolean).join("\n");
      if (notes) props.message = notes;

      // Try create
      const createRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${hs.private_app_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties: props }),
      });
      if (createRes.ok) {
        const body = await createRes.json();
        contactId = body.id ?? null;
      } else if (createRes.status === 409) {
        // Existing contact — update by email
        await createRes.text();
        const upd = await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(p.email)}?idProperty=email`,
          {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${hs.private_app_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ properties: props }),
          },
        );
        if (!upd.ok) {
          status = "failed";
          errorMsg = `Update failed (${upd.status}): ${await upd.text()}`;
        } else {
          const body = await upd.json();
          contactId = body.id ?? null;
        }
      } else {
        status = "failed";
        errorMsg = `Create failed (${createRes.status}): ${await createRes.text()}`;
      }
    } catch (e) {
      status = "failed";
      errorMsg = (e as Error).message;
    }

    await admin.from("form_submissions").update({
      hubspot_status: status,
      hubspot_error: errorMsg,
      hubspot_contact_id: contactId,
    }).eq("id", row.id);

    return new Response(JSON.stringify({ ok: true, id: row.id, hubspot: status, error: errorMsg }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
