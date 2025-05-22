"use client"

import { useState, useEffect } from "react"
import { Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TRUCK_STATES } from "@/lib/constants"

export default function TruckStatusPage() {
  const [statusData, setStatusData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStatusData() {
      setIsLoading(true)
      try {
        const response = await fetch("/api/trucks/status")
        const data = await response.json()
        setStatusData(data)
      } catch (error) {
        console.error("Error loading truck status data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStatusData()
  }, [])

  if (isLoading) {
    return <div className="flex h-24 items-center justify-center">Cargando datos de estado...</div>
  }

  if (!statusData) {
    return <div className="flex h-24 items-center justify-center">No se pudieron cargar los datos</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Estado de Camiones</h1>
        <p className="text-muted-foreground">Visualización del estado actual de la flota</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(TRUCK_STATES).map(([state, label]) => {
          const count = statusData.byState.find((item: any) => item.state === state)?.count || 0
          const percentage = statusData.total > 0 ? Math.round((count / statusData.total) * 100) : 0

          return (
            <Card key={state}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{label}</CardTitle>
                <CardDescription>
                  {count} de {statusData.total} camiones ({percentage}%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Distribución por Tipo de Combustible
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statusData.byFuelType.map((item: any) => (
              <div key={item.type} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="font-medium">{item.type}</div>
                  <div className="text-sm text-muted-foreground">{item.count} camiones</div>
                </div>
                <div className="text-2xl font-bold">{Math.round((item.count / statusData.total) * 100)}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
