"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function BlockedPage() {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    const redirect = setTimeout(() => {
      window.location.href = "https://www.bilibili.com/video/BV1kW411m7VP"
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirect)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-red-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">访问被禁止</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mb-4">抱歉，您尝试访问的内容已被禁止。这可能是由于版权、隐私或其他法律原因。</p>
          <p className="text-gray-600 mb-4">如果您认为这是一个错误，请联系网站管理员。</p>
          <p className="text-gray-600 mb-4">{countdown} 秒后将自动跳转...</p>
          <Link href="/" className="text-blue-500 hover:underline">
            返回首页
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

