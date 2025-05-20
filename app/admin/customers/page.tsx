"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import axios from "axios"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { columns } from "./columns"
import { CustomerDialog } from "./customer-dialog"
import { useToast } from "@/hooks/use-toast"

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const response = await axios.get("/api/customers")
        setCustomers(response.data)
      } catch (error) {
        console.error("Error fetching customers:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los clientes",
          variant: "destructive",
        })
        // Datos de ejemplo para desarrollo
        setCustomers([
          {
            id: 1,
            companyname: "Empresa X",
            ruc: "20123456789",
            address: "Av. Principal 123, Lima",
            contactName: "Juan Pérez",
            contactPhone: "987654321",
            contactEmail: "juan@empresax.com",
          },
          {
            id: 2,
            companyname: "Empresa Y",
            ruc: "20987654321",
            address: "Jr. Secundario 456, Lima",
            contactName: "María López",
            contactPhone: "987123456",
            contactEmail: "maria@empresay.com",
          },
          {
            id: 3,
            companyname: "Empresa Z",
            ruc: "20456789123",
            address: "Calle Terciaria 789, Lima",
            contactName: "Carlos Ruiz",
            contactPhone: "912345678",
            contactEmail: "carlos@empresaz.com",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [toast])

  const handleCreateCustomer = async (customerData) => {
    try {
      const response = await axios.post("/api/customers", customerData)
      setCustomers([...customers, response.data])
      toast({
        title: "Éxito",
        description: "Cliente creado correctamente",
      })
    } catch (error) {
      console.error("Error creating customer:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el cliente",
        variant: "destructive",
      })
      // Para desarrollo, simplemente agregamos el cliente a la lista
      setCustomers([...customers, { id: customers.length + 1, ...customerData }])
    }
    setOpen(false)
  }

  const handleUpdateCustomer = async (customerData) => {
    try {
      const response = await axios.put(`/api/customers/${customerData.id}`, customerData)
      setCustomers(customers.map((customer) => (customer.id === customerData.id ? response.data : customer)))
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
      // Para desarrollo, actualizamos el cliente en la lista
      setCustomers(customers.map((customer) => (customer.id === customerData.id ? customerData : customer)))
    }
    setEditingCustomer(null)
    setOpen(false)
  }

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer)
    setOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground">Gestión de clientes del sistema</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns(handleEditCustomer)}
          data={customers}
          searchKey="companyname"
          searchPlaceholder="Buscar por nombre de empresa..."
        />

        <CustomerDialog
          open={open}
          setOpen={setOpen}
          onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
          customer={editingCustomer}
        />
      </div>
    </AdminLayout>
  )
}
