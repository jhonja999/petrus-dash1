"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type DriverAssignment = {
  id: number
  truck: {
    placa: string
    state: string
  }
  totalLoaded: number
  totalRemaining: number
  fuelType: string
  discharges: {
    id: number
    customerId: number
    totalDischarged: number
    customer: {
      companyname: string
      address: string
    }
  }[]
}

export function useDriverData() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<DriverAssignment[]>([])
  const [activeTruck, setActiveTruck] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/assignments?active=true")

        if (!response.ok) {
          throw new Error("Error al cargar las asignaciones")
        }

        const data = await response.json()
        setAssignments(data.assignments || [])
        setActiveTruck(data.activeTruck || null)
      } catch (error) {
        console.error("Error fetching driver data:", error)
        setError("No se pudieron cargar los datos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const refreshData = () => {
    router.refresh()
  }

  return {
    assignments,
    activeTruck,
    isLoading,
    error,
    refreshData,
  }
}
