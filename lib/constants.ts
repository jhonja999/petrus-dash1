export const FUEL_TYPES = {
  DIESEL_B5: "Diesel B5",
  GASOLINA_90: "Gasolina 90",
  GASOLINA_95: "Gasolina 95",
  GLP: "GLP",
  ELECTRICA: "Eléctrica",
} as const

export type FuelType = keyof typeof FUEL_TYPES

export const TRUCK_STATES = {
  Activo: "Activo",
  Inactivo: "Inactivo",
  Mantenimiento: "Mantenimiento",
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
