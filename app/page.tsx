import Header from "@/components/header"
import ServerStats from "@/components/server-stats"
import UploaderSearch from "@/components/uploader-search"
import VideoSearch from "@/components/video-search"
import DatabaseStats from "@/components/database-stats"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <ServerStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <UploaderSearch />
          <VideoSearch />
        </div>
        <DatabaseStats />
      </div>
    </main>
  )
}

