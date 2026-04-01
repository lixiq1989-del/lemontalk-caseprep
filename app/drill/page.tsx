import DrillModule from "@/components/modules/DrillModule";
import AIBanner from "@/components/AIBanner";

interface Props {
  searchParams: Promise<{ hint?: string; category?: string }>;
}

export default async function DrillPage({ searchParams }: Props) {
  const { hint, category } = await searchParams;
  return (
    <div className="max-w-2xl mx-auto">
      <AIBanner
        hint={hint}
        defaultHint="碎片时间刷题最有效，每题30秒思考+作答，坚持7天正确率涨20%"
        defaultActions={[
          { label: "🏗️ 框架搭建", href: "/drill?category=structuring" },
          { label: "📈 图表解读", href: "/drill?category=chart" },
          { label: "🧮 商业计算", href: "/drill?category=case_math" },
          { label: "🎲 随机一题", href: "/drill" },
        ]}
      />
      <DrillModule initialCategory={category} />
    </div>
  );
}
