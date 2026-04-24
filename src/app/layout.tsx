import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🔍 ステマ判定｜True Beauty Reviewer（AI口コミ解析）",
  description: "美容品や化粧品の口コミをAIがリアルタイム解析。ステマ危険度・効果の信頼性・コスパ・肌への優しさ・定期縛りの有無を徹底判定。購入前に必ずチェック！",
  keywords: ["美容", "コスメ", "化粧品", "口コミ", "ステマ", "判定", "AI", "肌荒れ", "定期購入", "解約", "効果なし", "嘘"],
  openGraph: {
    title: "🔍 ステマ判定｜True Beauty Reviewer（AI口コミ解析）",
    description: "商品名を入力するだけでAIが口コミを多角的に解析。納得のいく美容品選びをサポートする無料ツールです。",
    type: "website",
    locale: "ja_JP",
    url: "https://true-beauty-reviewer.vercel.app",
    images: [{
      url: "https://true-beauty-reviewer.vercel.app/ogp.png",
      width: 1200,
      height: 630,
      alt: "True Beauty Reviewer - AI美容品判定ツール",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "🔍 ステマ判定｜True Beauty Reviewer（AI口コミ解析）",
    description: "AIが口コミの本音を可視化。納得できる美容品選びをサポートします（無料解析）",
    images: ["https://true-beauty-reviewer.vercel.app/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1479779730258058"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
