"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export type Discharge = {
  id: number
  createdAt: string
  assignment: {
    id: number
    truck: {
      id: number
      placa: string
    }
    driver: {
      id: number
      name: string
      lastname: string
    }
    fuelType: string
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
      return format(date, "PPP", { locale: es })
    },
  },
  {
    accessorKey: "assignment.truck.placa",
    header: "Placa",
    cell: ({ row }) => {
      const assignment = row.original.assignment
      return assignment.truck.placa
    },
  },
  {
    accessorKey: "assignment.driver",
    header: "Conductor",
    cell: ({ row }) => {
      const assignment = row.original.assignment
      return `${assignment.driver.name} ${assignment.driver.lastname}`
    },
  },
  {
    accessorKey: "assignment.fuelType",
    header: "Tipo Combustible",
    cell: ({ row }) => {
      const assignment = row.original.assignment
      return assignment.fuelType
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
    id: "actions",
    cell: ({ row }) => {
      const discharge = row.original

      return (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/assignments/${discharge.assignment.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Asignación
          </Link>
        </Button>
      )
    },
  },
]
