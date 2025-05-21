import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"
import { formatDate } from "@/lib/date"
import { FUEL_TYPES } from "@/lib/constants"

async function getAssignments() {
  return await prisma.assignment.findMany({
    include: {
      truck: true,
      driver: true,
      discharges: {
        include: {
          customer: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  })
}

export default async function AssignmentsPage() {
  const assignments = await getAssignments()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Asignaciones</h1>
          <p className="text-muted-foreground">Gestiona las asignaciones de camiones y conductores</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/assignments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Asignación
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Camión</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead>Combustible</TableHead>
              <TableHead>Clientes</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{formatDate(assignment.date)}</TableCell>
                <TableCell>{assignment.truck.placa}</TableCell>
                <TableCell>
                  {assignment.driver.name} {assignment.driver.lastname}
                </TableCell>
                <TableCell>{FUEL_TYPES[assignment.fuelType]}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">{assignment.discharges.length} clientes</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={assignment.isCompleted ? "success" : "secondary"}>
                    {assignment.isCompleted ? "Completado" : "En Progreso"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/assignments/${assignment.id}`}>Ver</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {assignments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No hay asignaciones registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
