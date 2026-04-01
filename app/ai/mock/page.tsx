import MockModule from "@/components/modules/MockModule";
import AIBanner from "@/components/AIBanner";

interface Props {
  searchParams: Promise<{ hint?: string; caseType?: string }>;
}

export default async function MockPage({ searchParams }: Props) {
  const { hint, caseType } = await searchParams;
  return (
    <div className="max-w-2xl mx-auto">
      <AIBanner
        hint={hint}
        defaultHint="模拟真实面试压力，开口说比心里想有效10倍，哪怕说得磕绊也要坚持说完"
        defaultActions={[
          { label: "📊 Profitability", href: "/ai/mock?caseType=profitability" },
          { label: "🌍 Market Entry", href: "/ai/mock?caseType=market-entry" },
          { label: "📐 Market Sizing", href: "/ai/mock?caseType=market-sizing" },
        ]}
      />
      <MockModule initialCaseType={caseType} />
    </div>
  );
}
