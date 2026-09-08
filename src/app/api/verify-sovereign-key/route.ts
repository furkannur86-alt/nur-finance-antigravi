import { NextRequest, NextResponse } from "next/server";

// Server-side only — the real passkey never ships to the client bundle and is never
// echoed back. Configure it via SOVEREIGN_ADMIN_PASSKEY in the deployment environment.
// Unset by default: the admin door stays locked until an admin explicitly sets one.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const passkey = typeof body?.passkey === "string" ? body.passkey.trim().toUpperCase() : "";

  if (!passkey) return NextResponse.json({ valid: false }, { status: 400 });

  const configured = process.env.SOVEREIGN_ADMIN_PASSKEY;
  const valid = !!configured && passkey === configured.trim().toUpperCase();

  return NextResponse.json({ valid });
}
