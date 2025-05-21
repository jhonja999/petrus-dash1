import type React from "react"
import { UserButton } from "@clerk/nextjs"
import { Fuel, Truck, History, Home } from "lucide-react"
import Link from "next/link"

import { requireDriver } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function DriverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireDriver()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-14 items-center px-4">
          <Link href="/driver" className="flex items-center gap-2 font-bold">
            <Fuel className="h-5 w-5" />
            <span>Fuel Dispatch</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Link href="/driver">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline-block">Inicio</span>
              </Button>
            </Link>
            <Link href="/driver/select-truck">
              <Button variant="ghost" size="sm" className="gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden sm:inline-block">Seleccionar Camión</span>
              </Button>
            </Link>
            <Link href="/driver/history">
              <Button variant="ghost" size="sm" className="gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline-block">Historial</span>
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/sign-in" />
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container px-4 py-6">{children}</div>
      </main>
    </div>
  )
}
