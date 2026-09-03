"use client";

import { useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { VerificationProductTier } from "@/types";
import EagleCrest from "@/components/ui/EagleCrest";

export default function VerificationPanel() {
  const { verification, updateVerification, addNotification } = useIDEStore();

  const [selectedTier, setSelectedTier] = useState<VerificationProductTier>(verification.tier || "NUR_FINANCE_R");
  const [reutersMonths, setReutersMonths] = useState(verification.reutersUsageMonths || 14);
  const [bloombergMonths, setBloombergMonths] = useState(verification.bloombergUsageMonths || 0);
  const [inviteCode, setInviteCode] = useState(verification.invitationCode || "");
  const [emailInput, setEmailInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);

  const isReutersEligible = reutersMonths >= 12;
  const isBloombergHistoryEligible = bloombergMonths >= 12;
  const isInviteCodeValid = inviteCode.trim().toUpperCase() === "NUR-VIP-2026" || inviteCode.trim().toUpperCase() === "SIMONS-FOUNDER";

  const handleVerifySubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      if (selectedTier === "NUR_FINANCE_R") {
        if (!isReutersEligible) {
          addNotification({
            title: "Verification Denied: NUR Finance R",
            message: "Application requires minimum 12 months of verifiable Reuters usage history.",
            severity: "CRITICAL",
            category: "COMPLIANCE",
          });
          return;
        }

        updateVerification({
          tier: "NUR_FINANCE_R",
          reutersUsageMonths: reutersMonths,
          documentUploaded: true,
          overallStatus: "VERIFIED",
          activatedAt: new Date().toISOString(),
        });

        addNotification({
          title: "Access Granted: NUR Finance R",
          message: "1-Year Reuters usage verified. Reuters-tier terminal privileges activated.",
          severity: "SUCCESS",
          category: "COMPLIANCE",
        });
      } else {
        // NUR Finance B
        if (!isBloombergHistoryEligible) {
          addNotification({
            title: "Verification Denied: NUR Finance B",
            message: "Prerequisite 1 failed: Minimum 12 months of Bloomberg history is required.",
            severity: "CRITICAL",
            category: "COMPLIANCE",
          });
          return;
        }

        if (!isInviteCodeValid) {
          addNotification({
            title: "Verification Denied: NUR Finance B",
            message: "Prerequisite 2 failed: Valid VIP handpicked invitation code required.",
            severity: "CRITICAL",
            category: "COMPLIANCE",
          });
          return;
        }

        updateVerification({
          tier: "NUR_FINANCE_B",
          bloombergUsageMonths: bloombergMonths,
          invitationCode: inviteCode,
          invitationVerified: true,
          emailConfirmed: true,
          documentUploaded: true,
          overallStatus: "VERIFIED",
          activatedAt: new Date().toISOString(),
        });

        addNotification({
          title: "VIP Access Activated: NUR Finance B",
          message: "Bloomberg history & VIP leadership invitation confirmed. Bloomberg-tier terminal active.",
          severity: "SUCCESS",
          category: "COMPLIANCE",
        });
      }
    }, 800);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b shrink-0 select-none"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={32} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--ag-accent)]">NUR Finance B & R VIP Verification Portal</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-400">
                STRICT COMPLIANCE GATEWAY
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              Enforcing Institutional Bloomberg / Reuters Usage History & Handpicked Leadership Invitations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[var(--ag-muted)]">Status:</span>
          <span
            className={`px-2 py-0.5 rounded font-bold ${
              verification.overallStatus === "VERIFIED"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-amber-500/20 text-amber-400"
            }`}
          >
            {verification.overallStatus}
          </span>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {/* Product Tier Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NUR Finance R */}
            <div
              onClick={() => setSelectedTier("NUR_FINANCE_R")}
              className={`p-5 rounded-lg border cursor-pointer transition-all ${
                selectedTier === "NUR_FINANCE_R"
                  ? "bg-[rgba(0,212,170,0.1)] border-[var(--ag-accent)] shadow-lg shadow-[rgba(0,212,170,0.1)]"
                  : "bg-black/30 border-[var(--ag-border)] opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white">NUR Finance R</span>
                <span className="text-xs font-mono text-[var(--ag-accent)]">&sim;&euro;100K / yr</span>
              </div>
              <p className="text-xs text-[var(--ag-muted)] mb-3">
                Reuters-tier institutional terminal. Surpasses Reuters Eikon.
              </p>
              <div className="text-[11px] font-mono text-emerald-400">
                &bull; Prerequisite: Minimum 1 year active Reuters usage history.
              </div>
              <div className="text-[10px] text-[var(--ag-muted)] mt-1">
                No invitation required. Open to all certified Reuters operators.
              </div>
            </div>

            {/* NUR Finance B */}
            <div
              onClick={() => setSelectedTier("NUR_FINANCE_B")}
              className={`p-5 rounded-lg border cursor-pointer transition-all ${
                selectedTier === "NUR_FINANCE_B"
                  ? "bg-[rgba(99,102,241,0.12)] border-[var(--ag-accent2)] shadow-lg shadow-[rgba(99,102,241,0.15)]"
                  : "bg-black/30 border-[var(--ag-border)] opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white">NUR Finance B</span>
                <span className="text-xs font-mono text-[var(--ag-accent2)]">&sim;&euro;100K / yr</span>
              </div>
              <p className="text-xs text-[var(--ag-muted)] mb-3">
                Bloomberg-tier flagship terminal. Surpasses Bloomberg Terminal.
              </p>
              <div className="text-[11px] font-mono text-indigo-300">
                &bull; Prerequisite 1: Minimum 1 year active Bloomberg usage.
              </div>
              <div className="text-[11px] font-mono text-amber-300 mt-0.5">
                &bull; Prerequisite 2: Handpicked VIP leadership invitation code.
              </div>
            </div>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleVerifySubmission} className="p-5 rounded-lg border bg-black/40 space-y-4" style={{ borderColor: "var(--ag-border)" }}>
            <h3 className="text-sm font-bold text-white">
              Verification Dossier: {selectedTier === "NUR_FINANCE_R" ? "Reuters-Tier" : "Bloomberg-Tier (VIP)"}
            </h3>

            {/* Usage History Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="text-[var(--ag-muted)] font-semibold uppercase">
                  {selectedTier === "NUR_FINANCE_R" ? "Reuters Active Usage History" : "Bloomberg Active Usage History"}
                </label>
                <span className="font-mono text-white font-bold">
                  {selectedTier === "NUR_FINANCE_R" ? reutersMonths : bloombergMonths} Months
                  {(selectedTier === "NUR_FINANCE_R" ? reutersMonths : bloombergMonths) >= 12 && (
                    <span className="text-[var(--ag-success)] ml-2">(&ge; 1 Year OK)</span>
                  )}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={selectedTier === "NUR_FINANCE_R" ? reutersMonths : bloombergMonths}
                onChange={(e) =>
                  selectedTier === "NUR_FINANCE_R"
                    ? setReutersMonths(parseInt(e.target.value))
                    : setBloombergMonths(parseInt(e.target.value))
                }
                className="w-full accent-[var(--ag-accent)] cursor-pointer"
              />
            </div>

            {/* If NUR Finance B: Invitation Code & Email Handshake */}
            {selectedTier === "NUR_FINANCE_B" && (
              <div className="p-4 rounded border bg-indigo-950/20 border-indigo-500/30 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-indigo-300 uppercase block mb-1">
                    VIP Invitation Code (Issued by NFS Leadership)
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="e.g. NUR-VIP-2026 or SIMONS-FOUNDER"
                    className="w-full p-2 rounded text-xs bg-black/50 border text-white font-mono focus:outline-none focus:border-indigo-400"
                    style={{ borderColor: "var(--ag-border)" }}
                  />
                  <span className="text-[10px] text-[var(--ag-muted)] mt-1 block">
                    Demo bypass codes: <code className="text-white">NUR-VIP-2026</code> or <code className="text-white">SIMONS-FOUNDER</code>
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-indigo-300 uppercase block mb-1">
                    Confirmed Invitee Corporate Email
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="operator@institution.com"
                    className="w-full p-2 rounded text-xs bg-black/50 border text-white font-mono focus:outline-none focus:border-indigo-400"
                    style={{ borderColor: "var(--ag-border)" }}
                  />
                </div>
              </div>
            )}

            {/* Document Proof Upload Simulator */}
            <div>
              <label className="text-[11px] font-semibold text-[var(--ag-muted)] uppercase block mb-1">
                Proof of Usage Attestation (Invoice / Statement PDF)
              </label>
              <div className="flex items-center gap-3">
                <label className="px-3 py-1.5 rounded bg-white/5 border border-[var(--ag-border)] hover:border-[var(--ag-accent)] text-xs text-[var(--ag-text)] cursor-pointer transition-colors">
                  Choose Attestation File...
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setUploadFileName(e.target.files?.[0]?.name || "attestation_proof.pdf")}
                  />
                </label>
                <span className="text-xs text-[var(--ag-muted)] font-mono">
                  {uploadFileName || "No document selected (optional in demo)"}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded text-xs font-bold uppercase tracking-wider bg-[var(--ag-accent)] hover:bg-[var(--ag-accent)]/80 text-black transition-all shadow-lg shadow-[rgba(0,212,170,0.2)] disabled:opacity-40"
            >
              {isVerifying ? "VERIFYING CREDENTIALS & INVITES..." : `AUTHENTICATE FOR ${selectedTier.replace("_", " ")}`}
            </button>
          </form>

          {/* Transition Policy Alert */}
          <div className="p-4 rounded-lg border bg-amber-950/20 border-amber-500/30 text-xs leading-relaxed space-y-2">
            <div className="font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <span>&#9888; Critical Transition Rules & Safeguards</span>
            </div>
            <p className="text-[var(--ag-muted)]">
              <strong>NUR Finance B &rarr; NUR Finance R:</strong> Free transition at any time without penalty.
            </p>
            <p className="text-[var(--ag-muted)]">
              <strong>NUR Finance R &rarr; NUR Finance B:</strong> User must purchase a Bloomberg subscription, use Bloomberg for 1 full year while keeping NUR Finance R active, and obtain handpicked invitation confirmation.
            </p>
            <p className="text-red-400 font-semibold">
              WARNING: If the user cancels BOTH Bloomberg AND NUR Finance R during this transition process, they permanently lose access to NUR Finance R as well. No reinstatement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
