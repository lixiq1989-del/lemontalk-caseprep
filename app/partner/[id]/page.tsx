import { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-server";
import PartnerProfileClient from "./PartnerProfileClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: student } = await supabaseAdmin
    .from("students")
    .select("name, school, level, target_firms, bio")
    .eq("id", Number(id))
    .single();

  if (!student) {
    return { title: "Case Partner | CasePrep" };
  }

  const levelMap: Record<string, string> = {
    beginner: "初学者",
    intermediate: "进阶",
    advanced: "高级",
  };

  const firms = student.target_firms?.slice(0, 3).join("/") || "咨询";
  const desc =
    student.bio ||
    `${student.school} · ${levelMap[student.level] || ""} · 目标 ${firms}，欢迎约 Case 练习！`;

  return {
    title: `${student.name} - Case Partner | CasePrep`,
    description: desc,
    openGraph: {
      title: `${student.name} 正在找 Case Partner`,
      description: `${student.school} · 目标 ${firms}\n${desc}`,
      type: "profile",
    },
  };
}

export default function PartnerPage() {
  return <PartnerProfileClient />;
}
