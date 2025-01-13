import { Suspense } from "react"
import { HistoryList } from "@/components/history/HistoryList"
import { History } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: 'Search History',
  description: 'View your search history'
}

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg">
          <History className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Search History</h1>
      </div>
      <Suspense 
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[300px] bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        }
      >
        <HistoryList />
      </Suspense>
    </div>
  )
} 