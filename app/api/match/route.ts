import { NextRequest, NextResponse } from "next/server";
import { getMatches, addMatchRequest, getStudent } from "@/lib/db";

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("student_id");
  if (!studentId) {
    return NextResponse.json({ matches: [] });
  }

  const matches = getMatches(Number(studentId));
  return NextResponse.json({ matches });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from_id, to_id, message } = body;

    if (!from_id || !to_id) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    if (from_id === to_id) {
      return NextResponse.json({ error: "不能向自己发送匹配请求" }, { status: 400 });
    }

    const fromStudent = getStudent(from_id);
    const toStudent = getStudent(to_id);

    if (!fromStudent) {
      return NextResponse.json({ error: "发送者不存在" }, { status: 404 });
    }
    if (!toStudent) {
      return NextResponse.json({ error: "接收者不存在" }, { status: 404 });
    }

    const id = addMatchRequest(from_id, to_id, message || "");

    return NextResponse.json({ id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("UNIQUE constraint failed")) {
      return NextResponse.json({ error: "你已经向该用户发送过匹配请求" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
