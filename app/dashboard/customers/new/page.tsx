"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Building2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function NewCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    companyname: "",
    ruc: "",
    address: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
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
    if (!formData.companyname.trim()) {
      setError("El nombre de la empresa es requerido")
      return false
    }
    if (!formData.ruc.trim()) {
      setError("El RUC es requerido")
      return false
    }
    if (formData.ruc.length !== 11) {
      setError("El RUC debe tener exactamente 11 dígitos")
      return false
    }
    if (!/^\d{11}$/.test(formData.ruc)) {
      setError("El RUC debe contener solo números")
      return false
    }
    if (!formData.address.trim()) {
      setError("La dirección es requerida")
      return false
    }
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      setError("El formato del correo electrónico no es válido")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Prepare data for submission - remove empty optional fields
      const submitData = {
        companyname: formData.companyname.trim(),
        ruc: formData.ruc.trim(),
        address: formData.address.trim(),
        ...(formData.contactName.trim() && { contactName: formData.contactName.trim() }),
        ...(formData.contactPhone.trim() && { contactPhone: formData.contactPhone.trim() }),
        ...(formData.contactEmail.trim() && { contactEmail: formData.contactEmail.trim() }),
      }

      console.log("Submitting customer data:", submitData)

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      const responseData = await response.json()
      console.log("API Response:", responseData)

      if (response.ok) {
        router.push("/dashboard/customers")
      } else {
        setError(responseData.details || responseData.error || "Error al crear el cliente")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Error de conexión. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/customers">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Cliente</h1>
          <p className="text-muted-foreground">Registrar un nuevo cliente en el sistema</p>
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
              <Building2 className="h-5 w-5" />
              Información de la Empresa
            </CardTitle>
            <CardDescription>Datos básicos del cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyname">Nombre de la Empresa *</Label>
                <Input
                  id="companyname"
                  value={formData.companyname}
                  onChange={(e) => handleInputChange("companyname", e.target.value)}
                  placeholder="Ej: Transportes ABC S.A.C."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruc">RUC * (11 dígitos)</Label>
                <Input
                  id="ruc"
                  value={formData.ruc}
                  onChange={(e) => {
                    // Only allow numbers and limit to 11 characters
                    const value = e.target.value.replace(/\D/g, "").slice(0, 11)
                    handleInputChange("ruc", value)
                  }}
                  placeholder="Ej: 20123456789"
                  maxLength={11}
                  required
                />
                <p className="text-xs text-muted-foreground">Ingresa exactamente 11 dígitos (solo números)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Ej: Av. Principal 123, Cajamarca, Perú"
                required
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
            <CardDescription>Datos del contacto principal (opcional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Nombre del Contacto</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange("contactName", e.target.value)}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Teléfono del Contacto</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  placeholder="Ej: +51 987 654 321"
                />
                <p className="text-xs text-muted-foreground">Formato: +51 987 654 321 (9 caracteres)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Correo del Contacto</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  placeholder="Ej: contacto.persona@empresa.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? "Guardando..." : "Crear Cliente"}
          </Button>
          <Link href="/dashboard/customers">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
