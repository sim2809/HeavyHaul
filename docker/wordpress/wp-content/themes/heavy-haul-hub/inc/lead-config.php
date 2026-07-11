<?php
/**
 * Supabase project config for the lead-capture forms (Phase 9). Ports src/lib/submitLead.ts's
 * `supabase.functions.invoke("submit-lead", {...})` call to a plain fetch() from vanilla JS —
 * the `submit-lead` edge function, HubSpot forwarding, and the Supabase `form_submissions`
 * table are explicitly staying on Supabase (out of scope for this WordPress migration; see
 * WORDPRESS_MIGRATION.md's scope boundaries).
 *
 * These are the Supabase ANON/publishable key and project URL — safe to expose client-side,
 * same values already bundled into the current React app's public JS (anon keys are meant to
 * be public; row-level security on the Supabase side is what actually protects data).
 */

define('HH_SUPABASE_URL', 'https://lophjjccxjqhbhacmfow.supabase.co');
define('HH_SUPABASE_ANON_KEY', 'sb_publishable_bGLMUrss_5SY3iLfEzRQww_zwCOc7Rb');
define('HH_SUBMIT_LEAD_URL', HH_SUPABASE_URL . '/functions/v1/submit-lead');
