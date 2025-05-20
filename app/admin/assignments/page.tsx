"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import axios from "axios"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { columns } from "./columns"
import { AssignmentDialog } from "./assignment-dialog"
import { useToast } from "@/hooks/use-toast"

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true)
      try {
        const response = await axios.get("/api/assignments")
        setAssignments(response.data)
      } catch (error) {
        console.error("Error fetching assignments:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las asignaciones",
          variant: "destructive",
        })
        // Datos de ejemplo para desarrollo
        setAssignments([
          {
            id: 1,
            createdAt: "2025-05-15T08:00:00Z",
            truck: {
              id: 1,
              placa: "ABC123",
            },
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
            truck: {
              id: 2,
              placa: "DEF456",
            },
            driver: {
              id: 2,
              name: "María",
              lastname: "López",
            },
            totalLoaded: 1000,
            totalRemaining: 1000,
            fuelType: "GASOLINA 95",
            isCompleted: false,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [toast])

  const handleCreateAssignment = async (assignmentData) => {
    try {
      const response = await axios.post("/api/assignments", assignmentData)
      setAssignments([...assignments, response.data])
      toast({
        title: "Éxito",
        description: "Asignación creada correctamente",
      })
    } catch (error) {
      console.error("Error creating assignment:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la asignación",
        variant: "destructive",
      })
      // Para desarrollo, simplemente agregamos la asignación a la lista
      setAssignments([...assignments, { id: assignments.length + 1, ...assignmentData }])
    }
    setOpen(false)
  }

  const handleUpdateAssignment = async (assignmentData) => {
    try {
      const response = await axios.put(`/api/assignments/${assignmentData.id}`, assignmentData)
      setAssignments(
        assignments.map((assignment) => (assignment.id === assignmentData.id ? response.data : assignment)),
      )
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
      // Para desarrollo, actualizamos la asignación en la lista
      setAssignments(
        assignments.map((assignment) => (assignment.id === assignmentData.id ? assignmentData : assignment)),
      )
    }
    setEditingAssignment(null)
    setOpen(false)
  }

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment)
    setOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asignaciones</h1>
            <p className="text-muted-foreground">Gestión de asignaciones de camiones y conductores</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Asignación
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns(handleEditAssignment)}
          data={assignments}
          searchKey="truck.placa"
          searchPlaceholder="Buscar por placa..."
        />

        <AssignmentDialog
          open={open}
          setOpen={setOpen}
          onSubmit={editingAssignment ? handleUpdateAssignment : handleCreateAssignment}
          assignment={editingAssignment}
        />
      </div>
    </AdminLayout>
  )
}
