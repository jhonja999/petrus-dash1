// Global type definitions for the application

// Truck types
type TruckState = "Activo" | "Inactivo" | "Mantenimiento" | "Transito" | "Descarga" | "Asignado"
type FuelType = "DIESEL_B5" | "GASOLINA_90" | "GASOLINA_95" | "GLP" | "ELECTRICA"

interface Truck {
  id: number
  placa: string
  typefuel: FuelType
  capacitygal: number
  state: TruckState
  createdAt: string
  updatedAt: string
}

// User types
type UserRole = "Conductor" | "ADMIN"
type UserState = "Activo" | "Inactivo" | "Suspendido" | "Eliminado" | "Asignado"

interface User {
  id: number
  clerkId?: string
  dni: string
  name: string
  lastname: string
  email: string
  role: UserRole
  state: UserState
  createdAt: string
  updatedAt: string
}

// Customer types
interface Customer {
  id: number
  companyname: string
  ruc: string
  address: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  createdAt: string
  updatedAt: string
}

// Assignment types
interface Assignment {
  id: number
  truckId: number
  driverId: number
  date: string
  totalLoaded: number
  totalRemaining: number
  fuelType: FuelType
  isCompleted: boolean
  notes?: string
  createdAt: string
  updatedAt: string
  truck?: Truck
  driver?: User
  discharges?: Discharge[]
}

// Discharge types
interface Discharge {
  id: number
  assignmentId: number
  customerId: number
  startMarker: number
  endMarker: number
  totalDischarged: number
  notes?: string
  createdAt: string
  updatedAt: string
  assignment?: Assignment
  customer?: Customer
}

// Analytics types
interface DashboardStats {
  trucksCount: number
  activeDrivers: number
  customersCount: number
  todayAssignments: number
  totalFuelToday: number
  truckStateData: { state: string; count: number }[]
}

interface FuelConsumption {
  fuelType: string
  total: number
}

interface AssignmentsByPeriod {
  period: string
  count: number
}

// Form types
interface TruckFormValues {
  placa: string
  typefuel: FuelType
  capacitygal: number
  state: TruckState
}

interface UserFormValues {
  dni: string
  name: string
  lastname: string
  email: string
  role: UserRole
  state: UserState
}

interface CustomerFormValues {
  companyname: string
  ruc: string
  address: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
}

interface AssignmentFormValues {
  truckId: number
  driverId: number
  totalLoaded: number
  fuelType: FuelType
  notes?: string
  customers: number[]
}

interface DischargeFormValues {
  assignmentId: number
  customerId: number
  startMarker: number
  endMarker: number
  notes?: string
}
