import { Metadata } from "next"
import Link from "next/link"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { Button } from "@/components/ui/button"
import SignUpHeader from "./SignUpHeader"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
}

export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
       
        <SignUpHeader />
        <SignUpForm />

        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="hover:text-brand underline underline-offset-4"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
} 