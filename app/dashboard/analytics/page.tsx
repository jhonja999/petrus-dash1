"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Fuel,
  Truck,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react"

interface AnalyticsData {
  totalRevenue: number
  totalTrips: number
  totalFuelCost: number
  activeDrivers: number
  fuelEfficiency: number
  onTimeDeliveries: number
  monthlyTrends: {
    month: string
    revenue: number
    trips: number
    fuelCost: number
  }[]
  topRoutes: {
    route: string
    trips: number
    revenue: number
  }[]
  driverPerformance: {
    name: string
    trips: number
    efficiency: number
    rating: number
  }[]
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    // Mock data for demonstration
    const mockData: AnalyticsData = {
      totalRevenue: 2450000,
      totalTrips: 156,
      totalFuelCost: 890000,
      activeDrivers: 12,
      fuelEfficiency: 8.7,
      onTimeDeliveries: 94.2,
      monthlyTrends: [
        { month: "Ene", revenue: 1800000, trips: 120, fuelCost: 650000 },
        { month: "Feb", revenue: 2100000, trips: 135, fuelCost: 720000 },
        { month: "Mar", revenue: 2450000, trips: 156, fuelCost: 890000 },
      ],
      topRoutes: [
        { route: "Bogotá - Medellín", trips: 45, revenue: 850000 },
        { route: "Bogotá - Cali", trips: 38, revenue: 720000 },
        { route: "Medellín - Barranquilla", trips: 32, revenue: 680000 },
      ],
      driverPerformance: [
        { name: "Juan Pérez", trips: 28, efficiency: 9.2, rating: 4.8 },
        { name: "María García", trips: 25, efficiency: 8.9, rating: 4.7 },
        { name: "Carlos López", trips: 22, efficiency: 8.5, rating: 4.6 },
      ],
    }

    setTimeout(() => {
      setData(mockData)
      setLoading(false)
    }, 1000)
  }, [timeRange])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Analítica</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analítica</h1>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="90">Últimos 3 meses</SelectItem>
              <SelectItem value="365">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +15.2% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viajes Completados</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTrips}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +8.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo de Combustible</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalFuelCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1 text-red-500" />
              +5.4% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conductores Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeDrivers}</div>
            <p className="text-xs text-muted-foreground">2 nuevos este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia Promedio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.fuelEfficiency} km/L</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +2.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregas a Tiempo</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.onTimeDeliveries}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +1.2% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tendencias Mensuales</CardTitle>
            <CardDescription>Evolución de ingresos, viajes y costos de combustible</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.monthlyTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="font-medium">{trend.month}</div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-medium">${trend.revenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{trend.trips} viajes</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Rutas Principales
            </CardTitle>
            <CardDescription>Rutas con mayor actividad y ingresos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topRoutes.map((route, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{route.route}</div>
                    <div className="text-sm text-muted-foreground">{route.trips} viajes</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${route.revenue.toLocaleString()}</div>
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento de Conductores</CardTitle>
          <CardDescription>Estadísticas de los conductores más activos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Conductor</th>
                  <th className="text-left p-2">Viajes</th>
                  <th className="text-left p-2">Eficiencia</th>
                  <th className="text-left p-2">Calificación</th>
                  <th className="text-left p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.driverPerformance.map((driver, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="font-medium">{driver.name}</div>
                    </td>
                    <td className="p-2">{driver.trips}</td>
                    <td className="p-2">
                      <span
                        className={`font-medium ${
                          driver.efficiency > 9
                            ? "text-green-600"
                            : driver.efficiency > 8
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {driver.efficiency} km/L
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{driver.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant={driver.rating > 4.5 ? "default" : "secondary"}>
                        {driver.rating > 4.5 ? "Excelente" : "Bueno"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
