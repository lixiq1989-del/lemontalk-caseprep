import { Metadata } from "next";

export const metadata: Metadata = {
  title: "实习 & 校招岗位 | CasePrep",
  description: "精选咨询/金融/互联网实习和校招信息，McKinsey、BCG、Bain、Goldman Sachs等顶级公司，持续更新，截止日期倒计时。",
  openGraph: {
    title: "实习 & 校招岗位精选 | CasePrep",
    description: "精选咨询/金融/互联网实习，McKinsey、BCG、Bain等，截止日期倒计时提醒",
    type: "website",
  },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
