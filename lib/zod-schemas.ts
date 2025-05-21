import { z } from "zod"

export const userSchema = z.object({
  dni: z.string().min(8).max(12),
  name: z.string().min(2).max(50),
  lastname: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(["Conductor", "ADMIN"]),
  state: z.enum(["Activo", "Inactivo", "Suspendido", "Eliminado", "Asignado"]),
})

export const truckSchema = z.object({
  placa: z.string().min(6).max(10),
  typefuel: z.enum(["DIESEL_B5", "GASOLINA_90", "GASOLINA_95", "GLP", "ELECTRICA"]),
  capacitygal: z.coerce.number().positive(),
  state: z.enum(["Activo", "Inactivo", "Mantenimiento", "Transito", "Descarga", "Asignado"]),
})

export const customerSchema = z.object({
  companyname: z.string().min(2).max(100),
  ruc: z.string().length(11),
  address: z.string().min(5).max(200),
  contactName: z.string().min(2).max(100).optional(),
  contactPhone: z.string().min(9).max(15).optional(),
  contactEmail: z.string().email().optional(),
})

export const assignmentSchema = z.object({
  truckId: z.coerce.number().int().positive(),
  driverId: z.coerce.number().int().positive(),
  totalLoaded: z.coerce.number().positive(),
  fuelType: z.enum(["DIESEL_B5", "GASOLINA_90", "GASOLINA_95", "GLP", "ELECTRICA"]),
  notes: z.string().max(500).optional(),
  customers: z.array(z.coerce.number().int().positive()).min(1),
})

export const dischargeSchema = z.object({
  assignmentId: z.coerce.number().int().positive(),
  customerId: z.coerce.number().int().positive(),
  startMarker: z.coerce.number().nonnegative(),
  endMarker: z.coerce.number().positive(),
  notes: z.string().max(500).optional(),
})
