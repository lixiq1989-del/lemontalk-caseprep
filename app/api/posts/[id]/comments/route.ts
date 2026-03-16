import { NextRequest, NextResponse } from "next/server";
import { addComment } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { author_id, content } = body;

    if (!author_id || !content) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const comment = addComment(Number(id), author_id, content);

    if (!comment) {
      return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "评论失败" }, { status: 500 });
  }
}
