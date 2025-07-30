"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { blockedUploaderIds } from "@/config/blocked-ids"

interface Uploader {
  mid: string
  name: string
  fans: number
  archive_count: number
  timestamp: number
}

export default function UploaderSearch() {
  const [uid, setUid] = useState("")
  const [uploaders, setUploaders] = useState<Uploader[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSearch = async () => {
    if (!uid) {
      setError("请输入UID")
      return
    }

    // tsy 过滤器
    if (blockedUploaderIds.includes(uid)) {
      router.push("/blocked")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.mmeiblog.cn/NineVocalRank/basic/v1/uploader/${uid}`)
      if (!response.ok) {
        throw new Error("服务器响应错误")
      }
      const data: Uploader = await response.json()
      setUploaders([data])
    } catch (error) {
      console.error("搜索UP主时出错:", error)
      setError("搜索过程中出现错误")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-green-100 to-blue-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">通过UID搜索UP主</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input type="text" placeholder="输入UID" value={uid} onChange={(e) => setUid(e.target.value)} />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "搜索"}
          </Button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {uploaders.length > 0 ? (
          <ul className="space-y-4">
            {uploaders.map((uploader) => (
              <li key={uploader.mid} className="border p-4 rounded-lg bg-white shadow-md">
                <h3 className="font-bold text-xl mb-2">{uploader.name}</h3>
                <p className="text-gray-600">UID: {uploader.mid}</p>
                <p className="text-gray-600">粉丝数: {uploader.fans.toLocaleString()}</p>
                <p className="text-gray-600">视频数: {uploader.archive_count}</p>
                <p className="text-gray-600">最后更新: {new Date(uploader.timestamp * 1000).toLocaleString("zh-CN")}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p>暂无数据</p>
        )}
      </CardContent>
    </Card>
  )
}

