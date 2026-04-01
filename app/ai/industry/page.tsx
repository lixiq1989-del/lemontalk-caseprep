import IndustryModule from "@/components/modules/IndustryModule";
import AIBanner from "@/components/AIBanner";

interface Props {
  searchParams: Promise<{ hint?: string; id?: string }>;
}

export default async function IndustryPage({ searchParams }: Props) {
  const { hint, id } = await searchParams;
  return (
    <div className="max-w-2xl mx-auto">
      <AIBanner
        hint={hint}
        defaultHint="行业背景是Fit展示的基础，面试前至少要了解目标行业的规模/趋势/主要玩家"
        defaultActions={[
          { label: "💻 科技", href: "/ai/industry?id=technology" },
          { label: "🏥 医疗", href: "/ai/industry?id=healthcare" },
          { label: "🏦 金融", href: "/ai/industry?id=finance" },
          { label: "🛒 零售", href: "/ai/industry?id=retail" },
        ]}
      />
      <IndustryModule initialIndustryId={id} />
    </div>
  );
}
