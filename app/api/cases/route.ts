import { NextRequest, NextResponse } from "next/server";
import { getCases } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || undefined;
  const difficulty = searchParams.get("difficulty") || undefined;
  const industry = searchParams.get("industry") || undefined;

  const cases = getCases({ type, difficulty, industry });

  return NextResponse.json({ cases });
}
