import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { data: drills } = await supabaseAdmin
    .from("drill_records")
    .select("user_id, correct");

  if (!drills || drills.length === 0) return NextResponse.json({ leaders: [] });

  const byUser: Record<string, { total: number; correct: number }> = {};
  for (const r of drills) {
    if (!r.user_id) continue;
    if (!byUser[r.user_id]) byUser[r.user_id] = { total: 0, correct: 0 };
    byUser[r.user_id].total++;
    if (r.correct) byUser[r.user_id].correct++;
  }

  const userIds = Object.keys(byUser);
  const { data: students } = await supabaseAdmin
    .from("students")
    .select("user_id, name, school, level")
    .in("user_id", userIds);

  const leaders = userIds
    .map((uid) => {
      const s = students?.find((x) => x.user_id === uid);
      return {
        user_id: uid,
        name: s?.name || "匿名用户",
        school: s?.school || "",
        level: s?.level || "",
        total: byUser[uid].total,
        correct: byUser[uid].correct,
        accuracy: Math.round((byUser[uid].correct / byUser[uid].total) * 100),
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 20);

  return NextResponse.json({ leaders });
}
