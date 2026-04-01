import SprintModule from "@/components/modules/SprintModule";
import AIBanner from "@/components/AIBanner";

interface Props {
  searchParams: Promise<{ hint?: string; company?: string; role?: string }>;
}

export default async function SprintPage({ searchParams }: Props) {
  const { hint, company, role } = await searchParams;
  return (
    <div className="max-w-3xl mx-auto">
      <AIBanner
        hint={hint}
        defaultHint="输入目标公司+岗位，60秒生成专属面试小抄，涵盖公司背景/常见问题/关键框架"
        defaultActions={[
          { label: "🔵 McKinsey", href: "/ai/sprint?company=McKinsey&role=Business+Analyst" },
          { label: "🟡 BCG", href: "/ai/sprint?company=BCG&role=Consultant" },
          { label: "🟢 Bain", href: "/ai/sprint?company=Bain&role=Associate+Consultant" },
        ]}
      />
      <SprintModule company={company} role={role} />
    </div>
  );
}
