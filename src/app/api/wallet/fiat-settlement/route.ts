import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * NUR Finance Fiat Settlement Gateway
 * SEPA/SWIFT IBAN withdrawal queue for KYC-verified users.
 *
 * Production integration:
 *   - Stripe Treasury (EUR SEPA)
 *   - Banking API (Railsbank / Swan / Solaris)
 *   - NurCoin.sol requestFiatWithdrawal() on-chain confirmation
 */

export type FiatStatus = "pending" | "kyc_review" | "approved" | "processing" | "settled" | "rejected";
export type Currency = "EUR" | "USD" | "GBP" | "TRY";

export interface FiatRequest {
  id: string;
  userId: string;
  walletAddress?: string;
  nurAmountFloat: number;       // NUR amount (float, not wei)
  requestedCurrency: Currency;
  requestedAmount: number;      // In requested currency
  nurToFxRate: number;          // NUR/EUR rate at time of request
  ibanHash: string;             // SHA-256 of IBAN (IBAN not stored)
  swiftBic: string;
  beneficiaryName: string;
  status: FiatStatus;
  createdAt: string;
  updatedAt: string;
  settlementTxHash?: string;    // On-chain burn tx hash
  notes?: string;
}

// In-memory queue (replace with Supabase in production)
const fiatQueue: FiatRequest[] = [];

// NUR/EUR exchange rate — in production fetched from DEX/oracle
const NUR_EUR_RATE = 0.10; // 1 NUR = €0.10 (seed/beta pricing)
const MIN_WITHDRAWAL_NUR = 100;   // 100 NUR minimum = €10
const MAX_WITHDRAWAL_NUR = 50_000; // €5,000 per request (KYC limits)
const SETTLEMENT_FEE_PERCENT = 1.5; // 1.5% processing fee

/**
 * GET /api/wallet/fiat-settlement
 * Returns user's settlement requests.
 */
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    const req = fiatQueue.find(r => r.id === id);
    if (!req) return NextResponse.json({ ok: false, error: "Request not found" }, { status: 404 });
    return NextResponse.json({ ok: true, request: req });
  }

  if (userId) {
    const userReqs = fiatQueue.filter(r => r.userId === userId);
    return NextResponse.json({ ok: true, requests: userReqs, count: userReqs.length });
  }

  // Sovereign admin: return all (paginated)
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "20"), 100);
  const offset = (page - 1) * limit;
  const filtered = fiatQueue.slice(offset, offset + limit);

  return NextResponse.json({
    ok: true,
    requests: filtered,
    total: fiatQueue.length,
    page,
    limit,
  });
}

/**
 * POST /api/wallet/fiat-settlement
 * Submit a new SEPA/SWIFT withdrawal request.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = body;

  // ── SUBMIT REQUEST ────────────────────────────────────────────────────────
  if (!action || action === "submit") {
    const {
      userId, walletAddress,
      nurAmount, currency,
      iban, swiftBic, beneficiaryName,
    } = body;

    if (!userId || !nurAmount || !iban || !swiftBic || !beneficiaryName) {
      return NextResponse.json({
        ok: false,
        error: "Missing required fields: userId, nurAmount, iban, swiftBic, beneficiaryName",
      }, { status: 400 });
    }

    const nur = Number(nurAmount);
    if (isNaN(nur) || nur < MIN_WITHDRAWAL_NUR) {
      return NextResponse.json({
        ok: false,
        error: `Minimum withdrawal is ${MIN_WITHDRAWAL_NUR} NUR`,
      }, { status: 422 });
    }
    if (nur > MAX_WITHDRAWAL_NUR) {
      return NextResponse.json({
        ok: false,
        error: `Maximum per-request withdrawal is ${MAX_WITHDRAWAL_NUR} NUR. Submit multiple requests for larger amounts.`,
      }, { status: 422 });
    }

    const selectedCurrency = (currency as Currency) || "EUR";
    const grossEur = nur * NUR_EUR_RATE;
    const feeEur = grossEur * (SETTLEMENT_FEE_PERCENT / 100);
    const netEur = grossEur - feeEur;

    // Currency conversion (EUR base)
    const fxRates: Record<Currency, number> = { EUR: 1, USD: 1.08, GBP: 0.87, TRY: 35.2 };
    const fxRate = fxRates[selectedCurrency] ?? 1;
    const netAmount = netEur * fxRate;

    // Hash IBAN — never store plaintext
    const ibanHash = crypto.createHash("sha256")
      .update(`${String(iban).replace(/\s/g, "").toUpperCase()}:${userId}`)
      .digest("hex");

    const now = new Date().toISOString();
    const id = `fiat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const fiatRequest: FiatRequest = {
      id,
      userId: String(userId),
      walletAddress: walletAddress ? String(walletAddress) : undefined,
      nurAmountFloat: nur,
      requestedCurrency: selectedCurrency,
      requestedAmount: Math.round(netAmount * 100) / 100,
      nurToFxRate: NUR_EUR_RATE,
      ibanHash,
      swiftBic: String(swiftBic).toUpperCase(),
      beneficiaryName: String(beneficiaryName),
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    fiatQueue.push(fiatRequest);

    return NextResponse.json({
      ok: true,
      request: fiatRequest,
      breakdown: {
        nurAmount: nur,
        nurToEurRate: NUR_EUR_RATE,
        grossEur: Math.round(grossEur * 100) / 100,
        feePercent: SETTLEMENT_FEE_PERCENT,
        feeEur: Math.round(feeEur * 100) / 100,
        netEur: Math.round(netEur * 100) / 100,
        currency: selectedCurrency,
        netAmount: Math.round(netAmount * 100) / 100,
        estimatedSettlement: "3–5 SEPA business days",
      },
      nextSteps: [
        "KYC verification required if not completed",
        `NurCoin.sol will lock ${nur} NUR on-chain upon KYC approval`,
        "SEPA transfer initiated after on-chain lock confirmed",
        "NUR burned upon SEPA settlement confirmation",
      ],
    });
  }

  // ── SOVEREIGN ADMIN: UPDATE STATUS ────────────────────────────────────────
  if (action === "update_status") {
    const { requestId, status, txHash, notes } = body;
    if (!requestId || !status) {
      return NextResponse.json({ ok: false, error: "Missing requestId or status" }, { status: 400 });
    }
    const req = fiatQueue.find(r => r.id === String(requestId));
    if (!req) return NextResponse.json({ ok: false, error: "Request not found" }, { status: 404 });

    req.status = status as FiatStatus;
    req.updatedAt = new Date().toISOString();
    if (txHash) req.settlementTxHash = String(txHash);
    if (notes) req.notes = String(notes);

    return NextResponse.json({ ok: true, request: req });
  }

  // ── ESTIMATE (before submitting) ──────────────────────────────────────────
  if (action === "estimate") {
    const { nurAmount, currency } = body;
    const nur = Number(nurAmount) || 0;
    const selectedCurrency = (currency as Currency) || "EUR";
    const fxRates: Record<Currency, number> = { EUR: 1, USD: 1.08, GBP: 0.87, TRY: 35.2 };
    const grossEur = nur * NUR_EUR_RATE;
    const feeEur = grossEur * (SETTLEMENT_FEE_PERCENT / 100);
    const netEur = grossEur - feeEur;
    const fxRate = fxRates[selectedCurrency] ?? 1;
    const netAmount = netEur * fxRate;

    return NextResponse.json({
      ok: true,
      estimate: {
        nurAmount: nur,
        currency: selectedCurrency,
        nurToEurRate: NUR_EUR_RATE,
        grossEur: Math.round(grossEur * 100) / 100,
        feePercent: SETTLEMENT_FEE_PERCENT,
        feeEur: Math.round(feeEur * 100) / 100,
        netAmount: Math.round(netAmount * 100) / 100,
        minNUR: MIN_WITHDRAWAL_NUR,
        maxNUR: MAX_WITHDRAWAL_NUR,
      },
    });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
