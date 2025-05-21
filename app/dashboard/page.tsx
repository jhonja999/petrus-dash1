import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Fuel, Users, TrendingUp } from "lucide-react"
import { getDateRange } from "@/lib/date"
import prisma from "@/lib/prisma"

async function getDashboardStats() {
  const { start, end } = getDateRange("day")

  const trucksCount = await prisma.truck.count()
  const activeDrivers = await prisma.user.count({
    where: {
      role: "Conductor",
      state: "Activo",
    },
  })
  const customersCount = await prisma.customer.count()

  const todayAssignments = await prisma.assignment.count({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
  })

  const totalFuelToday = await prisma.discharge.aggregate({
    _sum: {
      totalDischarged: true,
    },
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  })

  return {
    trucksCount,
    activeDrivers,
    customersCount,
    todayAssignments,
    totalFuelToday: totalFuelToday._sum.totalDischarged || 0,
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al sistema de gestión de despachos de combustible</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Camiones</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trucksCount}</div>
            <p className="text-xs text-muted-foreground">Total de camiones registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conductores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDrivers}</div>
            <p className="text-xs text-muted-foreground">Conductores activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Asignaciones</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAssignments}</div>
            <p className="text-xs text-muted-foreground">Asignaciones de hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Combustible</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFuelToday.toString()} gal</div>
            <p className="text-xs text-muted-foreground">Combustible despachado hoy</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trucks">
        <TabsList>
          <TabsTrigger value="trucks">Estado de Camiones</TabsTrigger>
          <TabsTrigger value="assignments">Asignaciones Recientes</TabsTrigger>
          <TabsTrigger value="fuel">Consumo de Combustible</TabsTrigger>
        </TabsList>
        <TabsContent value="trucks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Camiones</CardTitle>
              <CardDescription>Visualización del estado actual de la flota</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md border">
                {/* Truck status visualization would go here */}
                <div className="flex h-full items-center justify-center">Visualización de estado de camiones</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asignaciones Recientes</CardTitle>
              <CardDescription>Últimas asignaciones registradas en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md border">
                {/* Recent assignments would go here */}
                <div className="flex h-full items-center justify-center">Listado de asignaciones recientes</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fuel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumo de Combustible</CardTitle>
              <CardDescription>Análisis de consumo por tipo de combustible</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md border">
                {/* Fuel consumption chart would go here */}
                <div className="flex h-full items-center justify-center">Gráfico de consumo de combustible</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
