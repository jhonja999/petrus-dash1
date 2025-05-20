"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth } from "@clerk/nextjs"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  dni: z.string().min(8, "El DNI debe tener al menos 8 caracteres").max(12),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastname: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
})

export default function AdminOnboarding() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dni: "",
      name: "",
      lastname: "",
    },
  })

  useEffect(() => {
    // Si el usuario ya tiene metadata, redirigir al dashboard
    if (isUserLoaded && user?.publicMetadata?.role === "ADMIN") {
      router.push("/admin/dashboard")
    }
  }, [isUserLoaded, user, router])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      // 1. Actualizar los metadatos del usuario en Clerk
      await user.update({
        publicMetadata: {
          role: "ADMIN",
          dni: values.dni,
        },
        firstName: values.name,
        lastName: values.lastname,
      })

      // 2. Crear el usuario en nuestra base de datos
      const token = await getToken()
      await axios.post(
        "/api/users",
        {
          dni: values.dni,
          name: values.name,
          lastname: values.lastname,
          email: user.primaryEmailAddress?.emailAddress,
          role: "ADMIN",
          state: "Activo",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // 3. Redirigir al dashboard
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error en onboarding:", error)
      form.setError("root", {
        message: "Ocurrió un error al configurar tu cuenta. Por favor, intenta nuevamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isUserLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Completar Perfil</CardTitle>
          <CardDescription>Proporciona tus datos para continuar como administrador</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" {...field} />
                    </FormControl>
                    <FormDescription>Tu documento de identidad</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              {form.formState.errors.root && (
                <div className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                  </>
                ) : (
                  "Guardar y Continuar"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
