"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import axios from "axios"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { columns } from "./columns"
import { UserDialog } from "./user-dialog"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        // En un entorno real, esta sería una llamada a la API
        const response = await axios.get("/api/users")
        setUsers(response.data)
      } catch (error) {
        console.error("Error fetching users:", error)
        // Datos de ejemplo para desarrollo
        setUsers([
          {
            id: 1,
            dni: "12345678",
            name: "Juan",
            lastname: "Pérez",
            email: "juan.perez@example.com",
            role: "Conductor",
            state: "Activo",
          },
          {
            id: 2,
            dni: "87654321",
            name: "María",
            lastname: "López",
            email: "maria.lopez@example.com",
            role: "Conductor",
            state: "Asignado",
          },
          {
            id: 3,
            dni: "11223344",
            name: "Carlos",
            lastname: "Ruiz",
            email: "carlos.ruiz@example.com",
            role: "ADMIN",
            state: "Activo",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleCreateUser = async (userData) => {
    try {
      // En un entorno real, esta sería una llamada a la API
      const response = await axios.post("/api/users", userData)
      setUsers([...users, response.data])
    } catch (error) {
      console.error("Error creating user:", error)
      // Para desarrollo, simplemente agregamos el usuario a la lista
      setUsers([...users, { id: users.length + 1, ...userData }])
    }
    setOpen(false)
  }

  const handleUpdateUser = async (userData) => {
    try {
      // En un entorno real, esta sería una llamada a la API
      const response = await axios.put(`/api/users/${userData.id}`, userData)
      setUsers(users.map((user) => (user.id === userData.id ? response.data : user)))
    } catch (error) {
      console.error("Error updating user:", error)
      // Para desarrollo, actualizamos el usuario en la lista
      setUsers(users.map((user) => (user.id === userData.id ? userData : user)))
    }
    setEditingUser(null)
    setOpen(false)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
            <p className="text-muted-foreground">Gestión de usuarios del sistema</p>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        <DataTable
          columns={columns(handleEditUser)}
          data={users}
          searchKey="name"
          searchPlaceholder="Buscar por nombre..."
        />

        <UserDialog
          open={open}
          setOpen={setOpen}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          user={editingUser}
        />
      </div>
    </AdminLayout>
  )
}
