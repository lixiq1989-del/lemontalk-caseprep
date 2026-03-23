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
    const { author_id, content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "评论不能为空" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.from("comments").insert({
      post_id: postId,
      author_id: author_id || null,
      content: content.trim(),
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Get author name
    let author_name = "";
    if (data.author_id) {
      const { data: author } = await supabaseAdmin.from("students").select("name").eq("id", data.author_id).single();
      author_name = author?.name || "";
    }

    return NextResponse.json({ ...data, author_name }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
