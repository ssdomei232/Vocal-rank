"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { blockedVideoIds } from "@/config/blocked-ids"

interface Video {
  video_stat: {
    view: number
    like: number
    coin: number
    favorite: number
    reply: number
    share: number
    danmaku: number
  }
  video_info: {
    uploader_mid: string
    uploader_name: string
    title: string
    pic: string
    pages: number
    timestamp: number
  }
  video_id: {
    avid: string
    bvid: string
  }
  vrank_info: {
    vrank_score: number
    rank: string
    rank_code: number
    progress_percentage: number
  }
  video_increase: {
    view: number
    like: number
    coin: number
    favorite: number
    reply: number
    share: number
    danmaku: number
  }
  score_rank: number
}

function getAchievement(views: number) {
  if (views >= 10000000) return { name: "神话曲", next: null, progress: 100 }
  if (views >= 1000000)
    return {
      name: "传说曲",
      next: "神话曲",
      progress: (views / 10000000) * 100,
    }
  if (views >= 100000)
    return {
      name: "殿堂曲",
      next: "传说曲",
      progress: (views / 1000000) * 100,
    }
  return { name: "未达成", next: "殿堂曲", progress: (views / 100000) * 100 }
}

export default function VideoSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSearch = async () => {
    if (!searchTerm) {
      setError("请输入搜索内容")
      return
    }

    // 检查是否为禁止的视频 ID
    if (blockedVideoIds.includes(searchTerm)) {
      router.push("/blocked")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://v-api-proxy-cn-1.mei.lv:3389/vocaloid_rank/v1/video/${searchTerm}`,
      )
      const weekly_response = await fetch(
        `https://v-api-proxy-cn-1.mei.lv:3389/vocaloid_rank/v1/sorted/${searchTerm}`,
      )
      if (!response.ok || !weekly_response.ok) {
        throw new Error("服务器响应错误")
      }
      const data = await response.json()
      const weekly_data = await weekly_response.json()

      const combinedData = {
        ...data,
        score_rank: weekly_data.score_rank,
      }

      setVideos([combinedData])
      if (videos.length === 0) {
        setError("未找到匹配的视频")
      }
    } catch (error) {
      console.error("搜索视频时出错:", error)
      setError("搜索过程中出现错误")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-100 to-red-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">搜索视频</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="输入 BV/AV 号 "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "搜索"}
          </Button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {videos.length > 0 ? (
          <ul className="space-y-8">
            {videos.map((video) => {
              const achievement = getAchievement(video.video_stat.view)
              return (
                <li key={video.video_id.bvid} className="border p-6 rounded-lg bg-white shadow-md">
                  <div className="flex flex-col gap-6">
                    <div className="w-full">
                      <h3 className="font-bold text-xl mb-2">{video.video_info.title}</h3>
                      <p className="text-gray-600">
                        UP主: {video.video_info.uploader_name} (UID: {video.video_info.uploader_mid})
                      </p>
                      <p className="text-gray-600">BV号: {video.video_id.bvid}</p>
                      <p className="text-gray-600">AV号: {video.video_id.avid}</p>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <p className="text-gray-600">播放量: {video.video_stat.view.toLocaleString()}</p>
                        <p className="text-gray-600">点赞数: {video.video_stat.like.toLocaleString()}</p>
                        <p className="text-gray-600">投币: {video.video_stat.coin.toLocaleString()}</p>
                        <p className="text-gray-600">收藏: {video.video_stat.favorite.toLocaleString()}</p>
                        <p className="text-gray-600">评论: {video.video_stat.reply.toLocaleString()}</p>
                        <p className="text-gray-600">分享: {video.video_stat.share.toLocaleString()}</p>
                        <p className="text-gray-600">弹幕数: {video.video_stat.danmaku.toLocaleString()}</p>
                      </div>
                      <div className="mt-4 bg-blue-100 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">周刊数据</h4>
                        {video.vrank_info ? (
                          <>
                            <p className="text-gray-700">周刊得分: {video.vrank_info.vrank_score.toFixed(2)}</p>
                            <p className="text-gray-700 font-bold text-xl">周刊排名: {video.score_rank}</p>
                          </>
                        ) : (
                          <p className="text-gray-700">暂无周刊数据</p>
                        )}
                        {video.video_increase && (
                          <>
                            <h5 className="font-semibold mt-2">数据增长：</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <p className="text-gray-700">播放增长: {video.video_increase.view.toLocaleString()}</p>
                              <p className="text-gray-700">点赞增长: {video.video_increase.like.toLocaleString()}</p>
                              <p className="text-gray-700">投币增长: {video.video_increase.coin.toLocaleString()}</p>
                              <p className="text-gray-700">
                                收藏增长: {video.video_increase.favorite.toLocaleString()}
                              </p>
                              <p className="text-gray-700">评论增长: {video.video_increase.reply.toLocaleString()}</p>
                              <p className="text-gray-700">分享增长: {video.video_increase.share.toLocaleString()}</p>
                              <p className="text-gray-700">弹幕增长: {video.video_increase.danmaku.toLocaleString()}</p>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="text-gray-600 mt-2">
                        数据更新时间: {new Date(video.video_info.timestamp * 1000).toLocaleString("zh-CN")}
                      </p>
                      <div className="mt-4">
                        <p className="font-semibold">成就: {achievement.name}</p>
                        {achievement.next && (
                          <div className="mt-2">
                            <p>
                              距离 {achievement.next} 还需{" "}
                              {(achievement.next === "殿堂曲"
                                ? 100000
                                : achievement.next === "传说曲"
                                  ? 1000000
                                  : 10000000) - video.video_stat.view}{" "}
                              播放
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${achievement.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          !loading && !error && <p>暂无数据</p>
        )}
      </CardContent>
    </Card>
  )
}

