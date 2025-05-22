"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Fuel, Building2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { dischargeSchema } from "@/lib/zod-schemas"

type AssignmentType = {
  id: number
  totalLoaded: number
  totalRemaining: number
  fuelType: string
  truck: {
    id: number
    placa: string
    state: string
  }
}

type CustomerType = {
  id: number
  companyname: string
  ruc: string
  address: string
}

export default function DischargeRecordPage({
  params,
}: {
  params: { assignmentId: string }
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const customerId = searchParams.get("customerId")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assignment, setAssignment] = useState<AssignmentType | null>(null)
  const [customer, setCustomer] = useState<CustomerType | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formValues, setFormValues] = useState<any>(null)

  const form = useForm<z.infer<typeof dischargeSchema>>({
    resolver: zodResolver(dischargeSchema),
    defaultValues: {
      assignmentId: Number.parseInt(params.assignmentId),
      customerId: customerId ? Number.parseInt(customerId) : 0,
      startMarker: 0,
      endMarker: 0,
      notes: "",
    },
  })

  useEffect(() => {
    if (!customerId) {
      router.push(`/driver/${params.assignmentId}`)
      return
    }

    const fetchData = async () => {
      try {
        const [assignmentRes, customerRes] = await Promise.all([
          fetch(`/api/assignments/${params.assignmentId}`),
          fetch(`/api/customers/${customerId}`),
        ])

        if (!assignmentRes.ok || !customerRes.ok) {
          throw new Error("Error al cargar los datos")
        }

        const assignmentData = await assignmentRes.json()
        const customerData = await customerRes.json()

        setAssignment(assignmentData)
        setCustomer(customerData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("No se pudieron cargar los datos necesarios")
      }
    }

    fetchData()
  }, [params.assignmentId, customerId, router])

  async function onSubmit(values: z.infer<typeof dischargeSchema>) {
    // Validate that end marker is greater than start marker
    if (values.endMarker <= values.startMarker) {
      setError("El marcador final debe ser mayor que el marcador inicial")
      return
    }

    // Calculate total discharged
    const totalDischarged = values.endMarker - values.startMarker

    // Validate that there's enough fuel remaining
    if (assignment && totalDischarged > Number(assignment.totalRemaining)) {
      setError(`No hay suficiente combustible restante. Máximo disponible: ${assignment.totalRemaining} gal`)
      return
    }

    // Show confirmation before submitting
    setFormValues(values)
    setShowConfirmation(true)
  }

  async function confirmDischarge() {
    if (!formValues) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/discharges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al registrar la descarga")
      }

      // Update truck state to "Descarga" if not already
      if (assignment && assignment.truck.state !== "Descarga") {
        await fetch(`/api/trucks/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            truckId: assignment.truck.id,
            newState: "Descarga",
          }),
        })
      }

      router.push(`/driver/${params.assignmentId}`)
      router.refresh()
    } catch (error: any) {
      console.error("Error recording discharge:", error)
      setError(error.message || "Error al registrar la descarga")
      setShowConfirmation(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (!assignment || !customer) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Cargando...</h2>
          <p className="text-sm text-muted-foreground">Obteniendo información necesaria</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Registrar Descarga</h1>
        <p className="text-muted-foreground">Ingresa los datos de la descarga de combustible</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showConfirmation ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-600">Confirmar Descarga</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verifica la información antes de confirmar</AlertTitle>
              <AlertDescription>
                Esta acción no se puede deshacer. Asegúrate de que los datos son correctos.
              </AlertDescription>
            </Alert>

            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Resumen de la Descarga</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cliente:</span>
                  <span className="font-medium">{customer.companyname}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Marcador Inicial:</span>
                  <span>{formValues.startMarker} gal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Marcador Final:</span>
                  <span>{formValues.endMarker} gal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total a Descargar:</span>
                  <span className="font-bold">{formValues.endMarker - formValues.startMarker} gal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Combustible Restante Después:</span>
                  <span>{Number(assignment.totalRemaining) - (formValues.endMarker - formValues.startMarker)} gal</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={isLoading}>
              Volver
            </Button>
            <Button onClick={confirmDischarge} disabled={isLoading}>
              {isLoading ? "Registrando..." : "Confirmar Descarga"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Empresa:</span>
                    <span>{customer.companyname}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">RUC:</span>
                    <span>{customer.ruc}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dirección:</span>
                    <span>{customer.address}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5" />
                Información de la Descarga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-md border p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Camión:</span>
                    <span>{assignment.truck.placa}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Combustible Restante:</span>
                    <span className="font-bold">{assignment.totalRemaining.toString()} gal</span>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="startMarker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marcador Inicial (gal)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Lectura del marcador antes de iniciar la descarga</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endMarker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marcador Final (gal)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Lectura del marcador después de finalizar la descarga</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Observaciones sobre la descarga" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancelar
                    </Button>
                    <Button type="submit">Registrar Descarga</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
