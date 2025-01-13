import { Suspense } from "react"
import { HistoryDetail } from "@/components/history/HistoryDetail"
import { Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function HistoryDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <HistoryDetail id={params.id} />
    </Suspense>
  )
}