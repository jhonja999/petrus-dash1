"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { Menu, X, Home, Truck, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/driver",
      label: "Inicio",
      icon: Home,
    },
    {
      href: "/driver/select-truck",
      label: "Seleccionar Camión",
      icon: Truck,
    },
    {
      href: "/driver/history",
      label: "Historial",
      icon: History,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] sm:w-[350px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b py-4">
            <div className="ml-2 font-semibold">Menú</div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <nav className="flex-1 space-y-2 py-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === route.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="border-t py-4 px-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mi cuenta</span>
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
