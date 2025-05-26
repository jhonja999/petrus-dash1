"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { truckSchema } from "@/lib/zod-schemas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Truck, AlertCircle } from "lucide-react"
import Link from "next/link"
import { FUEL_TYPES, TRUCK_STATES } from "@/lib/constants"

export default function NewTruckPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
  const [formData, setFormData] = useState({
    placa: "",
    brand: "",
    model: "",
    year: "",
    typefuel: "",
    capacitygal: "",
    color: "",
    state: "Activo",
    engineNumber: "",
    chassisNumber: "",
    mileage: "",
    maxWeight: "",
    lastMaintenance: "",
    nextMaintenance: "",
    maintenanceKm: "",
    insuranceCompany: "",
    insurancePolicy: "",
    insuranceExpiry: "",
    notes: "",
  })

  const validateField = (field: string, value: string) => {
    const fieldErrors: Record<string, string> = {}

    switch (field) {
      case "placa":
        if (!value.trim()) {
          fieldErrors.placa = "La placa es requerida"
        } else if (value.length < 6 || value.length > 10) {
          fieldErrors.placa = "La placa debe tener entre 6 y 10 caracteres"
        } else if (!/^[A-Z0-9-]+$/.test(value)) {
          fieldErrors.placa = "La placa solo puede contener letras, números y guiones"
        }
        break

      case "typefuel":
        if (!value) {
          fieldErrors.typefuel = "El tipo de combustible es requerido"
        }
        break

      case "capacitygal":
        if (!value.trim()) {
          fieldErrors.capacitygal = "La capacidad es requerida"
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          fieldErrors.capacitygal = "La capacidad debe ser un número mayor a 0"
        } else if (Number(value) > 50000) {
          fieldErrors.capacitygal = "La capacidad no puede exceder 50,000 galones"
        }
        break

      case "brand":
        if (value && value.length < 2) {
          fieldErrors.brand = "La marca debe tener al menos 2 caracteres"
        }
        break

      case "model":
        if (value && value.length < 2) {
          fieldErrors.model = "El modelo debe tener al menos 2 caracteres"
        }
        break

      case "year":
        if (value) {
          const yearNum = Number(value)
          const currentYear = new Date().getFullYear()
          if (isNaN(yearNum) || yearNum < 1990 || yearNum > currentYear) {
            fieldErrors.year = `El año debe estar entre 1990 y ${currentYear}`
          }
        }
        break

      case "color":
        if (value && value.length < 3) {
          fieldErrors.color = "El color debe tener al menos 3 caracteres"
        }
        break

      case "engineNumber":
        if (value && value.length < 5) {
          fieldErrors.engineNumber = "El número de motor debe tener al menos 5 caracteres"
        }
        break

      case "chassisNumber":
        if (value && value.length < 10) {
          fieldErrors.chassisNumber = "El número de chasis debe tener al menos 10 caracteres"
        }
        break

      case "mileage":
        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
          fieldErrors.mileage = "El kilometraje debe ser un número positivo"
        }
        break

      case "maxWeight":
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
          fieldErrors.maxWeight = "El peso máximo debe ser un número mayor a 0"
        }
        break

      case "maintenanceKm":
        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
          fieldErrors.maintenanceKm = "El kilometraje debe ser un número positivo"
        }
        break

      case "insuranceCompany":
        if (value && value.length < 2) {
          fieldErrors.insuranceCompany = "La compañía de seguros debe tener al menos 2 caracteres"
        }
        break

      case "insurancePolicy":
        if (value && value.length < 5) {
          fieldErrors.insurancePolicy = "El número de póliza debe tener al menos 5 caracteres"
        }
        break

      case "notes":
        if (value && value.length > 500) {
          fieldErrors.notes = "Las notas no pueden exceder 500 caracteres"
        }
        break
    }

    return fieldErrors
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validar el campo actual
    const fieldErrors = validateField(field, value)
    setErrors(prev => ({ ...prev, ...fieldErrors, [field]: fieldErrors[field] || "" }))
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const fieldErrors = validateField(field, formData[field as keyof typeof formData])
    setErrors(prev => ({ ...prev, ...fieldErrors }))
  }

  const validateForm = () => {
    const allErrors: Record<string, string> = {}
    
    // Validar campos requeridos
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field as keyof typeof formData])
      Object.assign(allErrors, fieldErrors)
    })

    // Validaciones adicionales
    if (!formData.placa.trim()) allErrors.placa = "La placa es requerida"
    if (!formData.typefuel) allErrors.typefuel = "El tipo de combustible es requerido"
    if (!formData.capacitygal.trim()) allErrors.capacitygal = "La capacidad es requerida"

    setErrors(allErrors)
    return Object.keys(allErrors).filter(key => allErrors[key]).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Marcar todos los campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as Record<string, boolean>)
    setTouched(allTouched)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const cleanedData = {
        ...formData,
        year: formData.year ? Number(formData.year) : undefined,
        capacitygal: formData.capacitygal ? Number(formData.capacitygal) : undefined,
        mileage: formData.mileage ? Number(formData.mileage) : undefined,
        maxWeight: formData.maxWeight ? Number(formData.maxWeight) : undefined,
        maintenanceKm: formData.maintenanceKm ? Number(formData.maintenanceKm) : undefined,
        lastMaintenance: formData.lastMaintenance || undefined,
        nextMaintenance: formData.nextMaintenance || undefined,
        insuranceExpiry: formData.insuranceExpiry || undefined,
        brand: formData.brand || undefined,
        model: formData.model || undefined,
        color: formData.color || undefined,
        engineNumber: formData.engineNumber || undefined,
        chassisNumber: formData.chassisNumber || undefined,
        insuranceCompany: formData.insuranceCompany || undefined,
        insurancePolicy: formData.insurancePolicy || undefined,
        notes: formData.notes || undefined,
      }

      await truckSchema.parseAsync(cleanedData)

      const response = await fetch("/api/trucks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        let errorMessage = "Error desconocido"
        if (responseData.details) {
          errorMessage = responseData.details
            .map((err: { path: string[]; message: string }) => 
              `${err.path.join(".")}: ${err.message}`)
            .join("\n")
        } else if (responseData.error) {
          errorMessage = responseData.error
        }
        throw new Error(errorMessage)
      }

      router.push("/dashboard/trucks")
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          const path = err.path.join(".")
          zodErrors[path] = err.message
        })
        setErrors(zodErrors)
      } else if (error instanceof Error) {
        alert(`Error al crear el camión:\n${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const getFieldError = (field: string) => {
    return touched[field] && errors[field] ? errors[field] : ""
  }

  const hasFieldError = (field: string) => {
    return touched[field] && !!errors[field]
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
                <Label htmlFor="placa" className="flex items-center gap-1">
                  Placa *
                  {hasFieldError("placa") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="placa"
                  value={formData.placa}
                  onChange={(e) => handleInputChange("placa", e.target.value.toUpperCase())}
                  onBlur={() => handleBlur("placa")}
                  placeholder="Ej: ABC-123"
                  className={hasFieldError("placa") ? "border-red-500 focus:border-red-500" : ""}
                />
                {getFieldError("placa") && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("placa")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleInputChange("state", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TRUCK_STATES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="brand" className="flex items-center gap-1">
                  Marca
                  {hasFieldError("brand") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  onBlur={() => handleBlur("brand")}
                  placeholder="Ej: Volvo"
                  className={hasFieldError("brand") ? "border-red-500 focus:border-red-500" : ""}
                />
                {getFieldError("brand") && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("brand")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="flex items-center gap-1">
                  Modelo
                  {hasFieldError("model") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  onBlur={() => handleBlur("model")}
                  placeholder="Ej: FH16"
                  className={hasFieldError("model") ? "border-red-500 focus:border-red-500" : ""}
                />
                {getFieldError("model") && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("model")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="flex items-center gap-1">
                  Año
                  {hasFieldError("year") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  onBlur={() => handleBlur("year")}
                  placeholder="Ej: 2020"
                  className={hasFieldError("year") ? "border-red-500 focus:border-red-500" : ""}
                />
                {getFieldError("year") && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("year")}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="typefuel" className="flex items-center gap-1">
                  Tipo de Combustible *
                  {hasFieldError("typefuel") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Select
                  value={formData.typefuel}
                  onValueChange={(value) => {
                    handleInputChange("typefuel", value)
                    handleBlur("typefuel")
                  }}
                >
                  <SelectTrigger className={hasFieldError("typefuel") ? "border-red-500 focus:border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar combustible" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FUEL_TYPES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError("typefuel") && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("typefuel")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacitygal" className="flex items-center gap-1">
                  Capacidad (galones) *
                  {hasFieldError("capacitygal") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="capacitygal"
                  type="number"
                  value={formData.capacitygal}
                  onChange={(e) => handleInputChange("capacitygal", e.target.value)}
                  onBlur={() => handleBlur("capacitygal")}
                  placeholder="Ej: 5000"
                  step="0.01"
                  className={hasFieldError("capacitygal") ? "border-red-500 focus:border-red-500" : ""}
                />
                {getFieldError("capacitygal") && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("capacitygal")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="flex items-center gap-1">
                Color
                {hasFieldError("color") && <AlertCircle className="h-4 w-4 text-red-500" />}
              </Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                onBlur={() => handleBlur("color")}
                placeholder="Ej: Blanco"
                className={hasFieldError("color") ? "border-red-500 focus:border-red-500" : ""}
              />
              {getFieldError("color") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError("color")}
                </p>
              )}
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
                <Label htmlFor="engineNumber" className="flex items-center gap-1">
                  Número de Motor
                  {hasFieldError("engineNumber") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="engineNumber"
                  value={formData.engineNumber}
                  onChange={(e) => handleInputChange("engineNumber", e.target.value)}
                  onBlur={() => handleBlur("engineNumber")}
                  placeholder="Ej: D13K500"
                  className={hasFieldError("engineNumber") ? "border-red-500 focus:border-red-500" : ""}
                />
                {getFieldError("engineNumber") && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("engineNumber")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="chassisNumber" className="flex items-center gap-1">
                  Número de Chasis
                  {hasFieldError("chassisNumber") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="chassisNumber"
                  value={formData.chassisNumber}
                  onChange={(e) => handleInputChange("chassisNumber", e.target.value.toUpperCase())}
                  onBlur={() => handleBlur("chassisNumber")}
                  placeholder="Ej: 1HGBH41JXMN109186"
                  className={hasFieldError("chassisNumber") ? "border-red-500 focus:border-red-500" : ""}
                />
                {getFieldError("chassisNumber") && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("chassisNumber")}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mileage" className="flex items-center gap-1">
                  Kilometraje Actual
                  {hasFieldError("mileage") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange("mileage", e.target.value)}
                  onBlur={() => handleBlur("mileage")}
                  placeholder="Ej: 150000"
                  step="0.01"
                  className={hasFieldError("mileage") ? "border-red-500 focus:border-red-500" : ""}
                />
                {getFieldError("mileage") && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("mileage")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxWeight" className="flex items-center gap-1">
                  Peso Máximo (kg)
                  {hasFieldError("maxWeight") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="maxWeight"
                  type="number"
                  value={formData.maxWeight}
                  onChange={(e) => handleInputChange("maxWeight", e.target.value)}
                  onBlur={() => handleBlur("maxWeight")}
                  placeholder="Ej: 25000"
                  step="0.01"
                  className={hasFieldError("maxWeight") ? "border-red-500 focus:border-red-500" : ""}
                />
                {getFieldError("maxWeight") && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("maxWeight")}
                  </p>
                )}
              </div>
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

            <div className="space-y-2">
              <Label htmlFor="maintenanceKm" className="flex items-center gap-1">
                Kilometraje del Último Mantenimiento
                {hasFieldError("maintenanceKm") && <AlertCircle className="h-4 w-4 text-red-500" />}
              </Label>
              <Input
                id="maintenanceKm"
                type="number"
                value={formData.maintenanceKm}
                onChange={(e) => handleInputChange("maintenanceKm", e.target.value)}
                onBlur={() => handleBlur("maintenanceKm")}
                placeholder="Ej: 145000"
                step="0.01"
                className={hasFieldError("maintenanceKm") ? "border-red-500 focus:border-red-500" : ""}
              />
              {getFieldError("maintenanceKm") && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getFieldError("maintenanceKm")}
                </p>
              )}
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
                <Label htmlFor="insuranceCompany" className="flex items-center gap-1">
                  Compañía de Seguros
                  {hasFieldError("insuranceCompany") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="insuranceCompany"
                  value={formData.insuranceCompany}
                  onChange={(e) => handleInputChange("insuranceCompany", e.target.value)}
                  onBlur={() => handleBlur("insuranceCompany")}
                  placeholder="Ej: Seguros Bolívar"
                  className={hasFieldError("insuranceCompany") ? "border-red-500 focus:border-red-500" : ""}
                />
                {getFieldError("insuranceCompany") && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("insuranceCompany")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurancePolicy" className="flex items-center gap-1">
                  Número de Póliza
                  {hasFieldError("insurancePolicy") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </Label>
                <Input
                  id="insurancePolicy"
                  value={formData.insurancePolicy}
                  onChange={(e) => handleInputChange("insurancePolicy", e.target.value)}
                  onBlur={() => handleBlur("insurancePolicy")}
                  placeholder="Ej: 123456789"
                  className={hasFieldError("insurancePolicy") ? "border-red-500 focus:border-red-500" : ""}
                />
                {getFieldError("insurancePolicy") && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("insurancePolicy")}
                  </p>
                )}
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
              <Label htmlFor="notes" className="flex items-center gap-1">
                Notas Adicionales
                {hasFieldError("notes") && <AlertCircle className="h-4 w-4 text-red-500" />}
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                onBlur={() => handleBlur("notes")}
                placeholder="Información adicional sobre el vehículo..."
                rows={3}
                className={hasFieldError("notes") ? "border-red-500 focus:border-red-500" : ""}
              />
              <div className="flex justify-between items-center">
                {getFieldError("notes") ? (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("notes")}
                  </p>
                ) : (
                  <div />
                )}
                <span className="text-sm text-muted-foreground">
                  {formData.notes.length}/500
                </span>
              </div>
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