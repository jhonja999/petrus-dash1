export const FUEL_TYPES = {
  DIESEL_B5: "Diesel B5",
  GASOLINA_90: "Gasolina 90",
  GASOLINA_95: "Gasolina 95",
  GLP: "Gas Licuado de Petróleo",
  ELECTRICA: "Eléctrica",
} as const

export type FuelType = keyof typeof FUEL_TYPES

export const TRUCK_STATES = {
  Activo: "Activo",
  Inactivo: "Inactivo",
  Mantenimiento: "En Mantenimiento",
  Transito: "En Tránsito",
  Descarga: "En Descarga",
  Asignado: "Asignado",
} as const

export type TruckState = keyof typeof TRUCK_STATES

export const USER_STATES = {
  Activo: "Activo",
  Inactivo: "Inactivo",
  Suspendido: "Suspendido",
  Eliminado: "Eliminado",
  Asignado: "Asignado",
} as const

export type UserState = keyof typeof USER_STATES

export const ROLES = {
  Conductor: "Conductor",
  ADMIN: "Administrador",
} as const

export type Role = keyof typeof ROLES

export const LICENSE_TYPES = {
  A1: "A1 - Motocicletas hasta 125cc",
  A2: "A2 - Motocicletas hasta 400cc",
  A3: "A3 - Motocicletas de cualquier cilindrada",
  B1: "B1 - Automóviles hasta 3.5 toneladas",
  B2A: "B2A - Camiones hasta 7.5 toneladas",
  B2B: "B2B - Camiones hasta 15 toneladas",
  B2C: "B2C - Camiones de más de 15 toneladas",
  B3: "B3 - Vehículos articulados",
  B4: "B4 - Transporte de pasajeros",
} as const

export type LicenseType = keyof typeof LICENSE_TYPES
