"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Truck, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { TRUCK_STATES, FUEL_TYPES } from "@/lib/constants"
import { fetchTrucks } from "@/lib/api"

export default function TrucksPage() {
  const [trucks, setTrucks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    async function loadTrucks() {
      setIsLoading(true)
      try {
        const data = await fetchTrucks(filter)
        setTrucks(data)
      } catch (error) {
        console.error("Error loading trucks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTrucks()
  }, [filter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Camiones</h1>
          <p className="text-muted-foreground">Gestiona los camiones de la flota</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setFilter(null)}>Todos</DropdownMenuItem>
                {Object.entries(TRUCK_STATES).map(([value, label]) => (
                  <DropdownMenuItem key={value} onSelect={() => setFilter(value)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild>
            <Link href="/dashboard/trucks/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Camión
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Lista de Camiones
            {filter && (
              <Badge variant="outline" className="ml-2">
                Filtro: {TRUCK_STATES[filter as keyof typeof TRUCK_STATES]}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <p>Cargando camiones...</p>
            </div>
          ) : (
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
                {trucks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No hay camiones registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  trucks.map((truck) => (
                    <TableRow key={truck.id}>
                      <TableCell className="font-medium">{truck.placa}</TableCell>
                      <TableCell>{FUEL_TYPES[truck.typefuel as keyof typeof FUEL_TYPES]}</TableCell>
                      <TableCell>{truck.capacitygal}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{truck.state}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/trucks/${truck.id}/edit`}>Editar</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
