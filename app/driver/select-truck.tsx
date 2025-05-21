"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TruckIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FUEL_TYPES } from "@/lib/constants"

type TruckType = {
  id: number
  placa: string
  typefuel: string
  capacitygal: number
  state: string
}

export default function SelectTruckPage() {
  const router = useRouter()
  const [trucks, setTrucks] = useState<TruckType[]>([])
  const [selectedTruck, setSelectedTruck] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const response = await fetch("/api/trucks?state=Activo")
        if (!response.ok) {
          throw new Error("Error al cargar los camiones")
        }
        const data = await response.json()
        setTrucks(data)
      } catch (error) {
        console.error("Error fetching trucks:", error)
        setError("No se pudieron cargar los camiones disponibles")
      }
    }

    fetchTrucks()
  }, [])

  const handleSelectTruck = async () => {
    if (!selectedTruck) {
      setError("Debes seleccionar un camión")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/trucks/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          truckId: selectedTruck,
          newState: "Asignado",
        }),
      })

      if (!response.ok) {
        throw new Error("Error al asignar el camión")
      }

      router.push("/driver")
      router.refresh()
    } catch (error) {
      console.error("Error selecting truck:", error)
      setError("No se pudo asignar el camión. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seleccionar Camión</h1>
        <p className="text-muted-foreground">Selecciona un camión para iniciar tu jornada</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5" />
            Camiones Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="truck-select" className="text-sm font-medium">
              Selecciona un camión
            </label>
            <Select
              value={selectedTruck?.toString() || ""}
              onValueChange={(value) => setSelectedTruck(Number.parseInt(value))}
            >
              <SelectTrigger id="truck-select">
                <SelectValue placeholder="Selecciona un camión" />
              </SelectTrigger>
              <SelectContent>
                {trucks.map((truck) => (
                  <SelectItem key={truck.id} value={truck.id.toString()}>
                    {truck.placa} - {FUEL_TYPES[truck.typefuel]} ({truck.capacitygal.toString()} gal)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTruck && (
            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Información del Camión</h3>
              <div className="space-y-2">
                {trucks
                  .filter((truck) => truck.id === selectedTruck)
                  .map((truck) => (
                    <div key={truck.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Placa:</span>
                        <Badge variant="outline">{truck.placa}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tipo de Combustible:</span>
                        <span>{FUEL_TYPES[truck.typefuel]}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Capacidad:</span>
                        <span>{truck.capacitygal.toString()} gal</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSelectTruck} disabled={!selectedTruck || isLoading}>
            {isLoading ? "Asignando..." : "Seleccionar Camión"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
