import type React from "react"
import { UserButton } from "@clerk/nextjs"
import { Fuel, Truck, Users, Home, BarChart3 } from "lucide-react"
import Link from "next/link"

import { requireAdmin } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full border-r bg-muted/40 md:w-64">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <Fuel className="h-5 w-5" />
            <span>Fuel Dispatch</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/trucks">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Truck className="h-4 w-4" />
              Camiones
            </Button>
          </Link>
          <Link href="/dashboard/customers">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              Clientes
            </Button>
          </Link>
          <Link href="/dashboard/users">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              Conductores
            </Button>
          </Link>
          <Link href="/dashboard/assignments">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Fuel className="h-4 w-4" />
              Asignaciones
            </Button>
          </Link>
          <Link href="/dashboard/reports/fuel">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BarChart3 className="h-4 w-4" />
              Reportes
            </Button>
          </Link>
        </nav>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Admin</span>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
