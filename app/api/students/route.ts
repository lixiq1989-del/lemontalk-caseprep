import { NextRequest, NextResponse } from "next/server";
import { getStudents, addStudent } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") || undefined;
  const firm = searchParams.get("firm") || undefined;
  const caseType = searchParams.get("case_type") || undefined;

  const students = getStudents({ level, firm, caseType });

  return NextResponse.json({ students });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, wechat, school, target_firms, level, case_types, availability, language, bio } = body;

    if (!name || !wechat || !school) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const id = addStudent({
      name,
      wechat,
      school,
      target_firms: target_firms || [],
      level: level || "beginner",
      case_types: case_types || [],
      availability: availability || [],
      language: language || "Both",
      bio: bio || "",
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("UNIQUE constraint failed: students.wechat")) {
      return NextResponse.json({ error: "该微信号已注册" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
