import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = Number(id);

  // Increment views
  const { data: viewData } = await supabaseAdmin.from("posts").select("views").eq("id", postId).single();
  if (viewData) {
    await supabaseAdmin.from("posts").update({ views: (viewData.views || 0) + 1 }).eq("id", postId);
  }

  const { data: post, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error || !post) {
    return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
  }

  // Get author
  let author_name = "";
  if (post.author_id) {
    const { data: author } = await supabaseAdmin.from("students").select("name").eq("id", post.author_id).single();
    author_name = author?.name || "";
  }

  // Get comments
  const { data: comments } = await supabaseAdmin
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  // Enrich comments with author names
  const enrichedComments = await Promise.all((comments || []).map(async (c) => {
    let cAuthor = "";
    if (c.author_id) {
      const { data: a } = await supabaseAdmin.from("students").select("name").eq("id", c.author_id).single();
      cAuthor = a?.name || "";
    }
    return { ...c, author_name: cAuthor };
  }));

  return NextResponse.json({
    post: { ...post, author_name, comments: enrichedComments },
  });
}
