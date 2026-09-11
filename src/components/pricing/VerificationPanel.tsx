"use client";

import { useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { VerificationProductTier } from "@/types";
import EagleCrest from "@/components/ui/EagleCrest";

type Step = "select" | "history" | "invitation" | "document" | "submitted";

const STEP_ORDER_R: Step[] = ["select", "history", "document", "submitted"];
const STEP_ORDER_B: Step[] = ["select", "history", "invitation", "document", "submitted"];

function stepLabel(s: Step): string {
  const map: Record<Step, string> = {
    select: "Select Tier",
    history: "Usage History",
    invitation: "Invitation",
    document: "Documents",
    submitted: "Submitted",
  };
  return map[s];
}

export default function VerificationPanel() {
  const { verification, updateVerification, addNotification, setActiveView } = useIDEStore();

  const [selectedTier, setSelectedTier] = useState<VerificationProductTier>(verification.tier || "NUR_FINANCE_R");
  const [step, setStep] = useState<Step>("select");
  const [historyMonths, setHistoryMonths] = useState(verification.reutersUsageMonths || 0);
  const [bloombergMonths, setBloombergMonths] = useState(verification.bloombergUsageMonths || 0);
  const [inviteCode, setInviteCode] = useState(verification.invitationCode || "");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isVerifyingInvite, setIsVerifyingInvite] = useState(false);
  const [inviteVerified, setInviteVerified] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps: Step[] = selectedTier === "NUR_FINANCE_B" ? STEP_ORDER_B : STEP_ORDER_R;
  const currentStepIdx = steps.indexOf(step);
  const isR = selectedTier === "NUR_FINANCE_R";
  const months = isR ? historyMonths : bloombergMonths;
  const setMonths = isR ? setHistoryMonths : setBloombergMonths;
  const isHistoryEligible = months >= 12;

  async function verifyInvitation() {
    if (!inviteCode.trim()) return;
    setIsVerifyingInvite(true);
    setInviteError("");
    try {
      const res = await fetch("/api/verify-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode }),
      });
      const result = await res.json();
      if (result.valid) {
        setInviteVerified(true);
      } else {
        setInviteError(result.detail || "Invalid invitation code. Only codes issued by NUR Finance leadership are accepted.");
      }
    } catch {
      setInviteError("Network error. Please retry.");
    } finally {
      setIsVerifyingInvite(false);
    }
  }

  async function handleSubmit() {
    if (!fullName.trim() || !uploadFileName) return;
    setIsSubmitting(true);
    try {
      if (isR) {
        updateVerification({ tier: "NUR_FINANCE_R", reutersUsageMonths: historyMonths, documentUploaded: true, overallStatus: "UNDER_REVIEW" });
        addNotification({
          title: "Application Under Review: NUR Finance R",
          message: "Reuters usage prerequisite verified. Proof document under compliance review — 24-48h turnaround.",
          severity: "INFO", category: "COMPLIANCE",
        });
      } else {
        updateVerification({ tier: "NUR_FINANCE_B", bloombergUsageMonths: bloombergMonths, invitationCode: inviteCode, invitationVerified: true, emailConfirmed: false, documentUploaded: true, overallStatus: "UNDER_REVIEW" });
        addNotification({
          title: "Application Under Review: NUR Finance B",
          message: "Invitation and Bloomberg history verified. Proof document under compliance review — 24-48h.",
          severity: "INFO", category: "COMPLIANCE",
        });
      }
      setStep("submitted");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Color palette
  const accentR = "#3b82f6";
  const accentB = "#f59e0b";
  const accent = isR ? accentR : accentB;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b shrink-0" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
        <div className="flex items-center gap-3">
          <EagleCrest size={30} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: "var(--ag-accent)" }}>NUR Finance Verification Portal</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                STRICT COMPLIANCE GATEWAY
              </span>
            </div>
            <p className="text-[11px]" style={{ color: "var(--ag-muted)" }}>
              Bloomberg / Reuters usage history verification &amp; invitation enforcement
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span style={{ color: "var(--ag-muted)" }}>Status:</span>
          <span className="px-2 py-0.5 rounded font-bold" style={{
            background: verification.overallStatus === "VERIFIED" ? "rgba(34,197,94,0.15)"
              : verification.overallStatus === "REJECTED" ? "rgba(239,68,68,0.15)"
              : verification.overallStatus === "UNDER_REVIEW" ? "rgba(245,158,11,0.15)"
              : "rgba(100,116,139,0.15)",
            color: verification.overallStatus === "VERIFIED" ? "#22c55e"
              : verification.overallStatus === "REJECTED" ? "#ef4444"
              : verification.overallStatus === "UNDER_REVIEW" ? "#f59e0b"
              : "#94a3b8",
          }}>
            {verification.overallStatus || "NOT STARTED"}
          </span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center px-6 py-3 border-b shrink-0 gap-0" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
        {steps.map((s, i) => {
          const done = i < currentStepIdx;
          const active = s === step;
          return (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{
                    background: done ? accent : active ? `${accent}20` : "rgba(100,116,139,0.15)",
                    border: `1px solid ${done || active ? accent : "rgba(100,116,139,0.3)"}`,
                    color: done ? "#000" : active ? accent : "#64748b",
                  }}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span className="text-[10px] font-medium" style={{ color: active ? accent : done ? "var(--ag-text)" : "#64748b" }}>
                  {stepLabel(s)}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="mx-2 h-px w-8" style={{ background: i < currentStepIdx ? accent : "rgba(100,116,139,0.2)" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">

          {/* ── Step 1: Select Tier ── */}
          {step === "select" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold mb-1" style={{ color: "var(--ag-text)" }}>Choose Your Terminal Tier</h2>
                <p className="text-xs" style={{ color: "var(--ag-muted)" }}>
                  Select the terminal you are applying for. Strict eligibility requirements apply to both.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NUR Finance R */}
                <div
                  onClick={() => setSelectedTier("NUR_FINANCE_R")}
                  className="p-5 rounded-xl border cursor-pointer transition-all"
                  style={{
                    borderColor: selectedTier === "NUR_FINANCE_R" ? accentR : "var(--ag-border)",
                    background: selectedTier === "NUR_FINANCE_R" ? `${accentR}08` : "var(--ag-surface)",
                    boxShadow: selectedTier === "NUR_FINANCE_R" ? `0 0 20px ${accentR}12` : "none",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg" style={{ background: `${accentR}20`, color: accentR }}>R</div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: accentR }}>NUR Finance R</div>
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>Reuters-Tier Terminal</div>
                    </div>
                  </div>
                  <div className="text-[11px] mb-3 leading-relaxed" style={{ color: "var(--ag-muted)" }}>Surpasses Reuters Eikon. Institutional data, media, and AI research.</div>
                  <div className="space-y-1.5 p-3 rounded-lg" style={{ background: "var(--ag-bg)" }}>
                    <div className="flex items-start gap-1.5 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <span style={{ color: accentR }}>✓</span>
                      <span><strong>Requirement:</strong> Minimum 1 year of Reuters usage</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px]" style={{ color: "#22c55e" }}>
                      <span>✓</span>
                      <span>No invitation required — open to all qualified applicants</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs font-bold" style={{ color: "var(--ag-muted)" }}>~€95,000 / year</div>
                </div>

                {/* NUR Finance B */}
                <div
                  onClick={() => setSelectedTier("NUR_FINANCE_B")}
                  className="p-5 rounded-xl border cursor-pointer transition-all relative"
                  style={{
                    borderColor: selectedTier === "NUR_FINANCE_B" ? accentB : "var(--ag-border)",
                    background: selectedTier === "NUR_FINANCE_B" ? `${accentB}06` : "var(--ag-surface)",
                    boxShadow: selectedTier === "NUR_FINANCE_B" ? `0 0 20px ${accentB}10` : "none",
                  }}
                >
                  <span className="absolute -top-2.5 right-3 text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: accentB, color: "#000" }}>
                    Invitation Only
                  </span>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg" style={{ background: `${accentB}20`, color: accentB }}>B</div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: accentB }}>NUR Finance B</div>
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>Bloomberg-Tier Terminal</div>
                    </div>
                  </div>
                  <div className="text-[11px] mb-3 leading-relaxed" style={{ color: "var(--ag-muted)" }}>Surpasses Bloomberg Terminal. DMA, FIX, algo deployment, the most powerful workstation ever built.</div>
                  <div className="space-y-1.5 p-3 rounded-lg" style={{ background: "var(--ag-bg)" }}>
                    <div className="flex items-start gap-1.5 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <span style={{ color: accentB }}>1</span>
                      <span><strong>Requirement 1:</strong> Minimum 1 year of Bloomberg usage</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <span style={{ color: accentB }}>2</span>
                      <span><strong>Requirement 2:</strong> Confirmed invitation from NUR Finance leadership</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px]" style={{ color: "#ef4444" }}>
                      <span>!</span>
                      <span>Both required. Bloomberg history alone is not sufficient.</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs font-bold" style={{ color: "var(--ag-muted)" }}>~€100,000 / year</div>
                </div>
              </div>

              {/* Transition Rules Summary */}
              <div className="p-4 rounded-xl border" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>Terminal Transition Rules</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
                    <div className="text-[10px] font-bold uppercase mb-2" style={{ color: "#22c55e" }}>Allowed</div>
                    <div className="space-y-1 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <div>Bloomberg user → NUR Finance B (1yr + invitation)</div>
                      <div>Reuters user → NUR Finance R (1yr history)</div>
                      <div>NUR Finance B → NUR Finance R (free, anytime)</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                    <div className="text-[10px] font-bold uppercase mb-2" style={{ color: "#ef4444" }}>Restricted</div>
                    <div className="space-y-1 text-[11px]" style={{ color: "var(--ag-text)" }}>
                      <div>NUR Finance R → NUR Finance B: Must purchase Bloomberg, use 1yr while keeping NUR R, then switch (+ invitation).</div>
                      <div className="font-semibold" style={{ color: "#ef4444" }}>Cancelling both Bloomberg + NUR R = permanent ban from NUR R.</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep("history")}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: accent, color: selectedTier === "NUR_FINANCE_B" ? "#000" : "#fff" }}
              >
                Proceed to Verification →
              </button>
            </div>
          )}

          {/* ── Step 2: Usage History ── */}
          {step === "history" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold mb-1" style={{ color: "var(--ag-text)" }}>
                  {isR ? "Reuters" : "Bloomberg"} Usage History Verification
                </h2>
                <p className="text-xs" style={{ color: "var(--ag-muted)" }}>
                  Confirm your {isR ? "Reuters" : "Bloomberg"} usage history. Minimum <strong>12 months</strong> of active usage is mandatory. Without this, access is <strong>denied</strong>.
                </p>
              </div>

              {/* Months slider */}
              <div className="p-5 rounded-xl border" style={{ borderColor: isHistoryEligible ? accent : "#ef4444", background: "var(--ag-surface)" }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold" style={{ color: "var(--ag-text)" }}>
                    Active {isR ? "Reuters" : "Bloomberg"} Usage History
                  </span>
                  <span className="text-lg font-black font-mono" style={{ color: isHistoryEligible ? "#22c55e" : "#ef4444" }}>
                    {months} <span className="text-xs font-normal">months</span>
                  </span>
                </div>

                <input
                  type="range" min={0} max={60} value={months}
                  onChange={e => setMonths(parseInt(e.target.value))}
                  className="w-full mb-3 cursor-pointer"
                  style={{ accentColor: isHistoryEligible ? "#22c55e" : "#ef4444" }}
                />

                <div className="flex justify-between text-[10px]" style={{ color: "var(--ag-muted)" }}>
                  <span>0 months</span>
                  <span className="font-bold" style={{ color: "#ef4444" }}>12 months (min)</span>
                  <span>60 months</span>
                </div>

                {/* Eligibility status */}
                <div className="mt-4 p-3 rounded-lg" style={{
                  background: isHistoryEligible ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                  border: `1px solid ${isHistoryEligible ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{isHistoryEligible ? "✓" : "✗"}</span>
                    <div>
                      <div className="text-xs font-bold" style={{ color: isHistoryEligible ? "#22c55e" : "#ef4444" }}>
                        {isHistoryEligible
                          ? `Eligible — ${months} months exceeds the 12-month minimum`
                          : `ACCESS DENIED — ${months} months is below the 12-month minimum`
                        }
                      </div>
                      {!isHistoryEligible && (
                        <div className="text-[11px] mt-0.5" style={{ color: "var(--ag-muted)" }}>
                          You need at least {12 - months} more month{12 - months === 1 ? "" : "s"} of {isR ? "Reuters" : "Bloomberg"} usage. No exceptions.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* What counts as usage */}
              <div className="p-4 rounded-xl border" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                <div className="text-[11px] font-bold uppercase mb-2" style={{ color: "var(--ag-muted)" }}>
                  Accepted Proof of {isR ? "Reuters" : "Bloomberg"} Usage
                </div>
                <ul className="space-y-1 text-[11px]" style={{ color: "var(--ag-text)" }}>
                  {isR ? [
                    "Reuters Eikon subscription invoice / statement (12+ consecutive months)",
                    "Reuters Workspace billing history",
                    "Employer letter confirming Reuters terminal access with dates",
                    "Reuters data feed contract / API licence",
                  ] : [
                    "Bloomberg Terminal subscription invoice / statement (12+ consecutive months)",
                    "Bloomberg Professional Service billing history",
                    "Employer letter confirming Bloomberg terminal access with dates",
                    "Bloomberg anywhere / Bloomberg enterprise data licence",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ color: accent }}>·</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("select")} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all" style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}>
                  ← Back
                </button>
                <button
                  onClick={() => {
                    if (!isHistoryEligible) {
                      addNotification({
                        title: `Access Denied: ${selectedTier === "NUR_FINANCE_R" ? "NUR Finance R" : "NUR Finance B"}`,
                        message: `Minimum 12 months of ${isR ? "Reuters" : "Bloomberg"} usage is required. You have ${months} months. Access denied.`,
                        severity: "CRITICAL", category: "COMPLIANCE",
                      });
                      updateVerification({ tier: selectedTier, [isR ? "reutersUsageMonths" : "bloombergUsageMonths"]: months, overallStatus: "REJECTED" });
                      return;
                    }
                    setStep(isR ? "document" : "invitation");
                  }}
                  disabled={!isHistoryEligible}
                  className="flex-2 flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: isHistoryEligible ? accent : "rgba(100,116,139,0.15)",
                    color: isHistoryEligible ? (selectedTier === "NUR_FINANCE_B" ? "#000" : "#fff") : "#64748b",
                    cursor: isHistoryEligible ? "pointer" : "not-allowed",
                  }}
                >
                  {isHistoryEligible ? "Continue →" : "Ineligible — Adjust History"}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3 (B only): Invitation Code ── */}
          {step === "invitation" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold mb-1" style={{ color: "var(--ag-text)" }}>Leadership Invitation Verification</h2>
                <p className="text-xs" style={{ color: "var(--ag-muted)" }}>
                  NUR Finance B requires a confirmed invitation from a person hand-selected by NUR Finance leadership. Bloomberg history alone is <strong>not sufficient</strong>.
                </p>
              </div>

              <div className="p-5 rounded-xl border" style={{ borderColor: accentB, background: `${accentB}06` }}>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase block mb-1" style={{ color: accentB }}>
                      VIP Invitation Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inviteCode}
                        onChange={e => { setInviteCode(e.target.value); setInviteVerified(false); setInviteError(""); }}
                        placeholder="NUR-VIP-XXXX or NUR-SOVEREIGN-KEY"
                        className="flex-1 p-2.5 rounded-lg text-xs font-mono outline-none"
                        style={{ background: "var(--ag-bg)", border: `1px solid ${inviteVerified ? "#22c55e" : "var(--ag-border)"}`, color: "var(--ag-text)" }}
                      />
                      <button
                        onClick={verifyInvitation}
                        disabled={!inviteCode.trim() || isVerifyingInvite || inviteVerified}
                        className="px-3 py-2 rounded-lg text-xs font-bold shrink-0 transition-all"
                        style={{
                          background: inviteVerified ? "rgba(34,197,94,0.15)" : `${accentB}20`,
                          border: `1px solid ${inviteVerified ? "#22c55e" : accentB}`,
                          color: inviteVerified ? "#22c55e" : accentB,
                        }}
                      >
                        {isVerifyingInvite ? "Verifying…" : inviteVerified ? "✓ Verified" : "Verify"}
                      </button>
                    </div>
                    {inviteError && <p className="text-[11px] mt-1" style={{ color: "#ef4444" }}>{inviteError}</p>}
                    {inviteVerified && <p className="text-[11px] mt-1" style={{ color: "#22c55e" }}>Invitation code accepted. Proceed to the next step.</p>}
                    <p className="text-[10px] mt-1" style={{ color: "var(--ag-muted)" }}>
                      Codes are issued only by NUR Finance leadership to hand-selected invitees. They are single-use and non-transferable.
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase block mb-1" style={{ color: accentB }}>
                      Confirmed Invitee Email (for identity handshake)
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="operator@institution.com"
                      className="w-full p-2.5 rounded-lg text-xs font-mono outline-none"
                      style={{ background: "var(--ag-bg)", border: "1px solid var(--ag-border)", color: "var(--ag-text)" }}
                    />
                    <p className="text-[10px] mt-1" style={{ color: "var(--ag-muted)" }}>
                      Must match the email the invitation was sent to. An email will be sent to confirm "I am at this address."
                    </p>
                  </div>
                </div>
              </div>

              {/* Access denied explanation */}
              {!inviteVerified && (
                <div className="p-4 rounded-xl border" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
                  <div className="flex items-start gap-2">
                    <span style={{ color: "#ef4444" }}>⚠</span>
                    <div className="text-[11px]" style={{ color: "#ef4444" }}>
                      <strong>Without a verified invitation code, access to NUR Finance B is denied — no exceptions.</strong> Bloomberg usage history satisfies Requirement 1 only. Requirement 2 (invitation) must also be satisfied independently.
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep("history")} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all" style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}>
                  ← Back
                </button>
                <button
                  onClick={() => { if (inviteVerified && inviteEmail) setStep("document"); }}
                  disabled={!inviteVerified || !inviteEmail}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: (inviteVerified && inviteEmail) ? accentB : "rgba(100,116,139,0.15)",
                    color: (inviteVerified && inviteEmail) ? "#000" : "#64748b",
                    cursor: (inviteVerified && inviteEmail) ? "pointer" : "not-allowed",
                  }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Document Upload ── */}
          {step === "document" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold mb-1" style={{ color: "var(--ag-text)" }}>Proof of Usage Document</h2>
                <p className="text-xs" style={{ color: "var(--ag-muted)" }}>
                  Upload a billing statement, invoice, or employer letter confirming your {isR ? "Reuters" : "Bloomberg"} usage history of at least 12 consecutive months.
                </p>
              </div>

              <div className="p-5 rounded-xl border space-y-4" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                <div>
                  <label className="text-[11px] font-bold uppercase block mb-1" style={{ color: "var(--ag-muted)" }}>Full Name (for compliance record)</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Full legal name"
                    className="w-full p-2.5 rounded-lg text-xs font-mono outline-none"
                    style={{ background: "var(--ag-bg)", border: "1px solid var(--ag-border)", color: "var(--ag-text)" }}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase block mb-1" style={{ color: "var(--ag-muted)" }}>
                    Proof of Usage Attestation (Invoice / Statement PDF)
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all" style={{ borderColor: uploadFileName ? accent : "var(--ag-border)", background: "var(--ag-bg)" }}>
                    <div className="px-3 py-1.5 rounded text-xs font-semibold" style={{ background: `${accent}15`, color: accent }}>
                      Choose File
                    </div>
                    <span className="text-[11px]" style={{ color: uploadFileName ? "var(--ag-text)" : "var(--ag-muted)" }}>
                      {uploadFileName || "No file selected — PDF or image required"}
                    </span>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setUploadFileName(e.target.files?.[0]?.name || null)} />
                  </label>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl border" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                <div className="text-xs font-bold uppercase mb-3" style={{ color: "var(--ag-muted)" }}>Application Summary</div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--ag-muted)" }}>Terminal tier</span>
                    <span className="font-bold" style={{ color: accent }}>{selectedTier === "NUR_FINANCE_R" ? "NUR Finance R" : "NUR Finance B"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--ag-muted)" }}>{isR ? "Reuters" : "Bloomberg"} history</span>
                    <span className="font-bold" style={{ color: "#22c55e" }}>{months} months ✓</span>
                  </div>
                  {!isR && (
                    <div className="flex justify-between">
                      <span style={{ color: "var(--ag-muted)" }}>Invitation code</span>
                      <span className="font-bold" style={{ color: inviteVerified ? "#22c55e" : "#ef4444" }}>
                        {inviteVerified ? "Verified ✓" : "Not verified ✗"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: "var(--ag-muted)" }}>Proof document</span>
                    <span className="font-bold" style={{ color: uploadFileName ? "#22c55e" : "#94a3b8" }}>
                      {uploadFileName ? `${uploadFileName} ✓` : "Not uploaded"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(isR ? "history" : "invitation")} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all" style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}>
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !fullName.trim() || !uploadFileName}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: (fullName.trim() && uploadFileName) ? accent : "rgba(100,116,139,0.15)",
                    color: (fullName.trim() && uploadFileName) ? (selectedTier === "NUR_FINANCE_B" ? "#000" : "#fff") : "#64748b",
                    cursor: (fullName.trim() && uploadFileName) ? "pointer" : "not-allowed",
                  }}
                >
                  {isSubmitting ? "Submitting…" : "Submit Application"}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 5: Submitted ── */}
          {step === "submitted" && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: `${accent}15`, border: `2px solid ${accent}` }}>
                <span className="text-4xl">✓</span>
              </div>
              <div>
                <h2 className="text-xl font-black mb-2" style={{ color: "var(--ag-text)" }}>Application Submitted</h2>
                <p className="text-sm" style={{ color: "var(--ag-muted)" }}>
                  Your {selectedTier === "NUR_FINANCE_R" ? "NUR Finance R" : "NUR Finance B"} application is under compliance review.
                </p>
              </div>
              <div className="p-5 rounded-xl border text-left space-y-2" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                <div className="text-xs font-bold uppercase mb-3" style={{ color: "var(--ag-muted)" }}>What Happens Next</div>
                {[
                  "Our compliance team will review your proof document within 24-48 hours",
                  selectedTier === "NUR_FINANCE_B" ? "Email identity confirmation will be sent to your provided address" : "",
                  "You will be notified via the NFS alerts system once your application is approved or if additional information is needed",
                  "Approved accounts receive access credentials and onboarding briefing",
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]" style={{ color: "var(--ag-text)" }}>
                    <span style={{ color: accent }}>{i + 1}.</span> {item}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveView("dashboard")}
                className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: accent, color: selectedTier === "NUR_FINANCE_B" ? "#000" : "#fff" }}
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
