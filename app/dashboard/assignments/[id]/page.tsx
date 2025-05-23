import Link from "next/link"
import { notFound } from "next/navigation"
import { Truck, User, MapPin, Fuel, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import prisma from "@/lib/prisma"
import { formatDate, formatDateTime } from "@/lib/date"
import { FUEL_TYPES } from "@/lib/constants"

async function getAssignment(id: number) {
  if (!id || isNaN(id)) {
    notFound()
  }

  const assignment = await prisma.assignment.findUnique({
    where: {
      id: id,
    },
    include: {
      truck: true,
      driver: true,
      discharges: {
        include: {
          customer: true,
        },
      },
    },
  })

  if (!assignment) {
    notFound()
  }

  return assignment
}

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Await params before accessing its properties (Next.js 15 requirement)
  const { id: idParam } = await params
  const id = Number.parseInt(idParam)

  if (isNaN(id)) {
    notFound()
  }

  const assignment = await getAssignment(id)

  // Calculate total discharged
  const totalDischarged = assignment.discharges.reduce((sum, discharge) => sum + Number(discharge.totalDischarged), 0)

  // Get customers that have not been discharged yet
  const pendingCustomers = await prisma.customer.findMany({
    where: {
      id: {
        in: assignment.discharges.filter((d) => Number(d.totalDischarged) === 0).map((d) => d.customerId),
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Detalle de Asignación</h1>
          <p className="text-muted-foreground">Información completa de la asignación #{id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/assignments">Volver</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Información del Camión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Placa:</dt>
                <dd>{assignment.truck.placa}</dd>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Tipo de Combustible:</dt>
                <dd>{FUEL_TYPES[assignment.fuelType as keyof typeof FUEL_TYPES]}</dd>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Capacidad:</dt>
                <dd>{assignment.truck.capacitygal.toString()} gal</dd>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Estado:</dt>
                <dd>
                  <Badge>{assignment.truck.state}</Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Conductor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Nombre:</dt>
                <dd>
                  {assignment.driver.name} {assignment.driver.lastname}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">DNI:</dt>
                <dd>{assignment.driver.dni}</dd>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium">Email:</dt>
                <dd>{assignment.driver.email}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Información de la Asignación
          </CardTitle>
          <CardDescription>Creada el {formatDateTime(assignment.createdAt)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1 rounded-lg border p-3">
                <dt className="text-sm font-medium text-muted-foreground">Fecha</dt>
                <dd className="text-lg font-semibold">{formatDate(assignment.date)}</dd>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <dt className="text-sm font-medium text-muted-foreground">Carga Total</dt>
                <dd className="text-lg font-semibold">{assignment.totalLoaded.toString()} gal</dd>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <dt className="text-sm font-medium text-muted-foreground">Restante</dt>
                <dd className="text-lg font-semibold">{assignment.totalRemaining.toString()} gal</dd>
              </div>
            </dl>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Estado de la Asignación</h3>
              <div className="flex items-center gap-2">
                <Badge variant={assignment.isCompleted ? "success" : "secondary"} className="px-3 py-1 text-sm">
                  {assignment.isCompleted ? "Completado" : "En Progreso"}
                </Badge>
                {assignment.notes && <p className="text-sm text-muted-foreground">Notas: {assignment.notes}</p>}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Descargas por Cliente</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Marcador Inicial</TableHead>
                    <TableHead>Marcador Final</TableHead>
                    <TableHead>Total Descargado</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignment.discharges.map((discharge) => (
                    <TableRow key={discharge.id}>
                      <TableCell className="font-medium">{discharge.customer.companyname}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="text-sm">{discharge.customer.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {Number(discharge.startMarker) > 0 ? discharge.startMarker.toString() : "-"}
                      </TableCell>
                      <TableCell>{Number(discharge.endMarker) > 0 ? discharge.endMarker.toString() : "-"}</TableCell>
                      <TableCell>
                        {Number(discharge.totalDischarged) > 0 ? `${discharge.totalDischarged.toString()} gal` : "-"}
                      </TableCell>
                      <TableCell>
                        {Number(discharge.totalDischarged) > 0 ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completado</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-600">
                            <XCircle className="h-4 w-4" />
                            <span>Pendiente</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {assignment.discharges.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No hay descargas registradas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
