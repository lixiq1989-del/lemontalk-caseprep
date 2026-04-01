import CheatsheetModule from "@/components/modules/CheatsheetModule";
import AIBanner from "@/components/AIBanner";

interface Props {
  searchParams: Promise<{ hint?: string; category?: string }>;
}

export default async function CheatsheetPage({ searchParams }: Props) {
  const { hint, category } = await searchParams;
  return (
    <>
      <div className="max-w-2xl mx-auto">
        <AIBanner
          hint={hint}
          defaultHint="面试现场忘了框架？这里按类型速查，Profitability和Market Entry是高频考点"
          defaultActions={[
            { label: "📉 Profitability", href: "/ai/cheatsheet?category=profitability" },
            { label: "🌍 Market Entry", href: "/ai/cheatsheet?category=market_entry" },
            { label: "🔢 数学公式", href: "/ai/cheatsheet?category=math" },
          ]}
        />
      </div>
      <CheatsheetModule initialCategory={category} />
    </>
  );
}
