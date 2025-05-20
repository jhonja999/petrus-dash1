"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export type Assignment = {
  id: number
  createdAt: string
  truck: {
    id: number
    placa: string
  }
  driver: {
    id: number
    name: string
    lastname: string
  }
  totalLoaded: number
  totalRemaining: number
  fuelType: string
  isCompleted: boolean
}

export const columns = (onEdit: (assignment: Assignment) => void): ColumnDef<Assignment>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Fecha
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return format(date, "PPP", { locale: es })
    },
  },
  {
    accessorKey: "truck.placa",
    header: "Placa",
    cell: ({ row }) => {
      const assignment = row.original
      return assignment.truck.placa
    },
  },
  {
    accessorKey: "driver",
    header: "Conductor",
    cell: ({ row }) => {
      const assignment = row.original
      return `${assignment.driver.name} ${assignment.driver.lastname}`
    },
  },
  {
    accessorKey: "fuelType",
    header: "Combustible",
  },
  {
    accessorKey: "totalLoaded",
    header: "Carga (gal)",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalLoaded"))
      const formatted = new Intl.NumberFormat("es-PE", {
        minimumFractionDigits: 2,
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "isCompleted",
    header: "Estado",
    cell: ({ row }) => {
      const isCompleted = row.getValue("isCompleted") as boolean
      return <Badge variant={isCompleted ? "success" : "warning"}>{isCompleted ? "Completada" : "En Progreso"}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const assignment = row.original

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
            <DropdownMenuItem asChild>
              <Link href={`/admin/assignments/${assignment.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(assignment)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(assignment.id.toString())}>
              Copiar ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
