"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { assignmentSchema } from "@/lib/zod-schemas"
import { useToast } from "@/hooks/use-toast"

const formSchema = assignmentSchema.extend({
  id: z.number().optional(),
})

export function AssignmentDialog({ open, setOpen, onSubmit, assignment = null }) {
  const [preview, setPreview] = useState(false)
  const [trucks, setTrucks] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      truckId: 0,
      driverId: 0,
      totalLoaded: 0,
      totalRemaining: 0,
      fuelType: "",
      notes: "",
      isCompleted: false,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // En un entorno real, estas serían llamadas a la API
        const trucksResponse = await axios.get("/api/trucks?state=Activo")
        const driversResponse = await axios.get("/api/users?role=Conductor&state=Activo")

        setTrucks(trucksResponse.data)
        setDrivers(driversResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos necesarios",
          variant: "destructive",
        })
        // Datos de ejemplo para desarrollo
        setTrucks([
          { id: 1, placa: "ABC123", typefuel: "DIESEL B5", capacitygal: 1000 },
          { id: 2, placa: "DEF456", typefuel: "GASOLINA 95", capacitygal: 800 },
        ])
        setDrivers([
          { id: 1, name: "Juan", lastname: "Pérez" },
          { id: 2, name: "María", lastname: "López" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  useEffect(() => {
    if (assignment) {
      form.reset({
        id: assignment.id,
        truckId: assignment.truck.id,
        driverId: assignment.driver.id,
        totalLoaded: assignment.totalLoaded,
        totalRemaining: assignment.totalRemaining,
        fuelType: assignment.fuelType,
        notes: assignment.notes || "",
        isCompleted: assignment.isCompleted,
      })
    } else {
      form.reset({
        truckId: 0,
        driverId: 0,
        totalLoaded: 0,
        totalRemaining: 0,
        fuelType: "",
        notes: "",
        isCompleted: false,
      })
    }
    setPreview(false)
  }, [assignment, form, open])

  const handleTruckChange = (truckId: string) => {
    const selectedTruck = trucks.find((truck) => truck.id === Number.parseInt(truckId))
    if (selectedTruck) {
      form.setValue("truckId", selectedTruck.id)
      form.setValue("fuelType", selectedTruck.typefuel)

      // Si es una nueva asignación, establecer valores predeterminados
      if (!assignment) {
        form.setValue("totalLoaded", selectedTruck.capacitygal)
        form.setValue("totalRemaining", selectedTruck.capacitygal)
      }
    }
  }

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (preview) {
      onSubmit(values)
      form.reset()
      setPreview(false)
    } else {
      setPreview(true)
    }
  }

  // Encontrar los objetos completos para mostrar en la vista previa
  const selectedTruck = trucks.find((truck) => truck.id === form.getValues("truckId"))
  const selectedDriver = drivers.find((driver) => driver.id === form.getValues("driverId"))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{assignment ? "Editar Asignación" : "Crear Nueva Asignación"}</DialogTitle>
          <DialogDescription>
            {preview ? "Revise los datos antes de guardar" : "Complete los datos de la asignación"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {preview ? (
              <div className="space-y-4 rounded-md border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Camión</p>
                    <p className="text-sm">{selectedTruck?.placa || "No seleccionado"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Conductor</p>
                    <p className="text-sm">
                      {selectedDriver ? `${selectedDriver.name} ${selectedDriver.lastname}` : "No seleccionado"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Tipo de Combustible</p>
                    <p className="text-sm">{form.getValues("fuelType")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Carga Total (gal)</p>
                    <p className="text-sm">{form.getValues("totalLoaded")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Notas</p>
                  <p className="text-sm">{form.getValues("notes") || "Sin notas"}</p>
                </div>
              </div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="truckId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Camión</FormLabel>
                      <Select
                        onValueChange={(value) => handleTruckChange(value)}
                        defaultValue={field.value ? field.value.toString() : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un camión" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {trucks.map((truck) => (
                            <SelectItem key={truck.id} value={truck.id.toString()}>
                              {truck.placa} - {truck.typefuel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="driverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conductor</FormLabel>
                      <Select
                        onValueChange={(value) => form.setValue("driverId", Number.parseInt(value))}
                        defaultValue={field.value ? field.value.toString() : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un conductor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id.toString()}>
                              {driver.name} {driver.lastname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <FormControl>
                        <Input placeholder="DIESEL B5" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalLoaded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carga Total (gal)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1000"
                            {...field}
                            onChange={(e) => {
                              const value = Number.parseFloat(e.target.value)
                              field.onChange(value)
                              // Si es una nueva asignación, actualizar también el combustible restante
                              if (!assignment) {
                                form.setValue("totalRemaining", value)
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalRemaining"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restante (gal)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1000"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Observaciones o instrucciones especiales" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {assignment && (
                  <FormField
                    control={form.control}
                    name="isCompleted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Marcar como completada</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Esto indicará que la asignación ha sido finalizada
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}
            <DialogFooter>
              {preview && (
                <Button type="button" variant="outline" onClick={() => setPreview(false)}>
                  Volver
                </Button>
              )}
              <Button type="submit">{preview ? "Guardar" : "Continuar"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
