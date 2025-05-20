"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Droplet, Truck, User, ClipboardList, CheckCircle, Building } from "lucide-react"
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
import { dischargeColumns } from "./discharge-columns"
import { customerColumns } from "./customer-columns"
import { useToast } from "@/hooks/use-toast"
import { AssignmentDialog } from "../assignment-dialog"

export default function AssignmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const assignmentId = params.id
  const [assignment, setAssignment] = useState(null)
  const [discharges, setDischarges] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    const fetchAssignmentData = async () => {
      setLoading(true)
      try {
        // En un entorno real, estas serían llamadas a la API
        const assignmentResponse = await axios.get(`/api/assignments/${assignmentId}`)
        const dischargesResponse = await axios.get(`/api/discharges?assignmentId=${assignmentId}`)
        const customersResponse = await axios.get(`/api/assignments/${assignmentId}/customers`)

        setAssignment(assignmentResponse.data)
        setDischarges(dischargesResponse.data)
        setCustomers(customersResponse.data)
      } catch (error) {
        console.error("Error fetching assignment data:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la asignación",
          variant: "destructive",
        })
        // Datos de ejemplo para desarrollo
        setAssignment({
          id: assignmentId,
          createdAt: "2025-05-15T08:00:00Z",
          truck: {
            id: 1,
            placa: "ABC123",
            typefuel: "DIESEL B5",
            capacitygal: 1000,
          },
          driver: {
            id: 1,
            name: "Juan",
            lastname: "Pérez",
            dni: "12345678",
          },
          totalLoaded: 800,
          totalRemaining: 200,
          fuelType: "DIESEL B5",
          notes: "Entrega programada para el día completo",
          isCompleted: false,
        })
        setDischarges([
          {
            id: 1,
            createdAt: "2025-05-15T10:30:00Z",
            customer: {
              id: 1,
              companyname: "Empresa X",
              address: "Av. Principal 123, Lima",
            },
            totalDischarged: 300,
            notes: "Entrega normal",
          },
          {
            id: 2,
            createdAt: "2025-05-15T14:15:00Z",
            customer: {
              id: 2,
              companyname: "Empresa Y",
              address: "Jr. Secundario 456, Lima",
            },
            totalDischarged: 300,
            notes: "Cliente solicitó verificación de medida",
          },
        ])
        setCustomers([
          {
            id: 1,
            companyname: "Empresa X",
            address: "Av. Principal 123, Lima",
            discharged: true,
          },
          {
            id: 2,
            companyname: "Empresa Y",
            address: "Jr. Secundario 456, Lima",
            discharged: true,
          },
          {
            id: 3,
            companyname: "Empresa Z",
            address: "Calle Terciaria 789, Lima",
            discharged: false,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAssignmentData()
  }, [assignmentId, toast])

  const handleUpdateAssignment = async (assignmentData) => {
    try {
      const response = await axios.put(`/api/assignments/${assignmentId}`, assignmentData)
      setAssignment({
        ...assignment,
        ...response.data,
        truck: assignment.truck,
        driver: assignment.driver,
      })
      toast({
        title: "Éxito",
        description: "Asignación actualizada correctamente",
      })
    } catch (error) {
      console.error("Error updating assignment:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la asignación",
        variant: "destructive",
      })
      // Para desarrollo, actualizamos la asignación
      setAssignment({
        ...assignment,
        ...assignmentData,
      })
    }
    setEditDialogOpen(false)
  }

  const handleCompleteAssignment = async () => {
    try {
      await axios.put(`/api/assignments/${assignmentId}`, {
        ...assignment,
        isCompleted: true,
      })
      setAssignment({
        ...assignment,
        isCompleted: true,
      })
      toast({
        title: "Éxito",
        description: "Asignación marcada como completada",
      })
    } catch (error) {
      console.error("Error completing assignment:", error)
      toast({
        title: "Error",
        description: "No se pudo completar la asignación",
        variant: "destructive",
      })
      // Para desarrollo, actualizamos la asignación
      setAssignment({
        ...assignment,
        isCompleted: true,
      })
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p>Cargando datos de la asignación...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!assignment) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-bold">Asignación no encontrada</h2>
          <p className="text-muted-foreground">La asignación solicitada no existe o no tienes permisos para verla.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/assignments">Volver a Asignaciones</Link>
          </Button>
        </div>
      </AdminLayout>
    )
  }

  // Calcular estadísticas
  const completedCustomers = customers.filter((c) => c.discharged).length
  const totalCustomers = customers.length
  const progress = totalCustomers > 0 ? (completedCustomers / totalCustomers) * 100 : 0

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/assignments">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Asignación #{assignment.id}</h1>
              <p className="text-muted-foreground">{format(new Date(assignment.createdAt), "PPP", { locale: es })}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!assignment.isCompleted && (
              <Button variant="outline" onClick={handleCompleteAssignment}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Marcar como Completada
              </Button>
            )}
            <Button onClick={() => setEditDialogOpen(true)}>Editar Asignación</Button>
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
                  <p className="text-sm text-muted-foreground">Tipo de Combustible</p>
                  <p className="font-medium">{assignment.fuelType}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Carga Total</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("es-PE", {
                      minimumFractionDigits: 2,
                    }).format(assignment.totalLoaded)}{" "}
                    gal
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Combustible Restante</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("es-PE", {
                      minimumFractionDigits: 2,
                    }).format(assignment.totalRemaining)}{" "}
                    gal
                  </p>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/admin/trucks/${assignment.truck.id}`}>
                    <Truck className="mr-2 h-4 w-4" />
                    Ver Detalles del Camión
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información del Conductor</CardTitle>
                  <CardDescription>Detalles del conductor asignado</CardDescription>
                </div>
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">
                  {assignment.driver.name} {assignment.driver.lastname}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">DNI</p>
                  <p className="font-medium">{assignment.driver.dni}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge variant="warning">Asignado</Badge>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/admin/users/${assignment.driver.id}`}>
                    <User className="mr-2 h-4 w-4" />
                    Ver Detalles del Conductor
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Estado de la Asignación</CardTitle>
                <CardDescription>
                  {completedCustomers} de {totalCustomers} clientes completados
                </CardDescription>
              </div>
              <ClipboardList className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Progreso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge variant={assignment.isCompleted ? "success" : "warning"} className="mt-1">
                  {assignment.isCompleted ? "Completada" : "En Progreso"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Combustible Despachado</p>
                <p className="font-medium">
                  {new Intl.NumberFormat("es-PE", {
                    minimumFractionDigits: 2,
                  }).format(assignment.totalLoaded - assignment.totalRemaining)}{" "}
                  gal
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes Atendidos</p>
                <p className="font-medium">
                  {completedCustomers}/{totalCustomers}
                </p>
              </div>
            </div>

            {assignment.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notas</p>
                <p className="mt-1 rounded-md border p-2 text-sm">{assignment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="customers">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customers">
              <Building className="mr-2 h-4 w-4" />
              Clientes Asignados
            </TabsTrigger>
            <TabsTrigger value="discharges">
              <Droplet className="mr-2 h-4 w-4" />
              Descargas Realizadas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="customers" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Clientes Asignados</CardTitle>
                <CardDescription>Listado de clientes a visitar en esta asignación</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={customerColumns}
                  data={customers}
                  searchKey="companyname"
                  searchPlaceholder="Buscar por nombre de empresa..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="discharges" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Descargas Realizadas</CardTitle>
                <CardDescription>Registro de todas las descargas de esta asignación</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={dischargeColumns}
                  data={discharges}
                  searchKey="customer.companyname"
                  searchPlaceholder="Buscar por cliente..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AssignmentDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        onSubmit={handleUpdateAssignment}
        assignment={{
          ...assignment,
          truck: { id: assignment.truck.id },
          driver: { id: assignment.driver.id },
        }}
      />
    </AdminLayout>
  )
}
