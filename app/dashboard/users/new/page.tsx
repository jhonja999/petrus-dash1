"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, User } from "lucide-react"
import Link from "next/link"

export default function NewUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    licenseNumber: "",
    licenseType: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/dashboard/users")
      } else {
        alert("Error al crear el usuario")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al crear el usuario")
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
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  required
                />
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
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Ej: +57 300 123 4567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conductor">Conductor</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="Administrador">Administrador</SelectItem>
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
                placeholder="Ej: Calle 123 #45-67, Bogotá"
              />
            </div>
          </CardContent>
        </Card>

        {formData.role === "Conductor" && (
          <Card>
            <CardHeader>
              <CardTitle>Información de Licencia</CardTitle>
              <CardDescription>Datos de la licencia de conducción</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Número de Licencia *</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                    placeholder="Ej: 12345678"
                    required={formData.role === "Conductor"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseType">Tipo de Licencia *</Label>
                  <Select
                    value={formData.licenseType}
                    onValueChange={(value) => handleInputChange("licenseType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C1">C1 - Vehículos hasta 7.5 toneladas</SelectItem>
                      <SelectItem value="C2">C2 - Vehículos de carga pesada</SelectItem>
                      <SelectItem value="C3">C3 - Vehículos articulados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Contacto de Emergencia</CardTitle>
            <CardDescription>Información de contacto en caso de emergencia</CardDescription>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Teléfono de Emergencia</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  placeholder="Ej: +57 300 987 6543"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Información adicional sobre el usuario..."
                rows={3}
              />
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
