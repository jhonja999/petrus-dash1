"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FUEL_TYPES } from "@/lib/constants"

type FuelConsumptionData = {
  fuelType: string
  total: number
}

type AssignmentsByPeriod = {
  period: string
  count: number
}

export default function FuelReportsPage() {
  const [fuelConsumption, setFuelConsumption] = useState<FuelConsumptionData[]>([])
  const [assignmentsByPeriod, setAssignmentsByPeriod] = useState<AssignmentsByPeriod[]>([])
  const [period, setPeriod] = useState<string>("day")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [fuelRes, assignmentsRes] = await Promise.all([
          fetch(`/api/analytics/fuel-consumption?period=${period}`),
          fetch(`/api/analytics/assignments?period=${period}`),
        ])

        if (fuelRes.ok && assignmentsRes.ok) {
          const fuelData = await fuelRes.json()
          const assignmentsData = await assignmentsRes.json()

          setFuelConsumption(fuelData)
          setAssignmentsByPeriod(assignmentsData)
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [period])

  // Transform fuel consumption data for chart
  const fuelChartData = fuelConsumption.map((item) => ({
    name: FUEL_TYPES[item.fuelType] || item.fuelType,
    galones: item.total,
  }))

  // Transform assignments data for chart
  const assignmentsChartData = assignmentsByPeriod.map((item) => ({
    name: item.period,
    asignaciones: item.count,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Combustible</h1>
          <p className="text-muted-foreground">Análisis de consumo de combustible y asignaciones</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Período:</span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoy</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="consumption">
        <TabsList>
          <TabsTrigger value="consumption">Consumo por Tipo</TabsTrigger>
          <TabsTrigger value="assignments">Asignaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="consumption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumo por Tipo de Combustible</CardTitle>
              <CardDescription>Galones despachados por tipo de combustible en el período seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <p>Cargando datos...</p>
                  </div>
                ) : fuelChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={fuelChartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="galones" fill="#8884d8" name="Galones" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p>No hay datos disponibles para el período seleccionado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asignaciones por Período</CardTitle>
              <CardDescription>Número de asignaciones realizadas en el período seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <p>Cargando datos...</p>
                  </div>
                ) : assignmentsChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={assignmentsChartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="asignaciones" fill="#82ca9d" name="Asignaciones" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p>No hay datos disponibles para el período seleccionado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
