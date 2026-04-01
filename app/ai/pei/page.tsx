import PeiModule from "@/components/modules/PeiModule";
import AIBanner from "@/components/AIBanner";

interface Props {
  searchParams: Promise<{ hint?: string; questionId?: string }>;
}

export default async function PEIPage({ searchParams }: Props) {
  const { hint, questionId } = await searchParams;
  return (
    <div className="max-w-2xl mx-auto">
      <AIBanner
        hint={hint}
        defaultHint="Why Consulting 是必考题，建议优先准备。用STAR结构，故事要真实具体"
        defaultActions={[
          { label: "❓ Why Consulting", href: "/ai/pei?questionId=why_consulting" },
          { label: "🏢 Why This Firm", href: "/ai/pei?questionId=why_firm" },
          { label: "🎯 Leadership", href: "/ai/pei?questionId=leadership" },
          { label: "💥 Failure", href: "/ai/pei?questionId=failure" },
        ]}
      />
      <PeiModule initialQuestionId={questionId} />
    </div>
  );
}
