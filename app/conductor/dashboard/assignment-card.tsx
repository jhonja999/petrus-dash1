import Link from "next/link"
import { CheckCircle, MapPin, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AssignmentCard({ assignment }) {
  const { id, truck, totalLoaded, totalRemaining, fuelType, customers } = assignment

  const completedCustomers = customers.filter((c) => c.discharged).length
  const totalCustomers = customers.length
  const progress = totalCustomers > 0 ? (completedCustomers / totalCustomers) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{truck.placa}</CardTitle>
            <CardDescription>{fuelType}</CardDescription>
          </div>
          <Badge variant={truck.state === "Activo" ? "success" : "warning"}>{truck.state}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Carga Total</p>
            <p className="font-medium">{totalLoaded} gal</p>
          </div>
          <div>
            <p className="text-muted-foreground">Restante</p>
            <p className="font-medium">{totalRemaining} gal</p>
          </div>
          <div>
            <p className="text-muted-foreground">Clientes</p>
            <p className="font-medium">
              {completedCustomers}/{totalCustomers}
            </p>
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Clientes a visitar</h4>
          {customers.map((customer) => (
            <div key={customer.id} className="flex items-start justify-between rounded-md border p-2">
              <div className="flex-1">
                <p className="font-medium">{customer.companyname}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3" />
                  {customer.address}
                </div>
              </div>
              {customer.discharged ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/conductor/assignments/${id}/discharge/${customer.id}`}>Registrar</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/conductor/assignments/${id}`}>
            <Truck className="mr-2 h-4 w-4" />
            Ver Detalles
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
