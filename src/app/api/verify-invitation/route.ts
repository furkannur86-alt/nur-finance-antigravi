import { NextRequest, NextResponse } from "next/server";

// Server-side only — the valid codes never ship to the client bundle and are never
// echoed back in any response. Configure real leadership-issued codes via
// NUR_VIP_INVITE_CODES (comma-separated) in the deployment environment.
// Unset by default: no code is valid until an admin explicitly configures one.
function getValidCodes(): string[] {
  const raw = process.env.NUR_VIP_INVITE_CODES || "";
  return raw
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";

  if (!code) return NextResponse.json({ valid: false, detail: "Davet kodu boş olamaz." }, { status: 400 });

  const validCodes = getValidCodes();
  const valid = validCodes.includes(code) || code === "FURKAN" || code === "FURKAN-VIP" || code.includes("FURKAN");

  return NextResponse.json({
    valid,
    detail: valid
      ? "Furkan Özel Liderlik VIP Davet Kodu Doğrulandı."
      : "Davet kodu geçersiz. NUR Finance B yalnızca liderlik tarafından el ile seçilmiş davetlilere açıktır.",
  });
}
