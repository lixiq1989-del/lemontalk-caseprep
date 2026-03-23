import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: student, error } = await supabaseAdmin
    .from("students")
    .select("*")
    .eq("id", Number(id))
    .eq("active", true)
    .single();

  if (error || !student) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  return NextResponse.json({ student, sessions: [] });
}
