"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import axios from "axios"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { columns } from "./columns"
import { TruckDialog } from "./truck-dialog"
import { useToast } from "@/hooks/use-toast"

export default function TrucksPage() {
  const [trucks, setTrucks] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingTruck, setEditingTruck] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTrucks = async () => {
      setLoading(true)
      try {
        const response = await axios.get("/api/trucks")
        setTrucks(response.data)
      } catch (error) {
        console.error("Error fetching trucks:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los camiones",
          variant: "destructive",
        })
        // Datos de ejemplo para desarrollo
        setTrucks([
          {
            id: 1,
            placa: "ABC123",
            typefuel: "DIESEL B5",
            capacitygal: 1000,
            state: "Activo",
          },
          {
            id: 2,
            placa: "DEF456",
            typefuel: "GASOLINA 95",
            capacitygal: 800,
            state: "Mantenimiento",
          },
          {
            id: 3,
            placa: "GHI789",
            typefuel: "DIESEL B5",
            capacitygal: 1200,
            state: "Asignado",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTrucks()
  }, [toast])

  const handleCreateTruck = async (truckData) => {
    try {
      const response = await axios.post("/api/trucks", truckData)
      setTrucks([...trucks, response.data])
      toast({
        title: "Éxito",
        description: "Camión creado correctamente",
      })
    } catch (error) {
      console.error("Error creating truck:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el camión",
        variant: "destructive",
      })
      // Para desarrollo, simplemente agregamos el camión a la lista
      setTrucks([...trucks, { id: trucks.length + 1, ...truckData }])
    }
    setOpen(false)
  }

  const handleUpdateTruck = async (truckData) => {
    try {
      const response = await axios.put(`/api/trucks/${truckData.id}`, truckData)
      setTrucks(trucks.map((truck) => (truck.id === truckData.id ? response.data : truck)))
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
      // Para desarrollo, actualizamos el camión en la lista
      setTrucks(trucks.map((truck) => (truck.id === truckData.id ? truckData : truck)))
    }
    setEditingTruck(null)
    setOpen(false)
  }

  const handleEditTruck = (truck) => {
    setEditingTruck(truck)
    setOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Camiones</h1>
            <p className="text-muted-foreground">Gestión de camiones del sistema</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Camión
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns(handleEditTruck)}
          data={trucks}
          searchKey="placa"
          searchPlaceholder="Buscar por placa..."
        />

        <TruckDialog
          open={open}
          setOpen={setOpen}
          onSubmit={editingTruck ? handleUpdateTruck : handleCreateTruck}
          truck={editingTruck}
        />
      </div>
    </AdminLayout>
  )
}
