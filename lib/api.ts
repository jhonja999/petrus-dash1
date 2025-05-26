/**
 * Utility functions for API calls
 */

// Generic fetch function with error handling
export async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    throw error
  }
}

// Trucks API
export const TrucksApi = {
  getAll: (state?: string) => fetchApi<any[]>(`/api/trucks${state ? `?state=${state}` : ""}`),
  getById: (id: number) => fetchApi<any>(`/api/trucks/${id}`),
  create: (data: any) =>
    fetchApi<any>("/api/trucks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    fetchApi<any>(`/api/trucks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  updateStatus: (truckId: number, newState: string) =>
    fetchApi<any>("/api/trucks/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ truckId, newState }),
    }),
  delete: (id: number) => fetchApi<any>(`/api/trucks/${id}`, { method: "DELETE" }),
}

// Users API
export const UsersApi = {
  getAll: (role?: string, state?: string) => {
    const params = new URLSearchParams()
    if (role) params.append("role", role)
    if (state) params.append("state", state)
    return fetchApi<any[]>(`/api/users${params.toString() ? `?${params.toString()}` : ""}`)
  },
  getById: (id: number) => fetchApi<any>(`/api/users/${id}`),
  create: (data: any) =>
    fetchApi<any>("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    fetchApi<any>(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (id: number) => fetchApi<any>(`/api/users/${id}`, { method: "DELETE" }),
}

// Customers API
export const CustomersApi = {
  getAll: () => fetchApi<any[]>("/api/customers"),
  getById: (id: number) => fetchApi<any>(`/api/customers/${id}`),
  create: (data: any) =>
    fetchApi<any>("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    fetchApi<any>(`/api/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (id: number) => fetchApi<any>(`/api/customers/${id}`, { method: "DELETE" }),
}

// Assignments API
export const AssignmentsApi = {
  getAll: () => fetchApi<any[]>("/api/assignments"),
  getById: (id: number) => fetchApi<any>(`/api/assignments/${id}`),
  create: (data: any) =>
    fetchApi<any>("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    fetchApi<any>(`/api/assignments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  complete: (id: number) =>
    fetchApi<any>(`/api/assignments/${id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }),
}

// Discharges API
export const DischargesApi = {
  create: (data: any) =>
    fetchApi<any>("/api/discharges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    fetchApi<any>(`/api/discharges/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
}

// Analytics API
export const AnalyticsApi = {
  getDashboardStats: () => fetchApi<any>("/api/analytics/dashboard-stats"),
  getFuelConsumption: (period = "day") => fetchApi<any[]>(`/api/analytics/fuel-consumption?period=${period}`),
  getAssignments: (period = "day") => fetchApi<any[]>(`/api/analytics/assignments?period=${period}`),
  getTrucksStatus: () => fetchApi<any[]>("/api/analytics/trucks-status"),
}

// Helper functions for common API calls
import type { User, Truck, Customer, Assignment } from "@/types"

export async function fetchUsers(role?: string | null, state?: string | null): Promise<User[]> {
  const params = new URLSearchParams()
  if (role) params.append("role", role)
  if (state) params.append("state", state)

  const response = await fetch(`/api/users?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }
  return response.json()
}

export async function fetchTrucks(state?: string | null): Promise<Truck[]> {
  const params = new URLSearchParams()
  if (state) params.append("state", state)

  const response = await fetch(`/api/trucks?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch trucks")
  }
  return response.json()
}

export async function fetchCustomers(): Promise<Customer[]> {
  const response = await fetch("/api/customers")
  if (!response.ok) {
    throw new Error("Failed to fetch customers")
  }
  return response.json()
}

export async function fetchAssignments(): Promise<Assignment[]> {
  const response = await fetch("/api/assignments")
  if (!response.ok) {
    throw new Error("Failed to fetch assignments")
  }
  return response.json()
}
