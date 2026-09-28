import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const FALLBACK_URL = "https://emjmvgginijkupwuflla.supabase.co";
const FALLBACK_PUBLISHABLE_KEY = "sb_publishable_axgWqbWx-24V2b9s7mE1Fw__N3Ce61f";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  browserClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || FALLBACK_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );

  return browserClient;
}

export function getSupabasePublicConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || FALLBACK_PUBLISHABLE_KEY,
  };
}
