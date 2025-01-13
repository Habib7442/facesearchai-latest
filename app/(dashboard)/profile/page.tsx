import { Suspense } from "react"
import { ProfileContent } from "@/components/ProfileContent"
import { Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
} 