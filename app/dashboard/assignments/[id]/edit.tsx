"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Fuel, Truck, User, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { assignmentSchema } from "@/lib/zod-schemas"
import { FUEL_TYPES } from "@/lib/constants"
import { fetchTrucks, fetchUsers, fetchCustomers } from "@/lib/api"

export default function EditAssignmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [trucks, setTrucks] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedTruck, setSelectedTruck] = useState<any>(null)
  const [assignment, setAssignment] = useState<any>(null)

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      truckId: 0,
      driverId: 0,
      totalLoaded: 0,
      fuelType: "DIESEL_B5",
      notes: "",
      customers: [],
    },
  })

  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true)
      try {
        const [trucksData, driversData, customersData, assignmentData] = await Promise.all([
          fetchTrucks("Activo"), // Pass "Activo" as the state parameter
          fetchUsers("Conductor", "Activo"), // Pass both role and state parameters
          fetchCustomers(),
          fetch(`/api/assignments/${params.id}`).then((res) => res.json()),
        ])
        setTrucks(trucksData)
        setDrivers(driversData)
        setCustomers(customersData)
        setAssignment(assignmentData)

        // Get the assigned customers
        const assignedCustomers = await fetch(`/api/assignments/${params.id}/customers`).then((res) => res.json())

        // Set form values
        form.reset({
          truckId: assignmentData.truckId,
          driverId: assignmentData.driverId,
          totalLoaded: Number(assignmentData.totalLoaded),
          fuelType: assignmentData.fuelType,
          notes: assignmentData.notes || "",
          customers: assignedCustomers.map((c: any) => c.id),
        })

        // Set selected truck
        const truck = trucksData.find((t) => t.id === assignmentData.truckId)
        setSelectedTruck(truck)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadData()
  }, [params.id, form])

  useEffect(() => {
    const truckId = form.watch("truckId")
    if (truckId) {
      const truck = trucks.find((t: any) => t.id === Number(truckId))
      setSelectedTruck(truck)
      if (truck) {
        form.setValue("fuelType", truck.typefuel)
      }
    }
  }, [form.watch("truckId"), trucks, form])

  async function onSubmit(values: z.infer<typeof assignmentSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/assignments/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar la asignación")
      }

      router.push("/dashboard/assignments")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return <div className="flex h-24 items-center justify-center">Cargando datos...</div>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Asignación</h1>
        <p className="text-muted-foreground">Modifica los detalles de la asignación #{params.id}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Selección de Camión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="truckId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camión</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      defaultValue={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un camión" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trucks.map((truck) => (
                          <SelectItem key={truck.id} value={truck.id.toString()}>
                            {truck.placa} - {FUEL_TYPES[truck.typefuel as keyof typeof FUEL_TYPES]} ({truck.capacitygal}{" "}
                            gal)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Selecciona el camión para la asignación</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Selección de Conductor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conductor</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      defaultValue={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un conductor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id.toString()}>
                            {driver.name} {driver.lastname} - {driver.dni}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Selecciona el conductor para la asignación</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5" />
                Información de Carga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="totalLoaded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad Cargada (galones)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Cantidad total cargada en galones
                      {selectedTruck && (
                        <span className="ml-1 text-muted-foreground">
                          (Capacidad máxima: {selectedTruck.capacitygal} gal)
                        </span>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Combustible</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de combustible" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(FUEL_TYPES).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Tipo de combustible cargado</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notas adicionales sobre la asignación" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Selección de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="customers"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Clientes a visitar</FormLabel>
                      <FormDescription>Selecciona los clientes que recibirán combustible</FormDescription>
                    </div>
                    {customers.map((customer) => (
                      <FormField
                        key={customer.id}
                        control={form.control}
                        name="customers"
                        render={({ field }) => {
                          return (
                            <FormItem key={customer.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(customer.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, customer.id])
                                      : field.onChange(field.value?.filter((value) => value !== customer.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {customer.companyname} - {customer.address}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Actualizar Asignación"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
