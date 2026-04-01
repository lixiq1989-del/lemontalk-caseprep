import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("student_id");
  if (!studentId) return NextResponse.json({ reviews: [] });

  const { data, error } = await supabaseAdmin
    .from("partner_reviews")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ reviews: [] });

  const reviews = data || [];
  const avg =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : null;

  return NextResponse.json({ reviews, avg, count: reviews.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_id, rating, tags, comment, reviewer_name, reviewer_wechat } = body;

    if (!student_id || !rating) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "评分需在1-5之间" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("partner_reviews")
      .insert({
        student_id,
        rating,
        tags: tags || [],
        comment: comment || "",
        reviewer_name: reviewer_name || "匿名用户",
        reviewer_wechat: reviewer_wechat || "",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
