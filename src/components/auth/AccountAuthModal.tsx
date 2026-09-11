"use client";

import { useState } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { signIn, signOut, signUp } from "@/lib/auth/supabase-auth";
import { useIDEStore } from "@/stores/useIDEStore";
import { cyberSound } from "@/lib/audio/sound-synth";
import EagleCrest from "@/components/ui/EagleCrest";

interface AccountAuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AccountAuthModal({ open, onClose }: AccountAuthModalProps) {
  const { user, loading, configured } = useSupabaseAuth();
  const { addNotification } = useIDEStore();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (mode === "signup") {
        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) throw signUpError;
        addNotification({
          title: "✅ Account Created",
          message: "Please check your email to verify your sovereign account.",
          severity: "SUCCESS",
          category: "SYSTEM",
        });
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
        cyberSound.playQuantumUnlock();
        addNotification({ title: "✅ Authenticated", message: `Welcome back, ${email}.`, severity: "SUCCESS", category: "SYSTEM" });
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected authentication error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    addNotification({ title: "🔓 Signed Out", message: "Sovereign session terminated.", severity: "INFO", category: "SYSTEM" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none">
      <div className="relative w-full max-w-md p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-black shadow-2xl text-white space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono"
        >
          ✕ CLOSE
        </button>

        <div className="flex items-center gap-3.5 border-b border-cyan-500/20 pb-4">
          <EagleCrest size={36} animate={true} />
          <div>
            <h3 className="text-base font-serif font-bold text-white">Sovereign Account Gateway</h3>
            <p className="text-[11px] text-slate-400">Manage your terminal credentials and institutional clearance</p>
          </div>
        </div>

        {!configured ? (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
            ⚠️ Supabase environment variables pending. When configured in <code className="text-white">.env.local</code> (
            <code className="text-white">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-white">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            ), sovereign cloud account authentication will be fully live.
          </div>
        ) : loading ? (
          <div className="text-xs text-slate-400 font-mono text-center py-4">Authenticating clearance...</div>
        ) : user ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1 text-center">
              <span className="text-emerald-400 font-bold text-xs uppercase">✅ Authenticated Clearance</span>
              <p className="text-[11px] text-slate-300">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full py-3 rounded-xl text-xs font-bold bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 transition-all font-mono"
            >
              SIGN OUT
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-1.5 p-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`flex-1 py-1.5 rounded-md font-bold transition-colors ${mode === "signin" ? "bg-cyan-500 text-black" : "text-slate-400"}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-1.5 rounded-md font-bold transition-colors ${mode === "signup" ? "bg-cyan-500 text-black" : "text-slate-400"}`}
              >
                Register
              </button>
            </div>

            {mode === "signup" && (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full p-2.5 rounded-lg bg-black/70 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full p-2.5 rounded-lg bg-black/70 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (minimum 6 characters)"
              minLength={6}
              required
              className="w-full p-2.5 rounded-lg bg-black/70 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
            />

            {error && <div className="text-[11px] text-red-400 font-mono">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl text-xs font-bold font-mono tracking-wider bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black transition-all disabled:opacity-50"
            >
              {submitting ? "PROCESSING..." : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
