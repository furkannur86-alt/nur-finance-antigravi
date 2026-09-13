import { NextResponse } from "next/server";
import {
  allFleet,
  getFleetStats,
  CIVILIZATIONS_LIST,
} from "@/lib/broadcast/civilizationalShips";

export async function GET() {
  try {
    const stats = getFleetStats();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats,
      civilizations: CIVILIZATIONS_LIST,
      fleet: allFleet,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
