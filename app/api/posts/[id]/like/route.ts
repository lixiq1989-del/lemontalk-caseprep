import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = Number(id);

  try {
    const body = await request.json();
    const studentId = body.student_id;

    // Get current likes
    const { data: post } = await supabaseAdmin.from("posts").select("likes").eq("id", postId).single();
    if (!post) return NextResponse.json({ error: "帖子不存在" }, { status: 404 });

    // Simple toggle - just increment/decrement (no per-user tracking for now)
    const newLikes = (post.likes || 0) + (body.unlike ? -1 : 1);
    await supabaseAdmin.from("posts").update({ likes: Math.max(0, newLikes) }).eq("id", postId);

    return NextResponse.json({ liked: !body.unlike, likes: Math.max(0, newLikes), student_id: studentId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
