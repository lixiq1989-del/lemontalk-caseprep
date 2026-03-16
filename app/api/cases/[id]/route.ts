import { NextRequest, NextResponse } from "next/server";
import { getCase } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const case_item = getCase(Number(id));

  if (!case_item) {
    return NextResponse.json({ error: "Case 不存在" }, { status: 404 });
  }

  return NextResponse.json({ case_item });
}
