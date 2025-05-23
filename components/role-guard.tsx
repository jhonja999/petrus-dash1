"use client"

import { useUser } from "@clerk/nextjs"
import type { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return <div className="animate-pulse h-8 bg-muted rounded" />
  }

  if (!user) {
    return fallback
  }

  const userRole = user.publicMetadata?.role as string

  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback
  }

  return <>{children}</>
}
