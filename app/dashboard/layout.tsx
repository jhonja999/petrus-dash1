"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Building2, Fuel, LayoutDashboard, Settings, Truck, Users } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"

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
import { RoleGuard } from "@/components/role-guard"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const userRole = user?.publicMetadata?.role as string

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="border-r border-emerald-100">
          <SidebarHeader className="border-b border-emerald-100">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                <Fuel className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-emerald-900">Petrus</h1>
                <span className="text-xs text-emerald-600 capitalize">{userRole || "Usuario"}</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            <SidebarMenu className="space-y-1">
              {/* Dashboard - Available to all authenticated users */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard")}
                  className="data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Assignments - Available to admin and conductor */}
              <RoleGuard allowedRoles={["admin", "conductor"]}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/assignments")}
                    className="data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Link href="/dashboard/assignments">
                      <Fuel className="h-5 w-5" />
                      <span>Asignaciones</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </RoleGuard>

              {/* Trucks - Admin only */}
              <RoleGuard allowedRoles={["admin"]}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/trucks")}
                    className="data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Link href="/dashboard/trucks">
                      <Truck className="h-5 w-5" />
                      <span>Camiones</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </RoleGuard>

              {/* Customers - Admin only */}
              <RoleGuard allowedRoles={["admin"]}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/customers")}
                    className="data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Link href="/dashboard/customers">
                      <Building2 className="h-5 w-5" />
                      <span>Clientes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </RoleGuard>

              {/* Users - Admin only */}
              <RoleGuard allowedRoles={["admin"]}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/users")}
                    className="data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Link href="/dashboard/users">
                      <Users className="h-5 w-5" />
                      <span>Usuarios</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </RoleGuard>

              {/* Analytics - Admin only */}
              <RoleGuard allowedRoles={["admin"]}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/analytics")}
                    className="data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Link href="/dashboard/analytics">
                      <BarChart3 className="h-5 w-5" />
                      <span>Analítica</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </RoleGuard>

              {/* Reports - Admin only */}
              <RoleGuard allowedRoles={["admin"]}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/reports")}
                    className="data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Link href="/dashboard/reports/fuel">
                      <BarChart3 className="h-5 w-5" />
                      <span>Reportes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </RoleGuard>

              {/* Settings - Available to all authenticated users */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-emerald-50 hover:text-emerald-700">
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-emerald-100 p-4">
            <div className="flex items-center gap-3">
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "border-emerald-200",
                    userButtonPopoverActionButton: "hover:bg-emerald-50",
                    userButtonPopoverActionButtonText: "text-gray-700",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
              />
              <div className="flex flex-col text-sm">
                <span className="font-medium text-gray-900">
                  {user?.username || user?.emailAddresses[0]?.emailAddress}
                </span>
                <span className="text-xs text-emerald-600 capitalize">{userRole || "Usuario"}</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="flex-1 p-6">
            <div className="mx-auto max-w-7xl">
              <div className="mb-4 flex items-center">
                <SidebarTrigger className="mr-4 text-emerald-600 hover:bg-emerald-50" />
              </div>
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
