import { Suspense } from "react"
import { DashboardView } from "@/components/DashboardView"
import { Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <DashboardView />
    </Suspense>
  )
} 