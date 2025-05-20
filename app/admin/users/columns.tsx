"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export type User = {
  id: number
  dni: string
  name: string
  lastname: string
  email: string
  role: string
  state: string
}

export const columns = (onEdit: (user: User) => void): ColumnDef<User>[] => [
  {
    accessorKey: "dni",
    header: "DNI",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Nombre
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "lastname",
    header: "Apellido",
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return <Badge variant={role === "ADMIN" ? "default" : "outline"}>{role}</Badge>
    },
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      const state = row.getValue("state") as string
      return (
        <Badge variant={state === "Activo" ? "success" : state === "Asignado" ? "warning" : "destructive"}>
          {state}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(user)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id.toString())}>
              Copiar ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
