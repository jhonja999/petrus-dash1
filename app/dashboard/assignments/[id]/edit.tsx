"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { TruckIcon, User, Fuel } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { assignmentSchema } from "@/lib/zod-schemas"
import { FUEL_TYPES, type FuelType } from "@/lib/constants"

type TruckType = {
  id: number
  placa: string
  typefuel: string
  capacitygal: number
  state: string
}

type DriverType = {
  id: number
  name: string
  lastname: string
  dni: string
  email: string
}

type CustomerType = {
  id: number
  companyname: string
  ruc: string
  address: string
}

type DischargeType = {
  id: number
  customerId: number
  totalDischarged: number
}

export default function EditAssignmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [trucks, setTrucks] = useState<TruckType[]>([])
  const [drivers, setDrivers] = useState<DriverType[]>([])
  const [customers, setCustomers] = useState<CustomerType[]>([])
  const [selectedTruck, setSelectedTruck] = useState<TruckType | null>(null)
  const [assignment, setAssignment] = useState<any>(null)
  const [existingDischarges, setExistingDischarges] = useState<DischargeType[]>([])

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
    const fetchData = async () => {
      try {
        const [trucksRes, driversRes, customersRes, assignmentRes] = await Promise.all([
          fetch("/api/trucks?state=Activo"),
          fetch("/api/users?role=Conductor&state=Activo"),
          fetch("/api/customers"),
          fetch(`/api/assignments/${params.id}`),
        ])

        const trucksData = await trucksRes.json()
        const driversData = await driversRes.json()
        const customersData = await customersRes.json()
        const assignmentData = await assignmentRes.json()

        setTrucks(trucksData)
        setDrivers(driversData)
        setCustomers(customersData)
        setAssignment(assignmentData)

        // Extract existing discharges
        const discharges = assignmentData.discharges || []
        setExistingDischarges(discharges)

        // Set form values
        form.reset({
          truckId: assignmentData.truckId,
          driverId: assignmentData.driverId,
          totalLoaded: Number(assignmentData.totalLoaded),
          fuelType: assignmentData.fuelType as FuelType,
          notes: assignmentData.notes || "",
          customers: discharges.map((d: any) => d.customerId),
        })

        // Set selected truck
        const truck = trucksData.find((t: any) => t.id === assignmentData.truckId)
        setSelectedTruck(truck || null)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [params.id, form])

  // Update selected truck when truckId changes
  useEffect(() => {
    const truckId = form.watch("truckId")
    const truck = trucks.find((t) => t.id === truckId)
    setSelectedTruck(truck || null)

    // Update fuel type based on selected truck
    if (truck) {
      form.setValue("fuelType", truck.typefuel as FuelType)
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

  // Check if any discharge has already been completed
  const hasCompletedDischarges = existingDischarges.some((d) => Number(d.totalDischarged) > 0)

  if (!assignment) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Cargando...</h2>
          <p className="text-sm text-muted-foreground">Obteniendo información de la asignación</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Asignación</h1>
        <p className="text-muted-foreground">Modifica los detalles de la asignación</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TruckIcon className="h-5 w-5" />
                Selección de Camión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="truckId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camión</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      value={field.value ? field.value.toString() : ""}
                      disabled={hasCompletedDischarges}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un camión" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trucks.map((truck) => (
                          <SelectItem key={truck.id} value={truck.id.toString()}>
                            {truck.placa} - {FUEL_TYPES[truck.typefuel as FuelType] || truck.typefuel} (
                            {truck.capacitygal.toString()} gal)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {hasCompletedDischarges
                        ? "No se puede cambiar el camión porque ya hay descargas registradas"
                        : "Selecciona un camión activo para la asignación"}
                    </FormDescription>
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
            <CardContent>
              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conductor</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      value={field.value ? field.value.toString() : ""}
                      disabled={hasCompletedDischarges}
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
                    <FormDescription>
                      {hasCompletedDischarges
                        ? "No se puede cambiar el conductor porque ya hay descargas registradas"
                        : "Selecciona un conductor activo para la asignación"}
                    </FormDescription>
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
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Combustible</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!selectedTruck || hasCompletedDischarges}
                    >
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
                    <FormDescription>
                      {selectedTruck
                        ? "El tipo de combustible se determina automáticamente según el camión seleccionado"
                        : "Selecciona el tipo de combustible"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalLoaded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carga Total (galones)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                        disabled={hasCompletedDischarges}
                      />
                    </FormControl>
                    <FormDescription>
                      {hasCompletedDischarges
                        ? "No se puede cambiar la carga porque ya hay descargas registradas"
                        : `Cantidad total de combustible cargado en galones ${
                            selectedTruck ? `(máximo: ${selectedTruck.capacitygal} gal)` : ""
                          }`}
                    </FormDescription>
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
                <User className="h-5 w-5" />
                Selección de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="customers"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Clientes</FormLabel>
                      <FormDescription>
                        {hasCompletedDischarges
                          ? "No se pueden modificar los clientes porque ya hay descargas registradas"
                          : "Selecciona los clientes que recibirán combustible"}
                      </FormDescription>
                    </div>

                    <div className="space-y-2">
                      <Accordion type="multiple" className="w-full">
                        {customers.map((customer) => {
                          // Check if this customer already has a discharge with fuel
                          const hasDischarge = existingDischarges.some(
                            (d) => d.customerId === customer.id && Number(d.totalDischarged) > 0,
                          )

                          return (
                            <AccordionItem key={customer.id} value={customer.id.toString()}>
                              <div className="flex items-center space-x-2 py-2">
                                <FormField
                                  control={form.control}
                                  name="customers"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={customer.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(customer.id)}
                                            onCheckedChange={(checked) => {
                                              if (hasDischarge) return // Prevent unchecking if has discharge
                                              return checked
                                                ? field.onChange([...field.value, customer.id])
                                                : field.onChange(field.value?.filter((value) => value !== customer.id))
                                            }}
                                            disabled={hasCompletedDischarges || hasDischarge}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {customer.companyname}
                                          {hasDischarge && (
                                            <span className="ml-2 text-xs text-green-600">(Descarga completada)</span>
                                          )}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                                <AccordionTrigger className="ml-auto" />
                              </div>
                              <AccordionContent>
                                <div className="space-y-2 rounded-md border p-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <span className="text-sm font-medium">RUC:</span>
                                      <p className="text-sm">{customer.ruc}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">Dirección:</span>
                                      <p className="text-sm">{customer.address}</p>
                                    </div>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )
                        })}
                      </Accordion>
                    </div>
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
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
