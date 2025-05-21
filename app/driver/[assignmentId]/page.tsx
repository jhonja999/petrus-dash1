import { notFound } from "next/navigation"
import Link from "next/link"
import { Truck, MapPin, Fuel, ArrowRight, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { getAuth } from "@/lib/auth"
import { clerkClient } from "@clerk/nextjs"
import { FUEL_TYPES } from "@/lib/constants"

async function getAssignment(id: number) {
  const userId = getAuth()
  const user = await clerkClient.users.getUser(userId)

  // Get the Prisma user ID from the Clerk user metadata
  const userRecord = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!userRecord) {
    notFound()
  }

  const assignment = await prisma.assignment.findUnique({
    where: {
      id,
      driverId: userRecord.id,
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

export default async function DriverAssignmentPage({
  params,
}: {
  params: { assignmentId: string }
}) {
  const id = Number.parseInt(params.assignmentId)
  const assignment = await getAssignment(id)

  // Calculate total discharged
  const totalDischarged = assignment.discharges.reduce((sum, discharge) => sum + Number(discharge.totalDischarged), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Asignación #{id}</h1>
          <p className="text-muted-foreground">Gestiona las descargas de combustible para esta asignación</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/driver">Volver</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Información del Camión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="outline" className="text-lg">
              {assignment.truck.placa}
            </Badge>
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              <span>{FUEL_TYPES[assignment.fuelType]}</span>
            </div>
            <Badge>{assignment.truck.state}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Información de la Carga
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1 rounded-lg border p-3">
              <dt className="text-sm font-medium text-muted-foreground">Carga Total</dt>
              <dd className="text-lg font-semibold">{assignment.totalLoaded.toString()} gal</dd>
            </div>
            <div className="space-y-1 rounded-lg border p-3">
              <dt className="text-sm font-medium text-muted-foreground">Descargado</dt>
              <dd className="text-lg font-semibold">{totalDischarged.toString()} gal</dd>
            </div>
            <div className="space-y-1 rounded-lg border p-3">
              <dt className="text-sm font-medium text-muted-foreground">Restante</dt>
              <dd className="text-lg font-semibold">{assignment.totalRemaining.toString()} gal</dd>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Clientes a Visitar</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {assignment.discharges.map((discharge) => (
            <Card key={discharge.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-2">
                <CardTitle className="text-lg">{discharge.customer.companyname}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {discharge.customer.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">RUC:</span>
                    <span>{discharge.customer.ruc}</span>
                  </div>

                  {Number(discharge.totalDischarged) > 0 ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Marcador Inicial:</span>
                        <span>{discharge.startMarker.toString()} gal</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Marcador Final:</span>
                        <span>{discharge.endMarker.toString()} gal</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Descargado:</span>
                        <span className="font-semibold">{discharge.totalDischarged.toString()} gal</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Descarga Completada</span>
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 flex items-center gap-2 text-amber-600">
                      <XCircle className="h-5 w-5" />
                      <span className="font-medium">Pendiente de Descarga</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 px-4 py-3">
                {Number(discharge.totalDischarged) > 0 ? (
                  <Button variant="outline" className="w-full" disabled>
                    Descarga Completada
                  </Button>
                ) : (
                  <Button asChild className="w-full">
                    <Link href={`/driver/${assignment.id}/discharge?customerId=${discharge.customerId}`}>
                      Registrar Descarga
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
