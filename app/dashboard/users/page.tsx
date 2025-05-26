"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, User, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ROLES, USER_STATES } from "@/lib/constants"
import { fetchUsers } from "@/lib/api"
import type { User as UserType } from "@/types"

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [stateFilter, setStateFilter] = useState<string | null>(null)

  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true)
      try {
        const data = await fetchUsers(roleFilter, stateFilter)
        setUsers(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error loading users:", error)
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [roleFilter, stateFilter])

  const getRoleLabel = (role: string): string => {
    return ROLES[role as keyof typeof ROLES] || role
  }

  const getStateLabel = (state: string): string => {
    return USER_STATES[state as keyof typeof USER_STATES] || state
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">Gestiona los usuarios del sistema</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrar por rol</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setRoleFilter(null)}>Todos</DropdownMenuItem>
                {Object.entries(ROLES).map(([value, label]) => (
                  <DropdownMenuItem key={value} onSelect={() => setRoleFilter(value)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setStateFilter(null)}>Todos</DropdownMenuItem>
                {Object.entries(USER_STATES).map(([value, label]) => (
                  <DropdownMenuItem key={value} onSelect={() => setStateFilter(value)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild>
            <Link href="/dashboard/users/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Lista de Usuarios
            {roleFilter && (
              <Badge variant="outline" className="ml-2">
                Rol: {getRoleLabel(roleFilter)}
              </Badge>
            )}
            {stateFilter && (
              <Badge variant="outline" className="ml-2">
                Estado: {getStateLabel(stateFilter)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <p>Cargando usuarios...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DNI</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Licencia</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No hay usuarios registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.dni || "N/A"}</TableCell>
                      <TableCell className="font-medium">
                        {user.name} {user.lastname}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleLabel(user.role)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getStateLabel(user.state)}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.licenseNumber ? (
                          <div className="text-sm">
                            <div>{user.licenseNumber}</div>
                            <div className="text-muted-foreground">{user.licenseType}</div>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/users/${user.id}/edit`}>Editar</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
