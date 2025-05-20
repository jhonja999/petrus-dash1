import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import type { ReactNode } from "react"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Truck, ClipboardList, Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DriverLayoutProps {
  children: ReactNode
}

export function DriverLayout({ children }: DriverLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuItem asChild>
                <Link href="/conductor/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/conductor/assignments">Mis Asignaciones</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2 font-semibold md:ml-4">
            <Truck className="h-6 w-6" />
            <span className="hidden md:inline-block">Sistema de Despachos</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />
            <UserButton afterSignOutUrl="/auth/login" />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4">
            <Link
              href="/conductor/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Truck className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/conductor/assignments"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <ClipboardList className="h-5 w-5" />
              Mis Asignaciones
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
