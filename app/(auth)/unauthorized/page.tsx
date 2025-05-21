import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <ShieldAlert className="h-16 w-16 text-destructive" />
      <h1 className="text-3xl font-bold">Acceso no autorizado</h1>
      <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/sign-in">Iniciar sesión</Link>
        </Button>
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  )
}
