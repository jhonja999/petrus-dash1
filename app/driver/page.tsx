import Link from "next/link"
import { MapPin, Fuel, ArrowRight, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"
import { getAuth } from "@/lib/auth"
import { clerkClient } from "@clerk/nextjs"
import { getDateRange } from "@/lib/date"
import { FUEL_TYPES } from "@/lib/constants"

async function getDriverAssignments() {
  const userId = getAuth()
  const user = await clerkClient.users.getUser(userId)

  // Get the Prisma user ID from the Clerk user metadata
  const userRecord = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!userRecord) {
    return { assignments: [], activeTruck: null }
  }

  const { start, end } = getDateRange("day")

  // Get today's assignments for this driver
  const assignments = await prisma.assignment.findMany({
    where: {
      driverId: userRecord.id,
      date: {
        gte: start,
        lte: end,
      },
      isCompleted: false,
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
      date: "asc",
    },
  })

  // Get the active truck for this driver
  const activeTruck = await prisma.truck.findFirst({
    where: {
      Assignment: {
        some: {
          driverId: userRecord.id,
          isCompleted: false,
        },
      },
      state: {
        in: ["Asignado", "Transito", "Descarga"],
      },
    },
  })

  return { assignments, activeTruck }
}

export default async function DriverDashboardPage() {
  const { assignments, activeTruck } = await getDriverAssignments()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Conductor</h1>
        <p className="text-muted-foreground">Gestiona tus asignaciones y descargas de combustible</p>
      </div>

      {!activeTruck && assignments.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No tienes asignaciones activas</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No tienes ningún camión asignado o asignaciones pendientes para hoy.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/driver/select-truck">Seleccionar un Camión</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          {activeTruck && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Camión Activo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="outline" className="text-lg">
                    {activeTruck.placa}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span>{FUEL_TYPES[activeTruck.typefuel]}</span>
                  </div>
                  <Badge>{activeTruck.state}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Asignaciones de Hoy</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-2">
                    <CardTitle className="text-lg">Asignación #{assignment.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Combustible:</span>
                        <span>{FUEL_TYPES[assignment.fuelType]}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Carga:</span>
                        <span>{assignment.totalLoaded.toString()} gal</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Restante:</span>
                        <span>{assignment.totalRemaining.toString()} gal</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Clientes:</span>
                        <span>{assignment.discharges.length}</span>
                      </div>

                      <div className="space-y-2 pt-2">
                        <h4 className="text-sm font-medium">Clientes a visitar:</h4>
                        <ul className="space-y-2">
                          {assignment.discharges.slice(0, 3).map((discharge) => (
                            <li key={discharge.id} className="flex items-start gap-2 text-sm">
                              <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                              <span className="flex-1 truncate">{discharge.customer.companyname}</span>
                              {Number(discharge.totalDischarged) > 0 ? (
                                <Badge variant="success" className="ml-auto shrink-0">
                                  Completado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="ml-auto shrink-0">
                                  Pendiente
                                </Badge>
                              )}
                            </li>
                          ))}
                          {assignment.discharges.length > 3 && (
                            <li className="text-sm text-muted-foreground">
                              + {assignment.discharges.length - 3} más...
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 px-4 py-3">
                    <Button asChild className="w-full">
                      <Link href={`/driver/${assignment.id}`}>
                        Ver Detalles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {assignments.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Fuel className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No hay asignaciones pendientes</h3>
                    <p className="mt-2 text-sm text-muted-foreground">No tienes asignaciones pendientes para hoy.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )
}
