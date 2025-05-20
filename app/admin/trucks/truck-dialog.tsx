"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { truckSchema } from "@/lib/zod-schemas"

const formSchema = truckSchema.extend({
  id: z.number().optional(),
})

export function TruckDialog({ open, setOpen, onSubmit, truck = null }) {
  const [preview, setPreview] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      placa: "",
      typefuel: "DIESEL B5",
      capacitygal: 1000,
      state: "Activo",
    },
  })

  useEffect(() => {
    if (truck) {
      form.reset(truck)
    } else {
      form.reset({
        placa: "",
        typefuel: "DIESEL B5",
        capacitygal: 1000,
        state: "Activo",
      })
    }
    setPreview(false)
  }, [truck, form, open])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (preview) {
      onSubmit(values)
      form.reset()
      setPreview(false)
    } else {
      setPreview(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{truck ? "Editar Camión" : "Crear Nuevo Camión"}</DialogTitle>
          <DialogDescription>
            {preview ? "Revise los datos antes de guardar" : "Complete los datos del camión"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {preview ? (
              <div className="space-y-4 rounded-md border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Placa</p>
                    <p className="text-sm">{form.getValues("placa")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tipo de Combustible</p>
                    <p className="text-sm">{form.getValues("typefuel")}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Capacidad (gal)</p>
                    <p className="text-sm">{form.getValues("capacitygal")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estado</p>
                    <p className="text-sm">{form.getValues("state")}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="placa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="typefuel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Combustible</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DIESEL B5">DIESEL B5</SelectItem>
                          <SelectItem value="GASOLINA 90">GASOLINA 90</SelectItem>
                          <SelectItem value="GASOLINA 95">GASOLINA 95</SelectItem>
                          <SelectItem value="GLP">GLP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacitygal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidad (gal)</FormLabel>
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
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Activo">Activo</SelectItem>
                          <SelectItem value="Inactivo">Inactivo</SelectItem>
                          <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                          <SelectItem value="Transito">En Tránsito</SelectItem>
                          <SelectItem value="Descarga">En Descarga</SelectItem>
                          <SelectItem value="Asignado">Asignado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
