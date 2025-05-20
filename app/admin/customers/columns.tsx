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

export type Customer = {
  id: number
  companyname: string
  ruc: string
  address: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
}

export const columns = (onEdit: (customer: Customer) => void): ColumnDef<Customer>[] => [
  {
    accessorKey: "companyname",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Empresa
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "ruc",
    header: "RUC",
  },
  {
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => {
      const address = row.getValue("address") as string
      return <div className="truncate max-w-[200px]">{address}</div>
    },
  },
  {
    accessorKey: "contactName",
    header: "Contacto",
    cell: ({ row }) => {
      const contactName = row.getValue("contactName") as string
      return contactName || "N/A"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original

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
              <Link href={`/admin/customers/${customer.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(customer)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id.toString())}>
              Copiar ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
