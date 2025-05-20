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
import { userSchema } from "@/lib/zod-schemas"

const formSchema = userSchema.extend({
  id: z.number().optional(),
})

export function UserDialog({ open, setOpen, onSubmit, user = null }) {
  const [preview, setPreview] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dni: "",
      name: "",
      lastname: "",
      email: "",
      role: "Conductor",
      state: "Activo",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset(user)
    } else {
      form.reset({
        dni: "",
        name: "",
        lastname: "",
        email: "",
        role: "Conductor",
        state: "Activo",
      })
    }
    setPreview(false)
  }, [user, form, open])

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
          <DialogTitle>{user ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
          <DialogDescription>
            {preview ? "Revise los datos antes de guardar" : "Complete los datos del usuario"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {preview ? (
              <div className="space-y-4 rounded-md border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">DNI</p>
                    <p className="text-sm">{form.getValues("dni")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Rol</p>
                    <p className="text-sm">{form.getValues("role")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Nombre Completo</p>
                  <p className="text-sm">
                    {form.getValues("name")} {form.getValues("lastname")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{form.getValues("email")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estado</p>
                  <p className="text-sm">{form.getValues("state")}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dni"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DNI</FormLabel>
                        <FormControl>
                          <Input placeholder="12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Conductor">Conductor</SelectItem>
                            <SelectItem value="ADMIN">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input placeholder="Pérez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="juan.perez@example.com" {...field} />
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
                          <SelectItem value="Suspendido">Suspendido</SelectItem>
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
