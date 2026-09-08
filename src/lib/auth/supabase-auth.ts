import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/db/supabase";

export { isSupabaseConfigured };

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = getSupabase();
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = getSupabase();
  return supabase.auth.signOut();
}

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  const supabase = getSupabase();
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data.subscription;
}

// Persists a tier upgrade to the signed-in user's own profiles row. Relies on the
// "Users can update own profile" RLS policy (auth-schema.sql) — a no-op error if
// there's no active session, which callers should treat as non-fatal (the app
// still works purely as an in-memory demo when no one is signed in).
export async function updateMyTier(tier: "NUR_FINANCE_R" | "NUR_FINANCE_B") {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: new Error("Not signed in") };
  return supabase.from("profiles").update({ tier, updated_at: new Date().toISOString() }).eq("id", user.id);
}

export async function getMyProfile(): Promise<{ tier: string; full_name: string | null } | null> {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("tier, full_name").eq("id", user.id).single();
  return data ?? null;
}
