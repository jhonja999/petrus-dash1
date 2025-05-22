import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"
import { FUEL_TYPES, TRUCK_STATES, type FuelType, type TruckState } from "@/lib/constants"

async function getTrucks() {
  return await prisma.truck.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  })
}

export default async function TrucksPage() {
  const trucks = await getTrucks()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Camiones</h1>
          <p className="text-muted-foreground">Gestiona los camiones de la flota</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/trucks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Camión
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Tipo de Combustible</TableHead>
              <TableHead>Capacidad (gal)</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trucks.map((truck) => (
              <TableRow key={truck.id}>
                <TableCell className="font-medium">{truck.placa}</TableCell>
                <TableCell>{FUEL_TYPES[truck.typefuel as FuelType]}</TableCell>
                <TableCell>{truck.capacitygal.toString()}</TableCell>
                <TableCell>
                  <TruckStatusBadge status={truck.state} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/trucks/${truck.id}/edit`}>Editar</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/trucks/status?id=${truck.id}`}>Cambiar Estado</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {trucks.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No hay camiones registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function TruckStatusBadge({ status }: { status: string }) {
  const getVariant = () => {
    switch (status) {
      case "Activo":
        return "success"
      case "Inactivo":
        return "destructive"
      case "Mantenimiento":
        return "warning"
      case "Transito":
        return "info"
      case "Descarga":
        return "secondary"
      case "Asignado":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <Badge variant={getVariant() as any} className="whitespace-nowrap">
      {TRUCK_STATES[status as TruckState] || status}
    </Badge>
  )
}
