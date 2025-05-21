"use client"

import { useState, useCallback } from "react"

type FilterState<T> = {
  [K in keyof T]?: T[K]
}

export function useFilters<T extends Record<string, any>>(initialFilters: FilterState<T> = {}) {
  const [filters, setFilters] = useState<FilterState<T>>(initialFilters)

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K] | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({})
  }, [])

  const applyFilters = useCallback(
    (items: T[]): T[] => {
      return items.filter((item) => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null) return true

          const itemValue = item[key]

          // Handle array values (e.g., for tags or categories)
          if (Array.isArray(value)) {
            if (Array.isArray(itemValue)) {
              return value.some((v) => itemValue.includes(v))
            }
            return value.includes(itemValue)
          }

          // Handle date ranges
          if (value && typeof value === "object" && "from" in value && "to" in value) {
            const date = new Date(itemValue)
            return date >= value.from && date <= value.to
          }

          // Handle string search (case insensitive)
          if (typeof itemValue === "string" && typeof value === "string") {
            return itemValue.toLowerCase().includes(value.toLowerCase())
          }

          // Handle exact match
          return itemValue === value
        })
      })
    },
    [filters],
  )

  return {
    filters,
    updateFilter,
    resetFilters,
    applyFilters,
  }
}
