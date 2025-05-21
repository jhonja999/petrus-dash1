import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Truck, Fuel } from "lucide-react"
import prisma from "@/lib/prisma"
import { getAuth } from "@/lib/auth"
import { clerkClient } from "@clerk/nextjs"
import { formatDate } from "@/lib/date"
import { FUEL_TYPES } from "@/lib/constants"

async function getDriverHistory() {
  const userId = getAuth()
  const user = await clerkClient.users.getUser(userId)

  // Get the Prisma user ID from the Clerk user metadata
  const userRecord = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!userRecord) {
    return []
  }

  // Get completed assignments for this driver
  const assignments = await prisma.assignment.findMany({
    where: {
      driverId: userRecord.id,
      isCompleted: true,
    },
    include: {
      truck: true,
      discharges: {
        include: {
          customer: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
    take: 20, // Limit to last 20 assignments
  })

  return assignments
}

export default async function DriverHistoryPage() {
  const assignments = await getDriverHistory()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Historial de Jornadas</h1>
        <p className="text-muted-foreground">Revisa tus jornadas completadas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Jornadas Completadas
          </CardTitle>
          <CardDescription>Últimas jornadas finalizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Camión</TableHead>
                <TableHead>Combustible</TableHead>
                <TableHead>Clientes</TableHead>
                <TableHead>Total Descargado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                // Calculate total discharged
                const totalDischarged = assignment.discharges.reduce(
                  (sum, discharge) => sum + Number(discharge.totalDischarged),
                  0,
                )

                return (
                  <TableRow key={assignment.id}>
                    <TableCell>{formatDate(assignment.date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.truck.placa}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        <span>{FUEL_TYPES[assignment.fuelType]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{assignment.discharges.length} clientes</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">{totalDischarged.toString()} gal</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
              {assignments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No hay jornadas completadas en tu historial
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {assignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Descargas</CardTitle>
            <CardDescription>Descargas realizadas por cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {assignments.slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="space-y-2">
                  <h3 className="font-medium">
                    Jornada del {formatDate(assignment.date)} - {assignment.truck.placa}
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Dirección</TableHead>
                          <TableHead>Marcador Inicial</TableHead>
                          <TableHead>Marcador Final</TableHead>
                          <TableHead>Total Descargado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignment.discharges.map((discharge) => (
                          <TableRow key={discharge.id}>
                            <TableCell className="font-medium">{discharge.customer.companyname}</TableCell>
                            <TableCell className="text-sm">{discharge.customer.address}</TableCell>
                            <TableCell>{discharge.startMarker.toString()}</TableCell>
                            <TableCell>{discharge.endMarker.toString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{discharge.totalDischarged.toString()} gal</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
