import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const firm = searchParams.get("firm");
  const caseType = searchParams.get("case_type");

  let query = supabaseAdmin.from("students").select("*").eq("active", true).order("created_at", { ascending: false });

  if (level) query = query.eq("level", level);
  if (firm) query = query.contains("target_firms", [firm]);
  if (caseType) query = query.contains("case_types", [caseType]);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ students: data || [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, wechat, school, target_firms, level, case_types, availability, language, bio, user_id } = body;

    if (!name || !wechat || !school) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.from("students").insert({
      name,
      wechat,
      school,
      target_firms: target_firms || [],
      level: level || "beginner",
      case_types: case_types || [],
      availability: availability || [],
      language: language || "Both",
      bio: bio || "",
      user_id: user_id || null,
    }).select().single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "该微信号已注册" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
