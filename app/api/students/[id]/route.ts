import { NextRequest, NextResponse } from "next/server";
import { getStudent } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const student = getStudent(Number(id));

  if (!student) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  // Sessions not tracked in memory store for now
  const sessions: unknown[] = [];

  return NextResponse.json({ student, sessions });
}
