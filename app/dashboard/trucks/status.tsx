"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Truck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TRUCK_STATES, FUEL_TYPES } from "@/lib/constants"

type TruckType = {
  id: number
  placa: string
  typefuel: string
  capacitygal: number
  state: string
}

export default function TruckStatusPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const truckId = searchParams.get("id")

  const [truck, setTruck] = useState<TruckType | null>(null)
  const [selectedState, setSelectedState] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!truckId) {
      router.push("/dashboard/trucks")
      return
    }

    const fetchTruck = async () => {
      try {
        const response = await fetch(`/api/trucks/${truckId}`)
        if (!response.ok) {
          throw new Error("Error al cargar el camión")
        }
        const data = await response.json()
        setTruck(data)
        setSelectedState(data.state)
      } catch (error) {
        console.error("Error fetching truck:", error)
        setError("No se pudo cargar la información del camión")
      }
    }

    fetchTruck()
  }, [truckId, router])

  const handleUpdateStatus = async () => {
    if (!truck || !selectedState) {
      setError("Selecciona un estado para el camión")
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
          truckId: truck.id,
          newState: selectedState,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el estado del camión")
      }

      router.push("/dashboard/trucks")
      router.refresh()
    } catch (error) {
      console.error("Error updating truck status:", error)
      setError("No se pudo actualizar el estado del camión")
    } finally {
      setIsLoading(false)
    }
  }

  if (!truck) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Cargando...</h2>
          <p className="text-sm text-muted-foreground">Obteniendo información del camión</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cambiar Estado del Camión</h1>
        <p className="text-muted-foreground">Actualiza el estado operativo del camión</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Información del Camión
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

          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium">Detalles del Camión</h3>
            <div className="space-y-2">
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
              <div className="flex items-center justify-between">
                <span className="text-sm">Estado Actual:</span>
                <Badge>{TRUCK_STATES[truck.state]}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Selecciona el nuevo estado</h3>
            <RadioGroup value={selectedState} onValueChange={setSelectedState}>
              {Object.entries(TRUCK_STATES).map(([value, label]) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={value} />
                  <Label htmlFor={value}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleUpdateStatus} disabled={isLoading || selectedState === truck.state}>
            {isLoading ? "Actualizando..." : "Actualizar Estado"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
