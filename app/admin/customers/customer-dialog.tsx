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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { customerSchema } from "@/lib/zod-schemas"

const formSchema = customerSchema.extend({
  id: z.number().optional(),
})

export function CustomerDialog({ open, setOpen, onSubmit, customer = null }) {
  const [preview, setPreview] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyname: "",
      ruc: "",
      address: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
    },
  })

  useEffect(() => {
    if (customer) {
      form.reset(customer)
    } else {
      form.reset({
        companyname: "",
        ruc: "",
        address: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
      })
    }
    setPreview(false)
  }, [customer, form, open])

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
          <DialogTitle>{customer ? "Editar Cliente" : "Crear Nuevo Cliente"}</DialogTitle>
          <DialogDescription>
            {preview ? "Revise los datos antes de guardar" : "Complete los datos del cliente"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {preview ? (
              <div className="space-y-4 rounded-md border p-4">
                <div>
                  <p className="text-sm font-medium">Empresa</p>
                  <p className="text-sm">{form.getValues("companyname")}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">RUC</p>
                    <p className="text-sm">{form.getValues("ruc")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dirección</p>
                    <p className="text-sm">{form.getValues("address")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Contacto</p>
                  <p className="text-sm">
                    {form.getValues("contactName")} - {form.getValues("contactPhone")}
                  </p>
                  <p className="text-sm">{form.getValues("contactEmail")}</p>
                </div>
              </div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="companyname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Empresa X" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ruc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RUC</FormLabel>
                      <FormControl>
                        <Input placeholder="20123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Av. Principal 123, Lima" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de Contacto</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono de Contacto</FormLabel>
                      <FormControl>
                        <Input placeholder="987654321" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de Contacto</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="juan@empresax.com" {...field} />
                      </FormControl>
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
