"use client"

import { useState, useEffect } from "react"
import { BarChart3, Truck, TruckIcon, Users } from "lucide-react"
import axios from "axios"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { PeriodTabs } from "@/components/dashboard/period-tabs"
import { BarChartComponent } from "@/components/dashboard/bar-chart"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"

export default function AdminDashboard() {
  const [period, setPeriod] = useState("today")
  const [stats, setStats] = useState({
    totalTrucks: 0,
    activeTrucks: 0,
    totalCustomers: 0,
    totalDispatchesToday: 0,
  })
  const [fuelData, setFuelData] = useState([])
  const [recentDischarges, setRecentDischarges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // En un entorno real, estas serían llamadas a la API
        const statsResponse = await axios.get(`/api/analytics/dashboard-stats?period=${period}`)
        const fuelResponse = await axios.get(`/api/analytics/fuel-consumption?period=${period}`)
        const dischargesResponse = await axios.get("/api/discharges/recent")

        setStats(statsResponse.data)
        setFuelData(fuelResponse.data)
        setRecentDischarges(dischargesResponse.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // Datos de ejemplo para desarrollo
        setStats({
          totalTrucks: 12,
          activeTrucks: 8,
          totalCustomers: 24,
          totalDispatchesToday: 15,
        })
        setFuelData([
          { name: "DIESEL B5", total: 4500 },
          { name: "GASOLINA 90", total: 2300 },
          { name: "GASOLINA 95", total: 1800 },
          { name: "GLP", total: 900 },
        ])
        setRecentDischarges([
          {
            id: 1,
            date: "2025-05-19T10:30:00Z",
            truckPlaca: "ABC123",
            driverName: "Juan Pérez",
            customer: "Empresa X",
            fuelType: "DIESEL B5",
            totalDischarged: 200,
          },
          {
            id: 2,
            date: "2025-05-19T14:15:00Z",
            truckPlaca: "DEF456",
            driverName: "María López",
            customer: "Empresa Y",
            fuelType: "GASOLINA 95",
            totalDischarged: 150,
          },
          {
            id: 3,
            date: "2025-05-18T09:45:00Z",
            truckPlaca: "GHI789",
            driverName: "Carlos Ruiz",
            customer: "Empresa Z",
            fuelType: "DIESEL B5",
            totalDischarged: 300,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [period])

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de operaciones y estadísticas del sistema</p>
        </div>

        <PeriodTabs period={period} onChange={handlePeriodChange} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Camiones"
            value={stats.totalTrucks}
            icon={<Truck className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Camiones Activos"
            value={stats.activeTrucks}
            icon={<TruckIcon className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Total Clientes"
            value={stats.totalCustomers}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Despachos Hoy"
            value={stats.totalDispatchesToday}
            icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <BarChartComponent
            title="Galones Despachados por Tipo de Combustible"
            data={fuelData}
            className="col-span-4"
          />

          <div className="col-span-3">
            <h2 className="text-xl font-semibold mb-4">Últimos Despachos</h2>
            <DataTable
              columns={columns}
              data={recentDischarges}
              searchKey="customer"
              searchPlaceholder="Buscar por cliente..."
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
