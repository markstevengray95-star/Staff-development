import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Staff Development has its own Supabase project. Keep this explicit so a
// Vercel environment variable from another app cannot silently connect this
// app to the tutoring database/auth project again. The publishable key is
// intentionally public and safe to use in the browser.
const CPD_SUPABASE_URL = "https://tkjbaqkpkvomwwvwhowp.supabase.co";
const CPD_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fhd4sTyBLIJ8WBLSo98PKg_byPree7O";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  browserClient = createClient(
    CPD_SUPABASE_URL,
    CPD_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "staff-development-cpd-auth",
      },
    },
  );

  return browserClient;
}

export function getSupabasePublicConfig() {
  return {
    url: CPD_SUPABASE_URL,
    key: CPD_SUPABASE_PUBLISHABLE_KEY,
  };
}
