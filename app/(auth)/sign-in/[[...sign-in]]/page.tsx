import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ingresa - Petrus Management",
  description: "Ingresa a tu cuenta",
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
