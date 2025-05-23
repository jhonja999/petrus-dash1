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
import { ArrowLeft, Save, Truck } from "lucide-react"
import Link from "next/link"

export default function NewTruckPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    plate: "",
    brand: "",
    model: "",
    year: "",
    fuelType: "",
    capacity: "",
    tankCapacity: "",
    mileage: "",
    vin: "",
    engineNumber: "",
    color: "",
    status: "Activo",
    lastMaintenance: "",
    nextMaintenance: "",
    insuranceCompany: "",
    insurancePolicy: "",
    insuranceExpiry: "",
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
      const response = await fetch("/api/trucks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/dashboard/trucks")
      } else {
        alert("Error al crear el camión")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al crear el camión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/trucks">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Camión</h1>
          <p className="text-muted-foreground">Registrar un nuevo vehículo en la flota</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Información Básica
            </CardTitle>
            <CardDescription>Datos principales del vehículo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plate">Placa *</Label>
                <Input
                  id="plate"
                  value={formData.plate}
                  onChange={(e) => handleInputChange("plate", e.target.value.toUpperCase())}
                  placeholder="Ej: ABC-123"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Mantenimiento">En Mantenimiento</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Ej: Volvo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="Ej: FH16"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Año *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  placeholder="Ej: 2020"
                  min="1990"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  placeholder="Ej: Blanco"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelType">Tipo de Combustible *</Label>
                <Select value={formData.fuelType} onValueChange={(value) => handleInputChange("fuelType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar combustible" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Gasolina">Gasolina</SelectItem>
                    <SelectItem value="Gas">Gas Natural</SelectItem>
                    <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Especificaciones Técnicas</CardTitle>
            <CardDescription>Detalles técnicos del vehículo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidad de Carga (kg)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", e.target.value)}
                  placeholder="Ej: 25000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tankCapacity">Capacidad del Tanque (L)</Label>
                <Input
                  id="tankCapacity"
                  type="number"
                  value={formData.tankCapacity}
                  onChange={(e) => handleInputChange("tankCapacity", e.target.value)}
                  placeholder="Ej: 400"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vin">Número VIN</Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => handleInputChange("vin", e.target.value.toUpperCase())}
                  placeholder="Ej: 1HGBH41JXMN109186"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="engineNumber">Número de Motor</Label>
                <Input
                  id="engineNumber"
                  value={formData.engineNumber}
                  onChange={(e) => handleInputChange("engineNumber", e.target.value)}
                  placeholder="Ej: D13K500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Kilometraje Actual</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleInputChange("mileage", e.target.value)}
                placeholder="Ej: 150000"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mantenimiento</CardTitle>
            <CardDescription>Información sobre el mantenimiento del vehículo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lastMaintenance">Último Mantenimiento</Label>
                <Input
                  id="lastMaintenance"
                  type="date"
                  value={formData.lastMaintenance}
                  onChange={(e) => handleInputChange("lastMaintenance", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextMaintenance">Próximo Mantenimiento</Label>
                <Input
                  id="nextMaintenance"
                  type="date"
                  value={formData.nextMaintenance}
                  onChange={(e) => handleInputChange("nextMaintenance", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seguro</CardTitle>
            <CardDescription>Información del seguro del vehículo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="insuranceCompany">Compañía de Seguros</Label>
                <Input
                  id="insuranceCompany"
                  value={formData.insuranceCompany}
                  onChange={(e) => handleInputChange("insuranceCompany", e.target.value)}
                  placeholder="Ej: Seguros Bolívar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurancePolicy">Número de Póliza</Label>
                <Input
                  id="insurancePolicy"
                  value={formData.insurancePolicy}
                  onChange={(e) => handleInputChange("insurancePolicy", e.target.value)}
                  placeholder="Ej: 123456789"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceExpiry">Vencimiento del Seguro</Label>
              <Input
                id="insuranceExpiry"
                type="date"
                value={formData.insuranceExpiry}
                onChange={(e) => handleInputChange("insuranceExpiry", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Información adicional sobre el vehículo..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? "Guardando..." : "Crear Camión"}
          </Button>
          <Link href="/dashboard/trucks">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
