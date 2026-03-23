import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("student_id");
  if (!studentId) {
    return NextResponse.json({ matches: [] });
  }

  const { data } = await supabaseAdmin
    .from("match_requests")
    .select("*")
    .or(`from_id.eq.${studentId},to_id.eq.${studentId}`)
    .order("created_at", { ascending: false });

  return NextResponse.json({ matches: data || [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from_id, from_name, from_wechat, to_id, message, slot, user_id } = body;

    if (!to_id) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    // Check target exists
    const { data: toStudent } = await supabaseAdmin
      .from("students")
      .select("wechat")
      .eq("id", to_id)
      .single();

    if (!toStudent) {
      return NextResponse.json({ error: "接收者不存在" }, { status: 404 });
    }

    const fullMessage = slot ? `[时段:${slot}] ${message || ""}` : message || "";

    const { data, error } = await supabaseAdmin.from("match_requests").insert({
      from_id: from_id || 0,
      from_name: from_name || "",
      from_wechat: from_wechat || "",
      to_id,
      message: fullMessage,
      slot: slot || "",
      user_id: user_id || null,
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, partner_wechat: toStudent.wechat }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
