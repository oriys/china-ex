import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://china.ychy.me"),
  title: "我的中国制霸地图",
  description: "记录我去过的中国省级行政区域",
  openGraph: {
    title: "我的中国制霸地图",
    description: "江苏、浙江、香港、广东、上海，继续点亮新的足迹。",
    url: "https://china.ychy.me",
    siteName: "我的中国制霸地图",
    locale: "zh_CN",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "我的中国制霸地图",
    description: "江苏、浙江、香港、广东、上海，继续点亮新的足迹。",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans">
      <body>{children}</body>
    </html>
  );
}
