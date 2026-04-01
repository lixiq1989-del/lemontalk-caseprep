import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, records } = body;
    if (!user_id || !records?.length) {
      return NextResponse.json({ ok: true });
    }
    const rows = records.map((r: { category: string; correct: boolean; question_id?: string }) => ({
      user_id,
      category: r.category,
      correct: r.correct,
      question_id: r.question_id || null,
    }));
    await supabaseAdmin.from("drill_records").insert(rows);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
