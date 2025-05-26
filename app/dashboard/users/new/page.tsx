"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, User, AlertCircle } from "lucide-react"
import Link from "next/link"
import { LICENSE_TYPES } from "@/lib/constants"

export default function NewUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    dni: "",
    name: "",
    lastname: "",
    email: "",
    phone: "",
    role: "",
    licenseNumber: "",
    licenseType: "",
    licenseExpiry: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const validateForm = () => {
    // Basic client-side validation
    if (!formData.dni || formData.dni.length < 8) {
      setError("DNI debe tener al menos 8 caracteres")
      return false
    }
    if (!formData.name || formData.name.length < 2) {
      setError("Nombre debe tener al menos 2 caracteres")
      return false
    }
    if (!formData.lastname || formData.lastname.length < 2) {
      setError("Apellido debe tener al menos 2 caracteres")
      return false
    }
    if (!formData.email || !formData.email.includes("@")) {
      setError("Debe proporcionar un email válido")
      return false
    }
    if (!formData.role) {
      setError("Debe seleccionar un rol")
      return false
    }

    // Validate optional fields only if they have content
    if (formData.address && formData.address.length < 10) {
      setError("Si proporciona una dirección, debe tener al menos 10 caracteres")
      return false
    }
    if (formData.phone && formData.phone.length < 9) {
      setError("Si proporciona un teléfono, debe tener al menos 9 caracteres")
      return false
    }
    if (formData.licenseNumber && formData.licenseNumber.length < 8) {
      setError("Si proporciona un número de licencia, debe tener al menos 8 caracteres")
      return false
    }
    if (formData.emergencyContact && formData.emergencyContact.length < 2) {
      setError("Si proporciona un contacto de emergencia, debe tener al menos 2 caracteres")
      return false
    }
    if (formData.emergencyPhone && formData.emergencyPhone.length < 9) {
      setError("Si proporciona un teléfono de emergencia, debe tener al menos 9 caracteres")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Clean up the data before sending - only include non-empty values
      const cleanedData: any = {
        dni: formData.dni,
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        role: formData.role,
      }

      // Only add optional fields if they have content
      if (formData.phone && formData.phone.trim()) {
        cleanedData.phone = formData.phone.trim()
      }
      if (formData.address && formData.address.trim()) {
        cleanedData.address = formData.address.trim()
      }
      if (formData.licenseNumber && formData.licenseNumber.trim()) {
        cleanedData.licenseNumber = formData.licenseNumber.trim()
      }
      if (formData.licenseType && formData.licenseType.trim()) {
        cleanedData.licenseType = formData.licenseType.trim()
      }
      if (formData.licenseExpiry && formData.licenseExpiry.trim()) {
        cleanedData.licenseExpiry = new Date(formData.licenseExpiry).toISOString()
      }
      if (formData.emergencyContact && formData.emergencyContact.trim()) {
        cleanedData.emergencyContact = formData.emergencyContact.trim()
      }
      if (formData.emergencyPhone && formData.emergencyPhone.trim()) {
        cleanedData.emergencyPhone = formData.emergencyPhone.trim()
      }

      console.log("Submitting user data:", cleanedData)

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      })

      const responseData = await response.json()

      if (response.ok) {
        router.push("/dashboard/users")
      } else {
        console.error("API Error:", responseData)

        // Parse validation errors if available
        if (responseData.details) {
          try {
            const errors = JSON.parse(responseData.details)
            const errorMessages = errors.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ")
            setError(`Errores de validación: ${errorMessages}`)
          } catch {
            setError(`Error al crear el usuario: ${responseData.error || "Error desconocido"}`)
          }
        } else {
          setError(`Error al crear el usuario: ${responseData.error || "Error desconocido"}`)
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Error de conexión. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Usuario</h1>
          <p className="text-muted-foreground">Crear un nuevo usuario en el sistema</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
            <CardDescription>Datos básicos del usuario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => handleInputChange("dni", e.target.value)}
                  placeholder="Ej: 12345678"
                  required
                />
                <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Ej: juan@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ej: Juan"
                  required
                />
                <p className="text-xs text-muted-foreground">Mínimo 2 caracteres</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Apellido *</Label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={(e) => handleInputChange("lastname", e.target.value)}
                  placeholder="Ej: Pérez"
                  required
                />
                <p className="text-xs text-muted-foreground">Mínimo 2 caracteres</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Ej: +51 976 123 4567"
                />
                <p className="text-xs text-muted-foreground">Opcional - Mínimo 9 caracteres si se proporciona</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conductor">Conductor</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Ej: Calle 123 #45-67, Perú"
              />
              <p className="text-xs text-muted-foreground">Opcional - Mínimo 10 caracteres si se proporciona</p>
            </div>
          </CardContent>
        </Card>

        {formData.role === "Conductor" && (
          <Card>
            <CardHeader>
              <CardTitle>Información de Licencia</CardTitle>
              <CardDescription>Datos de la licencia de conducción (opcional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Número de Licencia</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                    placeholder="Ej: 12345678"
                  />
                  <p className="text-xs text-muted-foreground">Opcional - Mínimo 8 caracteres si se proporciona</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseType">Tipo de Licencia</Label>
                  <Select
                    value={formData.licenseType}
                    onValueChange={(value) => handleInputChange("licenseType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LICENSE_TYPES).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">Vencimiento de Licencia</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => handleInputChange("licenseExpiry", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Opcional</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Contacto de Emergencia</CardTitle>
            <CardDescription>Información de contacto en caso de emergencia (opcional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Nombre del Contacto</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Ej: María Pérez"
                />
                <p className="text-xs text-muted-foreground">Opcional - Mínimo 2 caracteres si se proporciona</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Teléfono de Emergencia</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  placeholder="Ej: +51 123 456 789"
                />
                <p className="text-xs text-muted-foreground">Opcional - Mínimo 9 caracteres si se proporciona</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? "Guardando..." : "Crear Usuario"}
          </Button>
          <Link href="/dashboard/users">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
