import { SignUp } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registrate - Petrus",
  description: "Crea una cuenta Nueva",
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
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
