"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Droplet, TruckIcon, Wrench } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { assignmentColumns } from "./assignment-columns"
import { maintenanceColumns } from "./maintenance-columns"
import { useToast } from "@/hooks/use-toast"
import { TruckDialog } from "../truck-dialog"

export default function TruckDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const truckId = params.id
  const [truck, setTruck] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [maintenances, setMaintenances] = useState([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    const fetchTruckData = async () => {
      setLoading(true)
      try {
        // En un entorno real, estas serían llamadas a la API
        const truckResponse = await axios.get(`/api/trucks/${truckId}`)
        const assignmentsResponse = await axios.get(`/api/assignments?truckId=${truckId}`)
        const maintenancesResponse = await axios.get(`/api/trucks/${truckId}/maintenances`)

        setTruck(truckResponse.data)
        setAssignments(assignmentsResponse.data)
        setMaintenances(maintenancesResponse.data)
      } catch (error) {
        console.error("Error fetching truck data:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del camión",
          variant: "destructive",
        })
        // Datos de ejemplo para desarrollo
        setTruck({
          id: truckId,
          placa: "ABC123",
          typefuel: "DIESEL B5",
          capacitygal: 1000,
          state: "Activo",
          createdAt: "2025-01-15T10:00:00Z",
          updatedAt: "2025-05-10T14:30:00Z",
        })
        setAssignments([
          {
            id: 1,
            createdAt: "2025-05-15T08:00:00Z",
            driver: {
              id: 1,
              name: "Juan",
              lastname: "Pérez",
            },
            totalLoaded: 800,
            totalRemaining: 200,
            fuelType: "DIESEL B5",
            isCompleted: true,
          },
          {
            id: 2,
            createdAt: "2025-05-18T09:30:00Z",
            driver: {
              id: 2,
              name: "María",
              lastname: "López",
            },
            totalLoaded: 1000,
            totalRemaining: 1000,
            fuelType: "DIESEL B5",
            isCompleted: false,
          },
        ])
        setMaintenances([
          {
            id: 1,
            description: "Cambio de aceite y filtros",
            startDate: "2025-04-10T08:00:00Z",
            endDate: "2025-04-10T12:00:00Z",
            status: "Completado",
            cost: 350.0,
          },
          {
            id: 2,
            description: "Revisión de frenos",
            startDate: "2025-05-05T14:00:00Z",
            endDate: "2025-05-05T17:00:00Z",
            status: "Completado",
            cost: 280.0,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTruckData()
  }, [truckId, toast])

  const handleUpdateTruck = async (truckData) => {
    try {
      const response = await axios.put(`/api/trucks/${truckId}`, truckData)
      setTruck(response.data)
      toast({
        title: "Éxito",
        description: "Camión actualizado correctamente",
      })
    } catch (error) {
      console.error("Error updating truck:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el camión",
        variant: "destructive",
      })
      // Para desarrollo, actualizamos el camión
      setTruck({ ...truck, ...truckData })
    }
    setEditDialogOpen(false)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p>Cargando datos del camión...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!truck) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-bold">Camión no encontrado</h2>
          <p className="text-muted-foreground">El camión solicitado no existe o no tienes permisos para verlo.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/trucks">Volver a Camiones</Link>
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/trucks">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Camión {truck.placa}</h1>
              <p className="text-muted-foreground">Detalles y gestión del camión</p>
            </div>
          </div>
          <Button onClick={() => setEditDialogOpen(true)}>Editar Camión</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información General</CardTitle>
                  <CardDescription>Detalles básicos del camión</CardDescription>
                </div>
                <TruckIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Placa</p>
                  <p className="font-medium">{truck.placa}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge
                    variant={
                      truck.state === "Activo"
                        ? "success"
                        : truck.state === "Asignado"
                          ? "warning"
                          : truck.state === "Mantenimiento"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {truck.state}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Combustible</p>
                  <p className="font-medium">{truck.typefuel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacidad</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("es-PE", {
                      minimumFractionDigits: 2,
                    }).format(truck.capacitygal)}{" "}
                    gal
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Registro</p>
                  <p className="font-medium">{format(new Date(truck.createdAt), "PPP", { locale: es })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última Actualización</p>
                  <p className="font-medium">{format(new Date(truck.updatedAt), "PPP", { locale: es })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Estadísticas</CardTitle>
                  <CardDescription>Resumen de operaciones</CardDescription>
                </div>
                <Droplet className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Asignaciones</p>
                  <p className="text-2xl font-bold">{assignments.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Asignaciones Completadas</p>
                  <p className="text-2xl font-bold">
                    {assignments.filter((a) => a.isCompleted).length}/{assignments.length}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Mantenimientos</p>
                  <p className="text-2xl font-bold">{maintenances.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Último Mantenimiento</p>
                  <p className="font-medium">
                    {maintenances.length > 0 ? format(new Date(maintenances[0].endDate), "PPP", { locale: es }) : "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Combustible Despachado (Último Mes)</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("es-PE", {
                    minimumFractionDigits: 2,
                  }).format(
                    assignments
                      .filter(
                        (a) =>
                          new Date(a.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && a.isCompleted,
                      )
                      .reduce((acc, curr) => acc + (curr.totalLoaded - curr.totalRemaining), 0),
                  )}{" "}
                  gal
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assignments">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assignments">
              <Calendar className="mr-2 h-4 w-4" />
              Asignaciones
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <Wrench className="mr-2 h-4 w-4" />
              Mantenimientos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="assignments" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Asignaciones</CardTitle>
                <CardDescription>Registro de todas las asignaciones del camión</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={assignmentColumns}
                  data={assignments}
                  searchKey="driver.name"
                  searchPlaceholder="Buscar por conductor..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="maintenance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Mantenimientos</CardTitle>
                <CardDescription>Registro de todos los mantenimientos del camión</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={maintenanceColumns}
                  data={maintenances}
                  searchKey="description"
                  searchPlaceholder="Buscar por descripción..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TruckDialog open={editDialogOpen} setOpen={setEditDialogOpen} onSubmit={handleUpdateTruck} truck={truck} />
    </AdminLayout>
  )
}
