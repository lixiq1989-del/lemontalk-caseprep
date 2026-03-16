import { NextRequest, NextResponse } from "next/server";
import { toggleLike } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { student_id } = body;

    if (!student_id) {
      return NextResponse.json({ error: "缺少student_id" }, { status: 400 });
    }

    const result = toggleLike(Number(id), student_id);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
