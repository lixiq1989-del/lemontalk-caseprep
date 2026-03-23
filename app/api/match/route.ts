import { NextRequest, NextResponse } from "next/server";
import { getMatches, addMatchRequest, getStudent, addStudent } from "@/lib/db";

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
    const { from_id, from_name, from_wechat, to_id, message, slot } = body;

    if (!to_id) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const toStudent = getStudent(to_id);
    if (!toStudent) {
      return NextResponse.json({ error: "接收者不存在" }, { status: 404 });
    }

    // Support both old (from_id) and new (from_name + from_wechat) flow
    let actualFromId = from_id;

    if (!actualFromId && from_name && from_wechat) {
      // Auto-create or find student by wechat
      try {
        actualFromId = addStudent({
          name: from_name,
          wechat: from_wechat,
          school: "未填写",
        });
      } catch {
        // wechat already exists - that's fine, just use message-based matching
        actualFromId = 0;
      }
    }

    if (!actualFromId) {
      actualFromId = 0; // anonymous booking
    }

    if (actualFromId === to_id) {
      return NextResponse.json({ error: "不能向自己发送匹配请求" }, { status: 400 });
    }

    const fullMessage = slot
      ? `[时段:${slot}] ${message || ""}`
      : message || "";

    const id = addMatchRequest(actualFromId, to_id, fullMessage);

    return NextResponse.json({
      id,
      partner_wechat: toStudent.wechat,
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("UNIQUE constraint failed")) {
      return NextResponse.json({ error: "你已经向该用户发送过匹配请求" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
