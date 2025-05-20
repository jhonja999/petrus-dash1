"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"

export type Discharge = {
  id: number
  createdAt: string
  customer: {
    id: number
    companyname: string
    address: string
  }
  totalDischarged: number
  notes?: string
}

export const dischargeColumns: ColumnDef<Discharge>[] = [
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
      return format(date, "PPP p", { locale: es })
    },
  },
  {
    accessorKey: "customer.companyname",
    header: "Cliente",
    cell: ({ row }) => {
      const discharge = row.original
      return discharge.customer.companyname
    },
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
    accessorKey: "notes",
    header: "Notas",
    cell: ({ row }) => {
      const notes = row.getValue("notes")
      return notes || "-"
    },
  },
]
