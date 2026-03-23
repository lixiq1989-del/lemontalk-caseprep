import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "未上传文件" }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    // For PDF: use a simple text extraction approach
    if (name.endsWith(".pdf")) {
      // Extract text from PDF using raw buffer parsing
      // This is a simple approach - extracts text between BT/ET operators
      const text = extractTextFromPDF(buffer);
      if (text.trim()) {
        return NextResponse.json({ text: text.trim() });
      }
      // Fallback: return raw content as-is
      return NextResponse.json({
        text: "[PDF 解析失败，请手动复制简历文字粘贴到下方文本框]",
        error: "PDF 格式复杂，建议手动粘贴",
      });
    }

    // For plain text / docx
    if (name.endsWith(".txt") || name.endsWith(".md")) {
      const text = buffer.toString("utf-8");
      return NextResponse.json({ text });
    }

    if (name.endsWith(".docx")) {
      // Simple docx extraction - docx is a zip containing XML
      const text = await extractTextFromDocx(buffer);
      return NextResponse.json({ text });
    }

    return NextResponse.json(
      { error: "不支持的文件格式，请上传 PDF、DOCX 或 TXT" },
      { status: 400 }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "解析失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function extractTextFromPDF(buffer: Buffer): string {
  // Simple PDF text extraction - works for most text-based PDFs
  const content = buffer.toString("latin1");
  const texts: string[] = [];

  // Method 1: Extract text between parentheses in BT/ET blocks
  const btRegex = /BT\s([\s\S]*?)ET/g;
  let match;
  while ((match = btRegex.exec(content)) !== null) {
    const block = match[1];
    // Extract text in parentheses (literal strings)
    const strRegex = /\(([^)]*)\)/g;
    let strMatch;
    while ((strMatch = strRegex.exec(block)) !== null) {
      const decoded = strMatch[1]
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "")
        .replace(/\\\\/g, "\\")
        .replace(/\\([()])/g, "$1");
      if (decoded.trim()) texts.push(decoded);
    }
  }

  // Method 2: Try to extract from stream objects
  if (texts.length === 0) {
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    while ((match = streamRegex.exec(content)) !== null) {
      const stream = match[1];
      const strRegex = /\(([^)]*)\)/g;
      let strMatch;
      while ((strMatch = strRegex.exec(stream)) !== null) {
        const decoded = strMatch[1].replace(/\\[nrt]/g, " ").trim();
        if (decoded.length > 1) texts.push(decoded);
      }
    }
  }

  return texts.join(" ").replace(/\s+/g, " ").trim();
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  // docx is a ZIP file, we need to find word/document.xml and extract text
  // Simple approach: find XML content and strip tags
  const content = buffer.toString("utf-8");

  // Look for <w:t> tags which contain the text in docx XML
  const texts: string[] = [];
  const tagRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    texts.push(match[1]);
  }

  if (texts.length > 0) {
    return texts.join(" ");
  }

  // Fallback: try to find any readable text
  const readable = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  // Filter out binary garbage
  const cleanText = readable.replace(/[^\x20-\x7E\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g, " ");
  return cleanText.substring(0, 5000);
}
