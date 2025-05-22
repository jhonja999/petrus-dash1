"use client"

import type React from "react"
import { UserButton } from "@clerk/nextjs"
import { Fuel, Truck, Users, Home, BarChart3 } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-14 items-center px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold">
              <Fuel className="h-5 w-5" />
              <span>Fuel Dispatch</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/trucks">
                  <Truck className="h-4 w-4" />
                  <span>Camiones</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/customers">
                  <Users className="h-4 w-4" />
                  <span>Clientes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/users">
                  <Users className="h-4 w-4" />
                  <span>Conductores</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/assignments">
                  <Fuel className="h-4 w-4" />
                  <span>Asignaciones</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/reports/fuel">
                  <BarChart3 className="h-4 w-4" />
                  <span>Reportes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Admin</span>
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">{/* Optional header content */}</div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
