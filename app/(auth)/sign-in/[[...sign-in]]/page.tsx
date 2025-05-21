import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In - Fuel Dispatch Management",
  description: "Sign in to your account",
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
            footerActionLink: "text-primary hover:text-primary/90",
          },
        }}
        redirectUrl="/dashboard"
      />
    </div>
  )
}
