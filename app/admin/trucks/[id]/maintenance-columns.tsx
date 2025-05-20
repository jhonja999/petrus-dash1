"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type Maintenance = {
  id: number
  description: string
  startDate: string
  endDate: string
  status: string
  cost: number
}

export const maintenanceColumns: ColumnDef<Maintenance>[] = [
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Fecha Inicio
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"))
      return format(date, "PPP", { locale: es })
    },
  },
  {
    accessorKey: "endDate",
    header: "Fecha Fin",
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"))
      return format(date, "PPP", { locale: es })
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "cost",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Costo (S/)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("cost"))
      const formatted = new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "Completado" ? "success" : status === "En Progreso" ? "warning" : "destructive"}>
          {status}
        </Badge>
      )
    },
  },
]
