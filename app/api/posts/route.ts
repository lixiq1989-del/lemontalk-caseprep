import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  let query = supabaseAdmin.from("posts").select("*");

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (sort === "popular") {
    query = query.order("pinned", { ascending: false }).order("likes", { ascending: false });
  } else {
    query = query.order("pinned", { ascending: false }).order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Enrich with comment count
  const posts = await Promise.all((data || []).map(async (p) => {
    let author_name = "";
    if (p.author_id) {
      const { data: author } = await supabaseAdmin.from("students").select("name").eq("id", p.author_id).single();
      author_name = author?.name || "";
    }
    const { count } = await supabaseAdmin.from("comments").select("*", { count: "exact", head: true }).eq("post_id", p.id);
    return { ...p, author_name, comment_count: count || 0 };
  }));

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author_id, title, content, category, tags, user_id } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "标题和内容不能为空" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.from("posts").insert({
      author_id: author_id || null,
      title,
      content,
      category: category || "general",
      tags: tags || [],
      user_id: user_id || null,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
