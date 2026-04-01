import JobsModule from "@/components/modules/JobsModule";
import AIBanner from "@/components/AIBanner";

interface Props {
  searchParams: Promise<{ hint?: string; filter?: string; region?: string }>;
}

export default async function JobsPage({ searchParams }: Props) {
  const { hint, filter, region } = await searchParams;
  return (
    <div className="max-w-3xl mx-auto">
      <AIBanner
        hint={hint}
        defaultHint="多国岗位每日更新：MBB/Big4/投行/互联网战略，覆盖中国、英国、美国、香港、新加坡"
        defaultActions={[
          { label: "🇨🇳 国内", href: "/jobs?region=CN" },
          { label: "🇬🇧 英国", href: "/jobs?region=UK" },
          { label: "🇺🇸 美国", href: "/jobs?region=US" },
          { label: "🇭🇰 香港", href: "/jobs?region=HK" },
        ]}
      />
      <JobsModule initialFilter={filter} initialRegion={region} />
    </div>
  );
}
