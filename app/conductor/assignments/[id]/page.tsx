"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, CheckCircle, Droplet, MapPin, Truck } from "lucide-react"
import Link from "next/link"
import axios from "axios"

import { DriverLayout } from "@/components/layouts/driver-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AssignmentDetailPage() {
  const params = useParams()
  const assignmentId = params.id
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssignment = async () => {
      setLoading(true)
      try {
        // En un entorno real, esta sería una llamada a la API
        const response = await axios.get(`/api/assignments/${assignmentId}`)
        setAssignment(response.data)
      } catch (error) {
        console.error("Error fetching assignment:", error)
        // Datos de ejemplo para desarrollo
        setAssignment({
          id: assignmentId,
          createdAt: "2025-05-19T08:00:00Z",
          truck: {
            id: 1,
            placa: "ABC123",
            typefuel: "DIESEL B5",
            state: "Asignado",
          },
          totalLoaded: 1000,
          totalRemaining: 800,
          fuelType: "DIESEL B5",
          isCompleted: false,
          discharges: [
            {
              id: 1,
              customer: {
                id: 2,
                companyname: "Empresa Y",
                address: "Jr. Secundario 456, Lima",
              },
              totalDischarged: 200,
              createdAt: "2025-05-19T10:30:00Z",
            },
          ],
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
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAssignment()
  }, [assignmentId])

  if (loading) {
    return (
      <DriverLayout>
        <div className="flex items-center justify-center h-full">
          <p>Cargando detalles de la asignación...</p>
        </div>
      </DriverLayout>
    )
  }

  if (!assignment) {
    return (
      <DriverLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-bold">Asignación no encontrada</h2>
          <p className="text-muted-foreground">La asignación solicitada no existe o no tienes permisos para verla.</p>
          <Button asChild className="mt-4">
            <Link href="/conductor/dashboard">Volver al Dashboard</Link>
          </Button>
        </div>
      </DriverLayout>
    )
  }

  const completedCustomers = assignment.customers.filter((c) => c.discharged).length
  const totalCustomers = assignment.customers.length
  const progress = totalCustomers > 0 ? (completedCustomers / totalCustomers) * 100 : 0

  return (
    <DriverLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/conductor/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detalle de Asignación</h1>
            <p className="text-muted-foreground">
              Asignación #{assignment.id} - {format(new Date(assignment.createdAt), "PPP", { locale: es })}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información del Camión</CardTitle>
                  <CardDescription>Detalles del vehículo asignado</CardDescription>
                </div>
                <Truck className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Placa</p>
                  <p className="font-medium">{assignment.truck.placa}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge variant={assignment.truck.state === "Activo" ? "success" : "warning"}>
                    {assignment.truck.state}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Combustible</p>
                  <p className="font-medium">{assignment.fuelType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Carga Total</p>
                  <p className="font-medium">{assignment.totalLoaded} gal</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Combustible Restante</p>
                <p className="font-medium">{assignment.totalRemaining} gal</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Progreso de Entregas</CardTitle>
                  <CardDescription>
                    {completedCustomers} de {totalCustomers} clientes completados
                  </CardDescription>
                </div>
                <CheckCircle className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
              </div>

              <div className="space-y-2">
                {assignment.isCompleted ? (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <p className="mt-2 font-medium">Asignación Completada</p>
                  </div>
                ) : (
                  <Button className="w-full" disabled={completedCustomers < totalCustomers}>
                    Marcar como Completada
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Descargas</CardTitle>
            <CardDescription>Registro de descargas realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {assignment.discharges.length > 0 ? (
              <div className="space-y-4">
                {assignment.discharges.map((discharge) => (
                  <div key={discharge.id} className="flex items-start justify-between rounded-md border p-4">
                    <div>
                      <p className="font-medium">{discharge.customer.companyname}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-4 w-4" />
                        {discharge.customer.address}
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <Droplet className="mr-1 h-4 w-4 text-blue-500" />
                        {discharge.totalDischarged} galones
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(discharge.createdAt), "PPP p", { locale: es })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <Droplet className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No hay descargas registradas</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Aún no se han registrado descargas para esta asignación.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes Asignados</CardTitle>
            <CardDescription>Listado de clientes a visitar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignment.customers.map((customer) => (
                <div key={customer.id} className="flex items-start justify-between rounded-md border p-4">
                  <div>
                    <p className="font-medium">{customer.companyname}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      {customer.address}
                    </div>
                  </div>
                  {customer.discharged ? (
                    <Badge variant="success">Completado</Badge>
                  ) : (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/conductor/assignments/${assignment.id}/discharge/${customer.id}`}>
                        Registrar Descarga
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DriverLayout>
  )
}
