"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TRUCK_STATES, FUEL_TYPES, type TruckState, type FuelType } from "@/lib/constants"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export function AnalyticsTabs() {
  const [period, setPeriod] = useState<string>("day")
  const [truckStatusData, setTruckStatusData] = useState<any[]>([])
  const [fuelConsumptionData, setFuelConsumptionData] = useState<any[]>([])
  const [assignmentsData, setAssignmentsData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [truckStatusRes, fuelConsumptionRes, assignmentsRes] = await Promise.all([
          fetch("/api/analytics/trucks-status"),
          fetch(`/api/analytics/fuel-consumption?period=${period}`),
          fetch(`/api/analytics/assignments?period=${period}`),
        ])

        if (truckStatusRes.ok && fuelConsumptionRes.ok && assignmentsRes.ok) {
          const truckStatus = await truckStatusRes.json()
          const fuelConsumption = await fuelConsumptionRes.json()
          const assignments = await assignmentsRes.json()

          // Format truck status data for pie chart
          const formattedTruckStatus = truckStatus.map((item: any) => ({
            name: TRUCK_STATES[item.state as TruckState] || item.state,
            value: item.count,
          }))

          // Format fuel consumption data for bar chart
          const formattedFuelConsumption = fuelConsumption.map((item: any) => ({
            name: FUEL_TYPES[item.fuelType as FuelType] || item.fuelType,
            galones: item.total,
          }))

          setTruckStatusData(formattedTruckStatus)
          setFuelConsumptionData(formattedFuelConsumption)
          setAssignmentsData(assignments)
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [period])

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
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

      <Tabs defaultValue="trucks">
        <TabsList>
          <TabsTrigger value="trucks">Estado de Camiones</TabsTrigger>
          <TabsTrigger value="fuel">Consumo de Combustible</TabsTrigger>
          <TabsTrigger value="assignments">Asignaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="trucks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Camiones</CardTitle>
              <CardDescription>Distribución actual de la flota por estado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <p>Cargando datos...</p>
                  </div>
                ) : truckStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={truckStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {truckStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p>No hay datos disponibles</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fuel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumo de Combustible</CardTitle>
              <CardDescription>Galones despachados por tipo de combustible</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <p>Cargando datos...</p>
                  </div>
                ) : fuelConsumptionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={fuelConsumptionData}
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
              <CardDescription>Número de asignaciones realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <p>Cargando datos...</p>
                  </div>
                ) : assignmentsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={assignmentsData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#82ca9d" name="Asignaciones" />
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
