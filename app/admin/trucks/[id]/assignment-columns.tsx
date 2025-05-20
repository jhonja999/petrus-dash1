"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type Assignment = {
  id: number
  createdAt: string
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

export const assignmentColumns: ColumnDef<Assignment>[] = [
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
    accessorKey: "driver",
    header: "Conductor",
    cell: ({ row }) => {
      const driver = row.getValue("driver") as Assignment["driver"]
      return `${driver.name} ${driver.lastname}`
    },
  },
  {
    accessorKey: "totalLoaded",
    header: "Carga Total (gal)",
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
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/assignments/${assignment.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalles
          </Link>
        </Button>
      )
    },
  },
]
