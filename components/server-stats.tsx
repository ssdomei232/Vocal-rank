"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ServerStats() {
  const [serverStat, setServerStat] = useState<{ timestamp: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServerStat = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://ecs-113-44-166-103.compute.hwclouds-dns.com/basic/v1/ServerStat/info")
        if (!response.ok) {
          throw new Error("服务器响应错误")
        }
        const data = await response.json()
        setServerStat(data)
      } catch (error) {
        console.error("获取服务器统计信息时出错:", error)
        setError("无法获取服务器统计信息")
      } finally {
        setLoading(false)
      }
    }

    fetchServerStat()
  }, [])

  return (
    <Card className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">服务器统计</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : serverStat ? (
          <p className="text-lg">最后更新时间: {new Date(serverStat.timestamp * 1000).toLocaleString("zh-CN")}</p>
        ) : (
          <p>暂无数据</p>
        )}
      </CardContent>
    </Card>
  )
}

