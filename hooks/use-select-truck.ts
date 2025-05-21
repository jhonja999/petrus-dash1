"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TrucksApi } from "@/lib/api"

export function useSelectTruck() {
  const router = useRouter()
  const [trucks, setTrucks] = useState<any[]>([])
  const [selectedTruck, setSelectedTruck] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrucks = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await TrucksApi.getAll("Activo")
        setTrucks(data)
      } catch (error: any) {
        console.error("Error fetching trucks:", error)
        setError(error.message || "Error al cargar los camiones disponibles")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrucks()
  }, [])

  const handleSelectTruck = async () => {
    if (!selectedTruck) {
      setError("Debes seleccionar un camión")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await TrucksApi.updateStatus(selectedTruck, "Asignado")
      router.push("/driver")
      router.refresh()
    } catch (error: any) {
      console.error("Error selecting truck:", error)
      setError(error.message || "Error al asignar el camión. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    trucks,
    selectedTruck,
    setSelectedTruck,
    isLoading,
    isSubmitting,
    error,
    handleSelectTruck,
  }
}
