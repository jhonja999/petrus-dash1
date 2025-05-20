"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Building, Calendar, MapPin, Phone, Mail, Droplet } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { dischargeColumns } from "./discharge-columns"
import { useToast } from "@/hooks/use-toast"
import { CustomerDialog } from "../customer-dialog"

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const customerId = params.id
  const [customer, setCustomer] = useState(null)
  const [discharges, setDischarges] = useState([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true)
      try {
        // En un entorno real, estas serían llamadas a la API
        const customerResponse = await axios.get(`/api/customers/${customerId}`)
        const dischargesResponse = await axios.get(`/api/discharges?customerId=${customerId}`)

        setCustomer(customerResponse.data)
        setDischarges(dischargesResponse.data)
      } catch (error) {
        console.error("Error fetching customer data:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del cliente",
          variant: "destructive",
        })
        // Datos de ejemplo para desarrollo
        setCustomer({
          id: customerId,
          companyname: "Empresa X",
          ruc: "20123456789",
          address: "Av. Principal 123, Lima",
          contactName: "Juan Pérez",
          contactPhone: "987654321",
          contactEmail: "juan@empresax.com",
          createdAt: "2025-01-15T10:00:00Z",
          updatedAt: "2025-05-10T14:30:00Z",
        })
        setDischarges([
          {
            id: 1,
            createdAt: "2025-05-15T08:00:00Z",
            assignment: {
              id: 1,
              truck: {
                id: 1,
                placa: "ABC123",
              },
              driver: {
                id: 1,
                name: "Carlos",
                lastname: "Ruiz",
              },
              fuelType: "DIESEL B5",
            },
            totalDischarged: 200,
            notes: "Entrega normal",
          },
          {
            id: 2,
            createdAt: "2025-05-18T09:30:00Z",
            assignment: {
              id: 2,
              truck: {
                id: 2,
                placa: "DEF456",
              },
              driver: {
                id: 2,
                name: "María",
                lastname: "López",
              },
              fuelType: "GASOLINA 95",
            },
            totalDischarged: 150,
            notes: "Cliente solicitó verificación de medida",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerData()
  }, [customerId, toast])

  const handleUpdateCustomer = async (customerData) => {
    try {
      const response = await axios.put(`/api/customers/${customerId}`, customerData)
      setCustomer(response.data)
      toast({
        title: "Éxito",
        description: "Cliente actualizado correctamente",
      })
    } catch (error) {
      console.error("Error updating customer:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el cliente",
        variant: "destructive",
      })
      // Para desarrollo, actualizamos el cliente
      setCustomer({ ...customer, ...customerData })
    }
    setEditDialogOpen(false)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p>Cargando datos del cliente...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!customer) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-bold">Cliente no encontrado</h2>
          <p className="text-muted-foreground">El cliente solicitado no existe o no tienes permisos para verlo.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/customers">Volver a Clientes</Link>
          </Button>
        </div>
      </AdminLayout>
    )
  }

  // Calcular estadísticas
  const totalDischarges = discharges.length
  const totalFuel = discharges.reduce((acc, curr) => acc + curr.totalDischarged, 0)
  const lastDischarge = discharges.length > 0 ? discharges[0].createdAt : null

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/customers">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{customer.companyname}</h1>
              <p className="text-muted-foreground">Detalles y gestión del cliente</p>
            </div>
          </div>
          <Button onClick={() => setEditDialogOpen(true)}>Editar Cliente</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información General</CardTitle>
                  <CardDescription>Detalles básicos del cliente</CardDescription>
                </div>
                <Building className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <p className="font-medium">{customer.companyname}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RUC</p>
                  <p className="font-medium">{customer.ruc}</p>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dirección</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Registro</p>
                  <p className="font-medium">{format(new Date(customer.createdAt), "PPP", { locale: es })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última Actualización</p>
                  <p className="font-medium">{format(new Date(customer.updatedAt), "PPP", { locale: es })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información de Contacto</CardTitle>
                  <CardDescription>Datos de la persona de contacto</CardDescription>
                </div>
                <Phone className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{customer.contactName || "No especificado"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{customer.contactPhone || "No especificado"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{customer.contactEmail || "No especificado"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Estadísticas</CardTitle>
                <CardDescription>Resumen de operaciones con este cliente</CardDescription>
              </div>
              <Droplet className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Descargas</p>
                <p className="text-2xl font-bold">{totalDischarges}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Combustible</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("es-PE", {
                    minimumFractionDigits: 2,
                  }).format(totalFuel)}{" "}
                  gal
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Última Descarga</p>
                <p className="text-2xl font-bold">
                  {lastDischarge ? format(new Date(lastDischarge), "dd/MM/yyyy", { locale: es }) : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Historial de Descargas</CardTitle>
                <CardDescription>Registro de todas las descargas realizadas</CardDescription>
              </div>
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={dischargeColumns}
              data={discharges}
              searchKey="assignment.truck.placa"
              searchPlaceholder="Buscar por placa..."
            />
          </CardContent>
        </Card>
      </div>

      <CustomerDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        onSubmit={handleUpdateCustomer}
        customer={customer}
      />
    </AdminLayout>
  )
}
