"use client";

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getCurrentSession, isSupabaseConfigured, onAuthStateChange } from "@/lib/auth/supabase-auth";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
}

export function useSupabaseAuth(): AuthState {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;

    let active = true;
    getCurrentSession().then((s) => {
      if (active) {
        setSession(s);
        setLoading(false);
      }
    });

    const subscription = onAuthStateChange((_event, s) => {
      if (active) setSession(s);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  return { user: session?.user ?? null, session, loading, configured };
}
