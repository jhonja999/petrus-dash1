"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, TrendingUp, TrendingDown, Fuel, Truck } from "lucide-react"
import { formatDate } from "@/lib/date"

interface FuelReport {
  id: number
  date: string
  truckId: number
  truckPlate: string
  driverId: number
  driverName: string
  fuelType: string
  quantity: number
  cost: number
  location: string
  efficiency: number
}

export default function FuelReportsPage() {
  const [reports, setReports] = useState<FuelReport[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedTruck, setSelectedTruck] = useState<string>("all")
  const [selectedFuelType, setSelectedFuelType] = useState<string>("all")

  // Mock data for demonstration
  useEffect(() => {
    const mockReports: FuelReport[] = [
      {
        id: 1,
        date: "2024-01-15",
        truckId: 1,
        truckPlate: "ABC-123",
        driverId: 1,
        driverName: "Juan Pérez",
        fuelType: "Diesel",
        quantity: 250,
        cost: 875.0,
        location: "Estación Central",
        efficiency: 8.5,
      },
      {
        id: 2,
        date: "2024-01-14",
        truckId: 2,
        truckPlate: "DEF-456",
        driverId: 2,
        driverName: "María García",
        fuelType: "Gasolina",
        quantity: 180,
        cost: 720.0,
        location: "Estación Norte",
        efficiency: 12.2,
      },
      {
        id: 3,
        date: "2024-01-13",
        truckId: 1,
        truckPlate: "ABC-123",
        driverId: 1,
        driverName: "Juan Pérez",
        fuelType: "Diesel",
        quantity: 300,
        cost: 1050.0,
        location: "Estación Sur",
        efficiency: 7.8,
      },
    ]

    setTimeout(() => {
      setReports(mockReports)
      setLoading(false)
    }, 1000)
  }, [])

  const totalCost = reports.reduce((sum, report) => sum + report.cost, 0)
  const totalQuantity = reports.reduce((sum, report) => sum + report.quantity, 0)
  const averageEfficiency =
    reports.length > 0 ? reports.reduce((sum, report) => sum + report.efficiency, 0) / reports.length : 0

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    alert("Exportando reporte a PDF...")
  }

  const handleApplyFilters = () => {
    // TODO: Implement filter functionality
    alert("Aplicando filtros...")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reportes de Combustible</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reportes de Combustible</h1>
        <Button onClick={handleExportPDF} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Litros Totales</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity.toLocaleString()}L</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia Promedio</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageEfficiency.toFixed(1)} km/L</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -2% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reportes</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">Total de registros</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Inicio</label>
              <DatePicker value={startDate} onChange={setStartDate} placeholder="Seleccionar fecha" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Fin</label>
              <DatePicker value={endDate} onChange={setEndDate} placeholder="Seleccionar fecha" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Camión</label>
              <Select value={selectedTruck} onValueChange={setSelectedTruck}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los camiones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los camiones</SelectItem>
                  <SelectItem value="1">ABC-123</SelectItem>
                  <SelectItem value="2">DEF-456</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Combustible</label>
              <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="gasolina">Gasolina</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleApplyFilters} className="w-full">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Combustible</CardTitle>
          <CardDescription>Historial detallado de consumo de combustible por camión</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Fecha</th>
                  <th className="text-left p-2">Camión</th>
                  <th className="text-left p-2">Conductor</th>
                  <th className="text-left p-2">Combustible</th>
                  <th className="text-left p-2">Cantidad</th>
                  <th className="text-left p-2">Costo</th>
                  <th className="text-left p-2">Eficiencia</th>
                  <th className="text-left p-2">Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{formatDate(new Date(report.date))}</td>
                    <td className="p-2">
                      <div className="font-medium">{report.truckPlate}</div>
                    </td>
                    <td className="p-2">{report.driverName}</td>
                    <td className="p-2">
                      <Badge variant={report.fuelType === "Diesel" ? "default" : "secondary"}>{report.fuelType}</Badge>
                    </td>
                    <td className="p-2">{report.quantity}L</td>
                    <td className="p-2">${report.cost.toLocaleString()}</td>
                    <td className="p-2">
                      <span
                        className={`font-medium ${
                          report.efficiency > 10
                            ? "text-green-600"
                            : report.efficiency > 8
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {report.efficiency} km/L
                      </span>
                    </td>
                    <td className="p-2">{report.location}</td>
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
