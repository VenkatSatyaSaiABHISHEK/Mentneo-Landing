import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zvqswffitbsqyhhmmknv.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_f2XUx-0-GTl0w-GXH0KCrQ_Sze8B5HO";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Public client for client-side reads
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server/Admin client with full service privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Asynchronously synchronizes candidate application record to Supabase
 */
export async function syncApplicationToSupabase(record: Record<string, unknown>): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from("applications").insert([record]);
    if (error) {
      console.warn("[Supabase] Cloud sync notice:", error.message);
    } else {
      console.log(`[Supabase] Synced candidate: ${record.application_reference}`);
    }
  } catch (err: unknown) {
    console.warn("[Supabase] Cloud sync error:", (err as Error).message);
  }
}
