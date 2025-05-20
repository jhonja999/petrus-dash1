"use client"

import { useState } from "react"
import { SignUp } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpPage() {
  const [role, setRole] = useState<"ADMIN" | "Conductor">("Conductor")

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
          <CardDescription>Seleccione su rol y regístrese para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="conductor"
            className="w-full"
            onValueChange={(value) => setRole(value === "admin" ? "ADMIN" : "Conductor")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="conductor">Conductor</TabsTrigger>
              <TabsTrigger value="admin">Administrador</TabsTrigger>
            </TabsList>
            <TabsContent value="conductor">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "w-full shadow-none",
                  },
                }}
                initialValues={{
                  emailAddress: "conductor@example.com",
                }}
                signInUrl="/auth/sign-in"
                afterSignUpUrl="/onboarding/conductor"
                redirectUrl="/onboarding/conductor"
              />
            </TabsContent>
            <TabsContent value="admin">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "w-full shadow-none",
                  },
                }}
                initialValues={{
                  emailAddress: "admin@example.com",
                }}
                signInUrl="/auth/sign-in"
                afterSignUpUrl="/onboarding/admin"
                redirectUrl="/onboarding/admin"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
