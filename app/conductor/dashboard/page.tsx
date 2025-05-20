"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Truck } from "lucide-react"
import axios from "axios"

import { DriverLayout } from "@/components/layouts/driver-layout"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { AssignmentCard } from "./assignment-card"

export default function DriverDashboard() {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedTruck, setSelectedTruck] = useState<string>("all")
  const [trucks, setTrucks] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        // En un entorno real, esta sería una llamada a la API
        const response = await axios.get("/api/trucks/assigned")
        setTrucks(response.data)
      } catch (error) {
        console.error("Error fetching trucks:", error)
        // Datos de ejemplo para desarrollo
        setTrucks([
          { id: 1, placa: "ABC123", typefuel: "DIESEL B5" },
          { id: 2, placa: "DEF456", typefuel: "GASOLINA 95" },
        ])
      }
    }

    fetchTrucks()
  }, [])

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true)
      try {
        // En un entorno real, esta sería una llamada a la API
        const formattedDate = format(date, "yyyy-MM-dd")
        const url = `/api/assignments?date=${formattedDate}${selectedTruck !== "all" ? `&truckId=${selectedTruck}` : ""}`
        const response = await axios.get(url)
        setAssignments(response.data)
      } catch (error) {
        console.error("Error fetching assignments:", error)
        // Datos de ejemplo para desarrollo
        setAssignments([
          {
            id: 1,
            truck: {
              id: 1,
              placa: "ABC123",
              typefuel: "DIESEL B5",
              state: "Asignado",
            },
            totalLoaded: 1000,
            totalRemaining: 800,
            fuelType: "DIESEL B5",
            customers: [
              {
                id: 1,
                companyname: "Empresa X",
                address: "Av. Principal 123, Lima",
                discharged: false,
              },
              {
                id: 2,
                companyname: "Empresa Y",
                address: "Jr. Secundario 456, Lima",
                discharged: true,
              },
            ],
          },
          {
            id: 2,
            truck: {
              id: 2,
              placa: "DEF456",
              typefuel: "GASOLINA 95",
              state: "Activo",
            },
            totalLoaded: 800,
            totalRemaining: 800,
            fuelType: "GASOLINA 95",
            customers: [
              {
                id: 3,
                companyname: "Empresa Z",
                address: "Calle Terciaria 789, Lima",
                discharged: false,
              },
            ],
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [date, selectedTruck])

  return (
    <DriverLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Gestión de asignaciones y despachos</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <Select value={selectedTruck} onValueChange={setSelectedTruck}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar camión" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los camiones</SelectItem>
                {trucks.map((truck) => (
                  <SelectItem key={truck.id} value={truck.id.toString()}>
                    {truck.placa} - {truck.typefuel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p>Cargando asignaciones...</p>
          ) : assignments.length > 0 ? (
            assignments.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Truck className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hay asignaciones</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No se encontraron asignaciones para la fecha y camión seleccionados.
              </p>
            </div>
          )}
        </div>
      </div>
    </DriverLayout>
  )
}
