// types/globals.d.ts

export type UserRole = "admin" | "conductor"
export type UserState = "Activo" | "Inactivo" | "Suspendido" | "Eliminado" | "Asignado"
export type TruckState = "Activo" | "Inactivo" | "Mantenimiento" | "Transito" | "Descarga" | "Asignado"
export type FuelType = "DIESEL_B5" | "GASOLINA_90" | "GASOLINA_95" | "GLP" | "ELECTRICA"

export interface SessionClaims {
  metadata?: {
    role?: UserRole;
  };
}

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: UserRole
    }
  }
}

export interface User {
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

export interface Truck {
  id: number
  placa: string
  typefuel: FuelType
  capacitygal: number
  state: TruckState
  createdAt: string
  updatedAt: string
}

export interface Customer {
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

export interface Assignment {
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

export interface Discharge {
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

export interface DashboardStats {
  trucksCount: number
  activeDrivers: number
  customersCount: number
  todayAssignments: number
  totalFuelToday: number
  truckStateData: { state: TruckState; count: number }[]
}

export interface FuelConsumption {
  fuelType: FuelType
  total: number
}

export interface AssignmentsByPeriod {
  period: string
  count: number
}

export interface TruckFormValues {
  placa: string
  typefuel: FuelType
  capacitygal: number
  state: TruckState
}

export interface UserFormValues {
  dni: string
  name: string
  lastname: string
  email: string
  role: UserRole
  state: UserState
}

export interface CustomerFormValues {
  companyname: string
  ruc: string
  address: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
}

export interface AssignmentFormValues {
  truckId: number
  driverId: number
  totalLoaded: number
  fuelType: FuelType
  notes?: string
  customers: number[]
}

export interface DischargeFormValues {
  assignmentId: number
  customerId: number
  startMarker: number
  endMarker: number
  notes?: string
}
