"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Discharge = {
  id: number
  date: string
  truckPlaca: string
  driverName: string
  customer: string
  fuelType: string
  totalDischarged: number
}

export const columns: ColumnDef<Discharge>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Fecha
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return format(date, "dd/MM/yyyy HH:mm", { locale: es })
    },
  },
  {
    accessorKey: "truckPlaca",
    header: "Placa",
  },
  {
    accessorKey: "customer",
    header: "Cliente",
  },
  {
    accessorKey: "totalDischarged",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Galones
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalDischarged"))
      const formatted = new Intl.NumberFormat("es-PE", {
        minimumFractionDigits: 2,
      }).format(amount)
      return formatted
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const discharge = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(discharge.id.toString())}>
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
