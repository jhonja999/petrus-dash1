import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"
import { USER_STATES, type UserState } from "@/lib/constants"

async function getDrivers() {
  return await prisma.user.findMany({
    where: {
      role: "Conductor",
    },
    orderBy: {
      name: "asc",
    },
  })
}

export default async function UsersPage() {
  const drivers = await getDrivers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Conductores</h1>
          <p className="text-muted-foreground">Gestiona los conductores del sistema</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/users/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Conductor
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DNI</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.dni}</TableCell>
                <TableCell className="font-medium">
                  {driver.name} {driver.lastname}
                </TableCell>
                <TableCell>{driver.email}</TableCell>
                <TableCell>
                  <UserStatusBadge status={driver.state} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/users/${driver.id}/edit`}>Editar</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {drivers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No hay conductores registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function UserStatusBadge({ status }: { status: string }) {
  const getVariant = () => {
    switch (status) {
      case "Activo":
        return "success"
      case "Inactivo":
        return "secondary"
      case "Suspendido":
        return "warning"
      case "Eliminado":
        return "destructive"
      case "Asignado":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <Badge variant={getVariant() as any} className="whitespace-nowrap">
      {USER_STATES[status as UserState] || status}
    </Badge>
  )
}
