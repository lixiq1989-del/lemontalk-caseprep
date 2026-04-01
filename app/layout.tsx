import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import AIAssistant from "@/components/AIAssistant";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CasePrep - 咨询面试准备平台 | Case Partner匹配 + AI练习",
  description: "LemonTalk出品 — 免费咨询面试备考平台。找Case Partner、刷题、AI模拟面试、PEI练习、行业Insights，助你拿下McKinsey/BCG/Bain等顶级咨询Offer。",
  keywords: "咨询面试, Case Interview, Case Partner, McKinsey, BCG, Bain, 管培生, 咨询备考, 行为面试, PEI",
  openGraph: {
    title: "CasePrep - 咨询面试准备平台",
    description: "找Case Partner、刷题、AI模拟面试，助你拿下顶级咨询Offer",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Nav />
          <main className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">{children}</main>
          <AIAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
