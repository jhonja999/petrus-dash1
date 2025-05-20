import { z } from "zod"

// Esquema para validación de usuarios
export const userSchema = z.object({
  dni: z.string().min(8).max(12),
  name: z.string().min(2).max(50),
  lastname: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(["ADMIN", "Conductor"]),
  state: z.enum(["Activo", "Inactivo", "Suspendido", "Eliminado", "Asignado"]),
})

// Esquema para validación de camiones
export const truckSchema = z.object({
  placa: z.string().min(6).max(7),
  typefuel: z.string(),
  capacitygal: z.number().positive(),
  state: z.enum(["Activo", "Inactivo", "Mantenimiento", "Transito", "Descarga", "Asignado"]),
})

// Esquema para validación de asignaciones
export const assignmentSchema = z.object({
  truckId: z.number().int().positive(),
  driverId: z.number().int().positive(),
  totalLoaded: z.number().positive(),
  totalRemaining: z.number().positive(),
  fuelType: z.string(),
  notes: z.string().optional(),
  isCompleted: z.boolean().default(false),
})

// Esquema para validación de descargas
export const dischargeSchema = z.object({
  assignmentId: z.number().int().positive(),
  customerId: z.number().int().positive(),
  totalDischarged: z.number().positive(),
  notes: z.string().optional(),
})

// Esquema para validación de clientes
export const customerSchema = z.object({
  companyname: z.string().min(2).max(100),
  ruc: z.string().length(11),
  address: z.string().min(5),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
})
