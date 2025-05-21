import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"

// Date range types
export type DateRange = {
  from: Date
  to: Date
}

// Predefined date ranges
export const dateRanges = {
  today: {
    label: "Hoy",
    getValue: (): DateRange => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  yesterday: {
    label: "Ayer",
    getValue: (): DateRange => {
      const yesterday = subDays(new Date(), 1)
      return {
        from: startOfDay(yesterday),
        to: endOfDay(yesterday),
      }
    },
  },
  thisWeek: {
    label: "Esta semana",
    getValue: (): DateRange => ({
      from: startOfWeek(new Date(), { locale: es, weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { locale: es, weekStartsOn: 1 }),
    }),
  },
  thisMonth: {
    label: "Este mes",
    getValue: (): DateRange => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
}

// Format date for display
export function formatDateDisplay(date: Date): string {
  return format(date, "dd/MM/yyyy", { locale: es })
}

// Format date for API
export function formatDateForApi(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

// Format date range for display
export function formatDateRange(range: DateRange): string {
  return `${formatDateDisplay(range.from)} - ${formatDateDisplay(range.to)}`
}

// Filter functions for assignments
export function filterAssignmentsByDate(assignments: any[], dateRange: DateRange): any[] {
  return assignments.filter((assignment) => {
    const assignmentDate = new Date(assignment.date)
    return assignmentDate >= dateRange.from && assignmentDate <= dateRange.to
  })
}

export function filterAssignmentsByTruck(assignments: any[], truckId: number | null): any[] {
  if (!truckId) return assignments
  return assignments.filter((assignment) => assignment.truckId === truckId)
}

export function filterAssignmentsByDriver(assignments: any[], driverId: number | null): any[] {
  if (!driverId) return assignments
  return assignments.filter((assignment) => assignment.driverId === driverId)
}

export function filterAssignmentsByStatus(assignments: any[], status: "completed" | "inProgress" | null): any[] {
  if (!status) return assignments
  return assignments.filter((assignment) => {
    if (status === "completed") return assignment.isCompleted
    if (status === "inProgress") return !assignment.isCompleted
    return true
  })
}

// Filter functions for trucks
export function filterTrucksByState(trucks: any[], state: string | null): any[] {
  if (!state) return trucks
  return trucks.filter((truck) => truck.state === state)
}

export function filterTrucksByFuelType(trucks: any[], fuelType: string | null): any[] {
  if (!fuelType) return trucks
  return trucks.filter((truck) => truck.typefuel === fuelType)
}

// Filter functions for users
export function filterUsersByRole(users: any[], role: string | null): any[] {
  if (!role) return users
  return users.filter((user) => user.role === role)
}

export function filterUsersByState(users: any[], state: string | null): any[] {
  if (!state) return users
  return users.filter((user) => user.state === state)
}

// Search functions
export function searchTrucks(trucks: any[], searchTerm: string): any[] {
  if (!searchTerm) return trucks
  const term = searchTerm.toLowerCase()
  return trucks.filter(
    (truck) =>
      truck.placa.toLowerCase().includes(term) ||
      truck.typefuel.toLowerCase().includes(term) ||
      truck.state.toLowerCase().includes(term),
  )
}

export function searchUsers(users: any[], searchTerm: string): any[] {
  if (!searchTerm) return users
  const term = searchTerm.toLowerCase()
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(term) ||
      user.lastname.toLowerCase().includes(term) ||
      user.dni.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term),
  )
}

export function searchCustomers(customers: any[], searchTerm: string): any[] {
  if (!searchTerm) return customers
  const term = searchTerm.toLowerCase()
  return customers.filter(
    (customer) =>
      customer.companyname.toLowerCase().includes(term) ||
      customer.ruc.toLowerCase().includes(term) ||
      customer.address.toLowerCase().includes(term) ||
      (customer.contactName && customer.contactName.toLowerCase().includes(term)),
  )
}
