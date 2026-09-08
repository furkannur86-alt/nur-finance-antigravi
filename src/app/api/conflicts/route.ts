import { NextResponse } from "next/server";
import { getConflictSummary } from "@/lib/conflicts/acled";

export async function GET() {
  try {
    const summary = await getConflictSummary();
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch conflict data" },
      { status: 500 },
    );
  }
}
