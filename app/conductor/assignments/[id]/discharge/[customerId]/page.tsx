"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Droplet } from "lucide-react"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"

import { DriverLayout } from "@/components/layouts/driver-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  totalDischarged: z
    .string()
    .min(1, { message: "Este campo es requerido" })
    .refine((val) => !isNaN(Number.parseFloat(val)), {
      message: "Debe ser un número válido",
    })
    .refine((val) => Number.parseFloat(val) > 0, {
      message: "Debe ser mayor a 0",
    }),
  notes: z.string().optional(),
})

export default function DischargeFormPage() {
  const params = useParams()
  const router = useRouter()
  const { id: assignmentId, customerId } = params
  const [assignment, setAssignment] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalDischarged: "",
      notes: "",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // En un entorno real, estas serían llamadas a la API
        const assignmentResponse = await axios.get(`/api/assignments/${assignmentId}`)
        const customerResponse = await axios.get(`/api/customers/${customerId}`)

        setAssignment(assignmentResponse.data)
        setCustomer(customerResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Datos de ejemplo para desarrollo
        setAssignment({
          id: assignmentId,
          truck: {
            id: 1,
            placa: "ABC123",
            state: "Asignado",
          },
          totalLoaded: 1000,
          totalRemaining: 800,
          fuelType: "DIESEL B5",
        })
        setCustomer({
          id: customerId,
          companyname: "Empresa X",
          address: "Av. Principal 123, Lima",
          ruc: "20123456789",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [assignmentId, customerId])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true)
    setError("")

    try {
      const totalDischarged = Number.parseFloat(values.totalDischarged)

      // Validar que la cantidad a descargar no exceda el combustible restante
      if (totalDischarged > assignment.totalRemaining) {
        setError(`La cantidad a descargar no puede exceder el combustible restante (${assignment.totalRemaining} gal)`)
        return
      }

      // En un entorno real, esta sería una llamada a la API
      await axios.post("/api/discharges", {
        assignmentId,
        customerId,
        totalDischarged,
        notes: values.notes,
      })

      // Redirigir al detalle de la asignación
      router.push(`/conductor/assignments/${assignmentId}`)
    } catch (error) {
      console.error("Error submitting discharge:", error)
      setError("Ocurrió un error al registrar la descarga. Intente nuevamente.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DriverLayout>
        <div className="flex items-center justify-center h-full">
          <p>Cargando datos...</p>
        </div>
      </DriverLayout>
    )
  }

  return (
    <DriverLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/conductor/assignments/${assignmentId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registrar Descarga</h1>
            <p className="text-muted-foreground">
              Camión {assignment.truck.placa} - Cliente {customer.companyname}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información del Camión</CardTitle>
              <CardDescription>Detalles del vehículo y combustible</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Placa</p>
                  <p className="font-medium">{assignment.truck.placa}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="font-medium">{assignment.truck.state}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Combustible</p>
                  <p className="font-medium">{assignment.fuelType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Combustible Restante</p>
                  <p className="font-medium">{assignment.totalRemaining} gal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
              <CardDescription>Detalles del cliente a atender</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Empresa</p>
                <p className="font-medium">{customer.companyname}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RUC</p>
                <p className="font-medium">{customer.ruc}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-medium">{customer.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Formulario de Descarga</CardTitle>
                <CardDescription>Ingrese la cantidad de combustible descargado</CardDescription>
              </div>
              <Droplet className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="totalDischarged"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Galones Descargados</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ingrese la cantidad de galones descargados (máximo {assignment.totalRemaining} gal)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas Adicionales</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Observaciones o comentarios sobre la descarga" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/conductor/assignments/${assignmentId}`}>Cancelar</Link>
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Registrando..." : "Registrar Descarga"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DriverLayout>
  )
}
