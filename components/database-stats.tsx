"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Count {
  count: number
}

export default function DatabaseStats() {
  const [videoCount, setVideoCount] = useState<Count | null>(null)
  const [uploaderCount, setUploaderCount] = useState<Count | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true)
        const videoResponse = await fetch("https://api.ninevocalrank.top/basic/v1/database/video_count")
        const uploaderResponse = await fetch("https://api.ninevocalrank.top/basic/v1/database/uploader_count")

        if (!videoResponse.ok || !uploaderResponse.ok) {
          throw new Error("服务器响应错误")
        }

        const videoData = await videoResponse.json()
        const uploaderData = await uploaderResponse.json()

        setVideoCount(videoData)
        setUploaderCount(uploaderData)
      } catch (error) {
        console.error("获取数据库统计信息时出错:", error)
        setError("无法获取数据库统计信息")
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [])

  return (
    <Card className="mt-8 bg-gradient-to-br from-pink-100 to-indigo-100 dark:from-pink-900 dark:to-indigo-900">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">数据库统计</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <h3 className="font-bold text-xl mb-2">视频数量</h3>
              <p className="text-2xl text-primary">{videoCount ? videoCount.count.toLocaleString() : "暂无数据"}</p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-xl mb-2">UP主数量</h3>
              <p className="text-2xl text-primary">
                {uploaderCount ? uploaderCount.count.toLocaleString() : "暂无数据"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

