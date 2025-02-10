import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vocal Rank - 中V数据查询器（基于 NineVocalRank）",
  description: "Vocal Rank - 中V数据查询器，基于 NineVocalRank",
  keywords: ['Vocal Rank', 'NineVocalRank', 'Vocaloid', '中V', 'VC', '中V数据查询器', '周刊虚拟歌手中文曲', '洛天依', '乐正绫'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="no-referrer" />
        <script defer src="https://umami.mmeiblog.cn/script.js" data-website-id="157306a2-e1eb-4571-9d19-0d4b2c28eddd"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

