"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "lucide-react"
import { FUEL_TYPES } from "@/lib/constants"

export default function AnalyticsTabs() {
  const [fuelData, setFuelData] = useState<any>(null)
  const [assignmentsData, setAssignmentsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [fuelResponse, assignmentsResponse] = await Promise.all([
          fetch("/api/analytics/fuel-consumption"),
          fetch("/api/analytics/assignments"),
        ])

        const fuelData = await fuelResponse.json()
        const assignmentsData = await assignmentsResponse.json()

        setFuelData(fuelData)
        setAssignmentsData(assignmentsData)
      } catch (error) {
        console.error("Error loading analytics data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return <div className="flex h-24 items-center justify-center">Cargando datos analíticos...</div>
  }

  return (
    <Tabs defaultValue="fuel" className="space-y-4">
      <TabsList>
        <TabsTrigger value="fuel" className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          <span>Consumo de Combustible</span>
        </TabsTrigger>
        <TabsTrigger value="assignments" className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          <span>Asignaciones</span>
        </TabsTrigger>
        <TabsTrigger value="trends" className="flex items-center gap-2">
          <LineChart className="h-4 w-4" />
          <span>Tendencias</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="fuel" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Combustible por Tipo</CardTitle>
            <CardDescription>Galones totales distribuidos en los últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {/* Chart would go here */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fuelData?.byType.map((item: any) => (
                <div key={item.type} className="rounded-lg border p-4">
                  <div className="text-sm font-medium">{FUEL_TYPES[item.type as keyof typeof FUEL_TYPES]}</div>
                  <div className="mt-1 text-2xl font-bold">{item.total.toLocaleString()} gal</div>
                  <div className="mt-1 text-sm text-muted-foreground">{item.percentage}% del total</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Consumo por Cliente</CardTitle>
              <CardDescription>Top 5 clientes por consumo</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Chart would go here */}
              <div className="space-y-4">
                {fuelData?.byCustomer.slice(0, 5).map((item: any, index: number) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.total.toLocaleString()} gal</div>
                    </div>
                    <div className="text-sm font-medium">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eficiencia de Entrega</CardTitle>
              <CardDescription>Relación entre combustible cargado y descargado</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Chart would go here */}
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-5xl font-bold">{fuelData?.efficiency}%</div>
                <div className="mt-2 text-center text-sm text-muted-foreground">
                  De eficiencia en la entrega de combustible
                </div>
                <div className="mt-6 grid w-full grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Cargado</div>
                    <div className="mt-1 text-xl font-bold">{fuelData?.totalLoaded.toLocaleString()} gal</div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Descargado</div>
                    <div className="mt-1 text-xl font-bold">{fuelData?.totalDischarged.toLocaleString()} gal</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="assignments" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Asignaciones por Estado</CardTitle>
            <CardDescription>Distribución de asignaciones en los últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {/* Chart would go here */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4 text-center">
                <div className="text-sm font-medium text-muted-foreground">Completadas</div>
                <div className="mt-1 text-4xl font-bold text-green-600">
                  {assignmentsData?.completed.toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {assignmentsData?.completedPercentage}% del total
                </div>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-sm font-medium text-muted-foreground">En Progreso</div>
                <div className="mt-1 text-4xl font-bold text-amber-600">
                  {assignmentsData?.inProgress.toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {assignmentsData?.inProgressPercentage}% del total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Asignaciones por Conductor</CardTitle>
              <CardDescription>Top 5 conductores por número de asignaciones</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Chart would go here */}
              <div className="space-y-4">
                {assignmentsData?.byDriver.slice(0, 5).map((item: any, index: number) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.count} asignaciones</div>
                    </div>
                    <div className="text-sm font-medium">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tiempo Promedio de Entrega</CardTitle>
              <CardDescription>Tiempo promedio para completar asignaciones</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Chart would go here */}
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-5xl font-bold">{assignmentsData?.avgDeliveryTime} hrs</div>
                <div className="mt-2 text-center text-sm text-muted-foreground">
                  Tiempo promedio desde la asignación hasta la entrega completa
                </div>
                <div className="mt-6 grid w-full grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Más Rápido</div>
                    <div className="mt-1 text-xl font-bold">{assignmentsData?.minDeliveryTime} hrs</div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Más Lento</div>
                    <div className="mt-1 text-xl font-bold">{assignmentsData?.maxDeliveryTime} hrs</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="trends" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tendencias de Consumo</CardTitle>
            <CardDescription>Evolución del consumo de combustible en los últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            {/* Chart would go here */}
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Gráfico de tendencias en desarrollo</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
