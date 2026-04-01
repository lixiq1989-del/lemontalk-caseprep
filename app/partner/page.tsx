import PartnerModule from "@/components/modules/PartnerModule";
import AIBanner from "@/components/AIBanner";

interface Props {
  searchParams: Promise<{ hint?: string; level?: string; firm?: string; caseType?: string }>;
}

export default async function PartnerPage({ searchParams }: Props) {
  const { hint, level, firm, caseType } = await searchParams;
  return (
    <>
      <div className="max-w-2xl mx-auto">
        <AIBanner
          hint={hint}
          defaultHint="找搭档练Case是进步最快的方式，互相出题+反馈，效果远超自己刷题"
          defaultActions={[
            { label: "🌱 初学入门", href: "/partner?level=beginner" },
            { label: "⚡ 进阶搭档", href: "/partner?level=intermediate" },
            { label: "🏆 MBB备战", href: "/partner?firm=MBB" },
          ]}
        />
      </div>
      <PartnerModule initialLevel={level} initialFirm={firm} initialCaseType={caseType} />
    </>
  );
}
