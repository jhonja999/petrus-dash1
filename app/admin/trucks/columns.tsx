"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react"
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

export type Truck = {
  id: number
  placa: string
  typefuel: string
  capacitygal: number
  state: string
}

export const columns = (onEdit: (truck: Truck) => void): ColumnDef<Truck>[] => [
  {
    accessorKey: "placa",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Placa
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "typefuel",
    header: "Tipo de Combustible",
  },
  {
    accessorKey: "capacitygal",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Capacidad (gal)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const capacity = Number.parseFloat(row.getValue("capacitygal"))
      const formatted = new Intl.NumberFormat("es-PE", {
        minimumFractionDigits: 2,
      }).format(capacity)
      return formatted
    },
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      const state = row.getValue("state") as string
      return (
        <Badge
          variant={
            state === "Activo"
              ? "success"
              : state === "Asignado"
                ? "warning"
                : state === "Mantenimiento"
                  ? "destructive"
                  : "outline"
          }
        >
          {state}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const truck = row.original

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
              <Link href={`/admin/trucks/${truck.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(truck)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(truck.id.toString())}>
              Copiar ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
