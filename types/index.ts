export interface User {
  id: number
  dni: string
  name: string
  lastname: string
  email: string
  password?: string
  clerkId?: string | null
  role: "Conductor" | "ADMIN"
  state: "Activo" | "Inactivo" | "Suspendido" | "Eliminado" | "Asignado"
  licenseNumber?: string | null
  licenseType?: string | null
  licenseExpiry?: Date | null
  phone?: string | null
  address?: string | null
  emergencyContact?: string | null
  emergencyPhone?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Truck {
  id: number
  placa: string
  typefuel: "DIESEL_B5" | "GASOLINA_90" | "GASOLINA_95" | "GLP" | "ELECTRICA"
  capacitygal: number
  state: "Activo" | "Inactivo" | "Mantenimiento" | "Transito" | "Descarga" | "Asignado"
  brand?: string | null
  model?: string | null
  year?: number | null
  engineNumber?: string | null
  chassisNumber?: string | null
  color?: string | null
  mileage?: number | null
  maxWeight?: number | null
  lastMaintenance?: Date | null
  nextMaintenance?: Date | null
  maintenanceKm?: number | null
  insuranceCompany?: string | null
  insurancePolicy?: string | null
  insuranceExpiry?: Date | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: number
  companyname: string
  ruc: string
  address: string
  contactName?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Assignment {
  id: number
  truckId: number
  driverId: number
  totalLoaded: number
  totalRemaining: number
  fuelType: "DIESEL_B5" | "GASOLINA_90" | "GASOLINA_95" | "GLP" | "ELECTRICA"
  notes?: string | null
  isCompleted: boolean
  date: Date
  createdAt: Date
  updatedAt: Date
  truck?: Truck
  driver?: User
}
