import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const passkey = typeof body?.passkey === "string" ? body.passkey.trim() : "";

  if (!passkey) return NextResponse.json({ valid: false, error: "PASSKEY_REQUIRED" }, { status: 400 });

  const configured = (process.env.ADMIN_PASSKEY || "").trim();
  if (!configured) {
    return NextResponse.json({ valid: false, error: "ADMIN_PASSKEY_NOT_CONFIGURED" }, { status: 503 });
  }

  const valid = passkey === configured;

  if (!valid) {
    return NextResponse.json({ valid: false, error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  return NextResponse.json({
    valid: true,
    role: "admin",
    timestamp: new Date().toISOString(),
  });
}
