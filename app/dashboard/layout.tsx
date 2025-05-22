"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Building2, Fuel, LayoutDashboard, LogOut, Settings, Truck, Users } from "lucide-react"

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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <Fuel className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Fuel Dispatch</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/assignments")}>
                  <Link href="/dashboard/assignments">
                    <Fuel className="h-5 w-5" />
                    <span>Asignaciones</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/trucks")}>
                  <Link href="/dashboard/trucks">
                    <Truck className="h-5 w-5" />
                    <span>Camiones</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/customers")}>
                  <Link href="/dashboard/customers">
                    <Building2 className="h-5 w-5" />
                    <span>Clientes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/users")}>
                  <Link href="/dashboard/users">
                    <Users className="h-5 w-5" />
                    <span>Usuarios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/analytics")}>
                  <Link href="/dashboard/analytics">
                    <BarChart3 className="h-5 w-5" />
                    <span>Analítica</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/reports")}>
                  <Link href="/dashboard/reports/fuel">
                    <BarChart3 className="h-5 w-5" />
                    <span>Reportes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/api/auth/signout">
                    <LogOut className="h-5 w-5" />
                    <span>Cerrar Sesión</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex-1 p-6">
            <div className="mx-auto max-w-7xl">
              <div className="mb-4 flex items-center">
                <SidebarTrigger className="mr-4" />
              </div>
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
