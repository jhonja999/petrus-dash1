"use client"

import { useEffect } from "react"
import { useClerk } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const { signOut } = useClerk()

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut()
        window.location.href = "/sign-in"
      } catch (error) {
        console.error("Error signing out:", error)
        window.location.href = "/sign-in"
      }
    }

    handleSignOut()
  }, [signOut])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
        <p className="mt-4 text-lg text-gray-600">Cerrando sesión...</p>
      </div>
    </div>
  )
}
