import { NextRequest, NextResponse } from "next/server";
import { getPosts, addPost } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const sort = searchParams.get("sort") || "latest";

  const posts = getPosts({ category, sort });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author_id, title, content, category, tags } = body;

    if (!author_id || !title || !content || !category) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const id = addPost({
      author_id,
      title,
      content,
      category,
      tags: tags || [],
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建帖子失败" }, { status: 500 });
  }
}
