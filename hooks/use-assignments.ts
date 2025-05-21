"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AssignmentsApi } from "@/lib/api"
import {
  type DateRange,
  filterAssignmentsByDate,
  filterAssignmentsByTruck,
  filterAssignmentsByDriver,
  filterAssignmentsByStatus,
} from "@/lib/filters"

type AssignmentFilters = {
  dateRange: DateRange | null
  truckId: number | null
  driverId: number | null
  status: "completed" | "inProgress" | null
}

export function useAssignments() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<any[]>([])
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AssignmentFilters>({
    dateRange: null,
    truckId: null,
    driverId: null,
    status: null,
  })

  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await AssignmentsApi.getAll()
        setAssignments(data)
        setFilteredAssignments(data)
      } catch (error: any) {
        console.error("Error fetching assignments:", error)
        setError(error.message || "Error al cargar las asignaciones")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  useEffect(() => {
    let result = [...assignments]

    // Apply filters
    if (filters.dateRange) {
      result = filterAssignmentsByDate(result, filters.dateRange)
    }

    if (filters.truckId) {
      result = filterAssignmentsByTruck(result, filters.truckId)
    }

    if (filters.driverId) {
      result = filterAssignmentsByDriver(result, filters.driverId)
    }

    if (filters.status) {
      result = filterAssignmentsByStatus(result, filters.status)
    }

    setFilteredAssignments(result)
  }, [assignments, filters])

  const updateFilters = (newFilters: Partial<AssignmentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      dateRange: null,
      truckId: null,
      driverId: null,
      status: null,
    })
  }

  const refreshData = () => {
    router.refresh()
  }

  return {
    assignments: filteredAssignments,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshData,
  }
}
