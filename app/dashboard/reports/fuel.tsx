"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { BarChart3, Download, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { FUEL_TYPES } from "@/lib/constants"
import { formatDate } from "@/lib/date"

const formSchema = z.object({
  fuelType: z.string().optional(),
  period: z.enum(["day", "week", "month", "year"]),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

export default function FuelReportsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      period: "month",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Format dates for API
      const params = new URLSearchParams()
      if (values.fuelType) params.append("fuelType", values.fuelType)
      params.append("period", values.period)
      if (values.startDate) params.append("startDate", values.startDate.toISOString())
      if (values.endDate) params.append("endDate", values.endDate.toISOString())

      const response = await fetch(`/api/reports/fuel?${params.toString()}`)
      const data = await response.json()
      setReportData(data)
    } catch (error) {
      console.error("Error fetching report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/reports/fuel?period=month`)
        const data = await response.json()
        setReportData(data)
      } catch (error) {
        console.error("Error fetching initial report:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Combustible</h1>
          <p className="text-muted-foreground">Analiza el consumo y distribución de combustible</p>
        </div>
        <Button variant="outline" size="sm" disabled={!reportData}>
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros del Reporte
          </CardTitle>
          <CardDescription>Personaliza los parámetros para generar el reporte</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Combustible</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos los tipos" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        {Object.entries(FUEL_TYPES).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un período" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="day">Diario</SelectItem>
                        <SelectItem value="week">Semanal</SelectItem>
                        <SelectItem value="month">Mensual</SelectItem>
                        <SelectItem value="year">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Inicio</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} placeholder="Seleccionar fecha inicio" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Fin</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} placeholder="Seleccionar fecha fin" />
                  </FormItem>
                )}
              />

              <div className="flex items-end sm:col-span-2 lg:col-span-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Generando..." : "Generar Reporte"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resultados del Reporte
          </CardTitle>
          <CardDescription>
            {reportData
              ? `Datos del ${formatDate(new Date(reportData.period.start))} al ${formatDate(
                  new Date(reportData.period.end),
                )}`
              : "Cargando datos..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <p>Cargando datos del reporte...</p>
            </div>
          ) : reportData ? (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Total Cargado</div>
                  <div className="mt-1 text-2xl font-bold">{reportData.totalLoaded.toLocaleString()} gal</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Total Descargado</div>
                  <div className="mt-1 text-2xl font-bold">{reportData.totalDischarged.toLocaleString()} gal</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Eficiencia</div>
                  <div className="mt-1 text-2xl font-bold">{reportData.efficiency}%</div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">Distribución por Tipo de Combustible</h3>
                <div className="h-64 w-full">
                  {/* Chart would go here */}
                  <div className="grid h-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {reportData.byFuelType.map((item: any) => (
                      <div key={item.type} className="rounded-lg border p-4">
                        <div className="text-sm font-medium">{FUEL_TYPES[item.type as keyof typeof FUEL_TYPES]}</div>
                        <div className="mt-1 text-xl font-bold">{item.amount.toLocaleString()} gal</div>
                        <div className="mt-1 text-sm text-muted-foreground">{item.percentage}% del total</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">Distribución por Cliente</h3>
                <div className="h-64 w-full">
                  {/* Chart would go here */}
                  <div className="max-h-64 overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 text-left">Cliente</th>
                          <th className="pb-2 text-right">Cantidad</th>
                          <th className="pb-2 text-right">Porcentaje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.byCustomer.map((item: any) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-2">{item.name}</td>
                            <td className="py-2 text-right">{item.amount.toLocaleString()} gal</td>
                            <td className="py-2 text-right">{item.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p>No hay datos disponibles. Genera un reporte para ver los resultados.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
