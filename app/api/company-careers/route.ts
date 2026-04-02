import { NextResponse } from "next/server";
import { COMPANIES } from "@/lib/company-careers";

// Returns the full company career database for frontend display
export async function GET() {
  return NextResponse.json({ companies: COMPANIES });
}
