import ResumeModule from "@/components/modules/ResumeModule";
import AIBanner from "@/components/AIBanner";

interface Props {
  searchParams: Promise<{ hint?: string }>;
}

export default async function ResumePage({ searchParams }: Props) {
  const { hint } = await searchParams;
  return (
    <div className="max-w-2xl mx-auto">
      <AIBanner
        hint={hint}
        defaultHint="MBB简历有潜规则：每条经历必须量化，动词要强，impact要可见。AI帮你逐句打磨"
      />
      <ResumeModule />
    </div>
  );
}
