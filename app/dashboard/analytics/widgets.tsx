"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Fuel, Users, TrendingUp } from "lucide-react"

type DashboardStats = {
  trucksCount: number
  activeDrivers: number
  customersCount: number
  todayAssignments: number
  totalFuelToday: number
}

export function DashboardWidgets() {
  const [stats, setStats] = useState<DashboardStats>({
    trucksCount: 0,
    activeDrivers: 0,
    customersCount: 0,
    todayAssignments: 0,
    totalFuelToday: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/analytics/dashboard-stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Camiones</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 w-16 animate-pulse rounded-md bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.trucksCount}</div>
              <p className="text-xs text-muted-foreground">Total de camiones registrados</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Conductores</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 w-16 animate-pulse rounded-md bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.activeDrivers}</div>
              <p className="text-xs text-muted-foreground">Conductores activos</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Asignaciones</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 w-16 animate-pulse rounded-md bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.todayAssignments}</div>
              <p className="text-xs text-muted-foreground">Asignaciones de hoy</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Combustible</CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 w-16 animate-pulse rounded-md bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.totalFuelToday.toString()} gal</div>
              <p className="text-xs text-muted-foreground">Combustible despachado hoy</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
