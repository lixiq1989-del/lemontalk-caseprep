import CasebookModule from "@/components/modules/CasebookModule";
import AIBanner from "@/components/AIBanner";

interface Props {
  searchParams: Promise<{ hint?: string; type?: string }>;
}

export default async function CasebookPage({ searchParams }: Props) {
  const { hint, type } = await searchParams;
  return (
    <>
      <div className="max-w-2xl mx-auto">
        <AIBanner
          hint={hint}
          defaultHint="真实MBB/四大面试题库，系统学习解题框架，看解析比刷题更重要"
          defaultActions={[
            { label: "📉 Profitability", href: "/casebook?type=Profitability" },
            { label: "🌍 Market Entry", href: "/casebook?type=Market+Entry" },
            { label: "📐 Market Sizing", href: "/casebook?type=Market+Sizing" },
            { label: "🔀 M&A", href: "/casebook?type=M%26A" },
          ]}
        />
      </div>
      <CasebookModule initialType={type} />
    </>
  );
}
