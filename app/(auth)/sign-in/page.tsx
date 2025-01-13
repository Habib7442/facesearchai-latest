import { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import SignInHeader from "./SignInHeader"

export const metadata: Metadata = {
  title: "Login | FaceSearch AI",
  description: "Login to your FaceSearch AI account",
}

export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[350px] mx-auto space-y-6">
        <SignInHeader />
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/sign-up"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
} 