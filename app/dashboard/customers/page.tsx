import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from "@/lib/prisma"

async function getCustomers() {
  return await prisma.customer.findMany({
    orderBy: {
      companyname: "asc",
    },
  })
}

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gestiona los clientes para despachos de combustible</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/customers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>RUC</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.companyname}</TableCell>
                <TableCell>{customer.ruc}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>
                  {customer.contactName ? (
                    <div>
                      <div>{customer.contactName}</div>
                      <div className="text-xs text-muted-foreground">{customer.contactEmail}</div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Sin contacto</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/customers/${customer.id}/edit`}>Editar</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No hay clientes registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
