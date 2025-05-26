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
import { FUEL_TYPES, TRUCK_STATES } from "@/lib/constants"
import { fetchTrucks } from "@/lib/api"
import type { Truck as TruckType } from "@/types"

export default function TrucksPage() {
  const [trucks, setTrucks] = useState<TruckType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stateFilter, setStateFilter] = useState<string | null>(null)

  useEffect(() => {
    async function loadTrucks() {
      setIsLoading(true)
      try {
        const data = await fetchTrucks(stateFilter)
        setTrucks(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error loading trucks:", error)
        setTrucks([])
      } finally {
        setIsLoading(false)
      }
    }

    loadTrucks()
  }, [stateFilter])

  const getFuelTypeLabel = (fuelType: string): string => {
    return FUEL_TYPES[fuelType as keyof typeof FUEL_TYPES] || fuelType
  }

  const getStateLabel = (state: string): string => {
    return TRUCK_STATES[state as keyof typeof TRUCK_STATES] || state
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Camiones</h1>
          <p className="text-muted-foreground">Gestiona la flota de vehículos</p>
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
                <DropdownMenuItem onSelect={() => setStateFilter(null)}>Todos</DropdownMenuItem>
                {Object.entries(TRUCK_STATES).map(([value, label]) => (
                  <DropdownMenuItem key={value} onSelect={() => setStateFilter(value)}>
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
            {stateFilter && (
              <Badge variant="outline" className="ml-2">
                Estado: {getStateLabel(stateFilter)}
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
                  <TableHead>Marca/Modelo</TableHead>
                  <TableHead>Combustible</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Kilometraje</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trucks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No hay camiones registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  trucks.map((truck) => (
                    <TableRow key={truck.id}>
                      <TableCell className="font-medium">{truck.placa}</TableCell>
                      <TableCell>
                        {truck.brand && truck.model ? `${truck.brand} ${truck.model}` : "N/A"}
                        {truck.year && <div className="text-sm text-muted-foreground">{truck.year}</div>}
                      </TableCell>
                      <TableCell>{getFuelTypeLabel(truck.typefuel)}</TableCell>
                      <TableCell>{truck.capacitygal.toLocaleString()} gal</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getStateLabel(truck.state)}</Badge>
                      </TableCell>
                      <TableCell>{truck.mileage ? `${truck.mileage.toLocaleString()} km` : "N/A"}</TableCell>
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
