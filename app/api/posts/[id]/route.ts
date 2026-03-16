import { NextRequest, NextResponse } from "next/server";
import { getPost } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = getPost(Number(id));

  if (!post) {
    return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
  }

  return NextResponse.json(post);
}
