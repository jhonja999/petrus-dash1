import { z } from "zod";

export const userSchema = z.object({
  dni: z
    .string()
    .min(8, "DNI debe tener al menos 8 caracteres")
    .max(12, "DNI no puede tener más de 12 caracteres"),
  name: z
    .string()
    .min(2, "Nombre debe tener al menos 2 caracteres")
    .max(50, "Nombre no puede tener más de 50 caracteres"),
  lastname: z
    .string()
    .min(2, "Apellido debe tener al menos 2 caracteres")
    .max(50, "Apellido no puede tener más de 50 caracteres"),
  email: z.string().email("Debe ser un email válido"),
  role: z.enum(["Conductor", "ADMIN"], {
    required_error: "Debe seleccionar un rol",
  }),
  state: z
    .enum(["Activo", "Inactivo", "Suspendido", "Eliminado", "Asignado"])
    .optional(),

  // Optional fields - undefined if not provided
  licenseNumber: z
    .string()
    .min(8, "Número de licencia debe tener al menos 8 caracteres")
    .optional(),
  licenseType: z
    .enum(["A1", "A2", "A3", "B1", "B2A", "B2B", "B2C", "B3", "B4"])
    .optional(),
  licenseExpiry: z.coerce.date().optional().nullable(),
  phone: z
    .string()
    .min(9, "Teléfono debe tener al menos 9 caracteres")
    .optional(),
  address: z
    .string()
    .min(10, "Dirección debe tener al menos 10 caracteres")
    .optional(),
  emergencyContact: z
    .string()
    .min(2, "Nombre de contacto debe tener al menos 2 caracteres")
    .optional(),
  emergencyPhone: z
    .string()
    .min(9, "Teléfono de emergencia debe tener al menos 9 caracteres")
    .optional(),
});

export const truckSchema = z.object({
  placa: z
    .string()
    .min(6, "Placa debe tener al menos 6 caracteres")
    .max(10, "Placa no puede tener más de 10 caracteres"),
  typefuel: z.enum(
    ["DIESEL_B5", "GASOLINA_90", "GASOLINA_95", "GLP", "ELECTRICA"],
    {
      required_error: "Debe seleccionar un tipo de combustible",
    }
  ),
  capacitygal: z.coerce
    .number()
    .positive("Capacidad debe ser un número positivo"),
  state: z
    .enum([
      "Activo",
      "Inactivo",
      "Mantenimiento",
      "Transito",
      "Descarga",
      "Asignado",
    ])
    .optional(),

  // Optional technical specifications
  brand: z
    .string()
    .min(2, "Marca debe tener al menos 2 caracteres")
    .optional()
    .or(z.literal("")),
  model: z
    .string()
    .min(2, "Modelo debe tener al menos 2 caracteres")
    .optional()
    .or(z.literal("")),
  year: z.coerce
    .number()
    .int()
    .min(1990, "Año debe ser mayor a 1990")
    .max(new Date().getFullYear(), "Año no puede ser futuro")
    .optional()
    .nullable(),
  engineNumber: z
    .string()
    .min(5, "Número de motor debe tener al menos 5 caracteres")
    .optional()
    .or(z.literal("")),
  chassisNumber: z
    .string()
    .min(10, "Número de chasis debe tener al menos 10 caracteres")
    .optional()
    .or(z.literal("")),
  color: z
    .string()
    .min(3, "Color debe tener al menos 3 caracteres")
    .optional()
    .or(z.literal("")),
  mileage: z.coerce
    .number()
    .nonnegative("Kilometraje no puede ser negativo")
    .optional()
    .nullable(),
  maxWeight: z.coerce
    .number()
    .positive("Peso máximo debe ser positivo")
    .optional()
    .nullable(),

  // Optional maintenance info
  lastMaintenance: z.coerce.date().optional().nullable(),
  nextMaintenance: z.coerce.date().optional().nullable(),
  maintenanceKm: z.coerce
    .number()
    .nonnegative("Kilometraje de mantenimiento no puede ser negativo")
    .optional()
    .nullable(),

  // Optional insurance info
  insuranceCompany: z
    .string()
    .min(2, "Compañía de seguro debe tener al menos 2 caracteres")
    .optional()
    .or(z.literal("")),
  insurancePolicy: z
    .string()
    .min(5, "Número de póliza debe tener al menos 5 caracteres")
    .optional()
    .or(z.literal("")),
  insuranceExpiry: z.coerce.date().optional().nullable(),

  // Optional notes
  notes: z
    .string()
    .max(500, "Notas no pueden tener más de 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export const customerSchema = z.object({
  companyname: z
    .string()
    .min(2, "Nombre de empresa debe tener al menos 2 caracteres")
    .max(100, "Nombre de empresa no puede tener más de 100 caracteres"),
  ruc: z.string().length(11, "El RUC debe tener exactamente 11 dígitos"),
  address: z
    .string()
    .min(5, "Dirección debe tener al menos 5 caracteres")
    .max(200, "Dirección no puede tener más de 200 caracteres"),
  contactName: z
    .string()
    .min(2, "Nombre de contacto debe tener al menos 2 caracteres")
    .optional()
    .or(z.literal("")),
  contactPhone: z
    .string()
    .min(7, "Teléfono debe tener al menos 7 caracteres")
    .max(15, "Teléfono no puede tener más de 15 caracteres")
    .optional()
    .or(z.literal("")),
  contactEmail: z
    .string()
    .email("Debe ser un email válido")
    .optional()
    .or(z.literal("")),
});

export const assignmentSchema = z.object({
  truckId: z.coerce
    .number()
    .int()
    .positive("ID de camión debe ser un número positivo"),
  driverId: z.coerce
    .number()
    .int()
    .positive("ID de conductor debe ser un número positivo"),
  totalLoaded: z.coerce
    .number()
    .positive("Total cargado debe ser un número positivo"),
  fuelType: z.enum(
    ["DIESEL_B5", "GASOLINA_90", "GASOLINA_95", "GLP", "ELECTRICA"],
    {
      required_error: "Debe seleccionar un tipo de combustible",
    }
  ),
  notes: z
    .string()
    .max(500, "Notas no pueden tener más de 500 caracteres")
    .optional(),
  customers: z
    .array(z.coerce.number().int().positive())
    .min(1, "Debe seleccionar al menos un cliente"),
});

export const dischargeSchema = z.object({
  assignmentId: z.coerce
    .number()
    .int()
    .positive("ID de asignación debe ser un número positivo"),
  customerId: z.coerce
    .number()
    .int()
    .positive("ID de cliente debe ser un número positivo"),
  startMarker: z.coerce
    .number()
    .nonnegative("Marcador inicial no puede ser negativo"),
  endMarker: z.coerce
    .number()
    .positive("Marcador final debe ser un número positivo"),
  notes: z
    .string()
    .max(500, "Notas no pueden tener más de 500 caracteres")
    .optional(),
});
